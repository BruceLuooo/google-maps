<script>
  import { ref, reactive, onMounted, toRaw, watch, toRef } from 'vue';
  import { Loading } from '@/constants'

  export default {
    props: {
    searchResults: {
      type: Array,
      required: true,
    },
    },
    setup(props) {
      const map = ref(null);
      const marker = reactive({markers: []})
      const myPropRef = toRef(props, 'searchResults');

      onMounted(() => {
        const loader = Loading
        loader.load().then(() => {
          initMap();
        });
      });

      async function initMap() {
        const { Map } = await window.google.maps.importLibrary('maps');
        map.value = new Map(document.getElementById('map'), {
          center: { lat: 43.786370, lng: -79.463070 },
          zoom: 10,
          mapId: "4504f8b37365c3d0",
        });
      }

      watch(props.searchResults, () => {
        marker.markers.forEach(marker => {
          marker.setVisible(false);
        });

        marker.markers = [];

        myPropRef.value.forEach(async (prop) => {
          const {Marker} = await window.google.maps.importLibrary("marker");
          
          const newMarker = new Marker({
            position: { lat: prop.lat, lng: prop.lng },
            map: toRaw(map.value),
            title: prop.name
          });

          const infowindow = new window.google.maps.InfoWindow({
            content: `<div>${prop.name}</div><div>${prop.address}</div>`,
          });

          newMarker.addListener("click", () => {
            map.value.setZoom(16);
            map.value.setCenter(newMarker.getPosition());
            infowindow.open({
              anchor: newMarker,
              map
            })
          });
          marker.markers.push(newMarker);
        })
      })
      return {
        map,
      };
    },
  };
</script>

<template>
  <div id="map" style="height: 100%; width:100%; position: relative"></div>
  <div id="marker"></div>
</template>

<style>
  .map {
    display: flex;
    width: 100%;
  }
</style>

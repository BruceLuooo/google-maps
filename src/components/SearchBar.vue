<script>
  import {
    ref,
    onMounted,
    onBeforeUnmount,
    defineComponent,
    getCurrentInstance,
  } from 'vue';
  import { Loading } from '@/constants';
  import axios from 'axios';

  export default defineComponent({
    emits: ['searching', 'getTimeZone'],
    setup() {
      const searchInput = ref('');
      const searchResults = ref([]);
      const map = ref(null);
      const textInput = ref(null);
      const { emit } = getCurrentInstance();

      onMounted(() => {
        const loader = Loading;
        textInput.value.addEventListener('keyup', handleKeyPress);
        loader.load().then(() => {
          initMap();
        });
      });

      onBeforeUnmount(() => {
        textInput.value.removeEventListener('keyup', handleKeyPress);
      });

      async function initMap() {
        const { Map } = await window.google.maps.importLibrary('maps');
        map.value = new Map(document.getElementById('map'), {
          center: { lat: 43.78637, lng: -79.46307 },
          zoom: 15,
          mapId: '4504f8b37365c3d0',
        });
      }

      async function findLocation() {
        const service = new window.google.maps.places.PlacesService(map.value);

        const request = {
          query: searchInput.value,
          fields: ['name', 'geometry'],
        };

        service.textSearch(request, (results, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            emit('searching', results, searchInput);

            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            const timestamp = Math.floor(Date.now() / 1000);

            var config = {
              method: 'get',
              url: `https://maps.googleapis.com/maps/api/timezone/json?location=${lat}%2C${lng}&timestamp=${timestamp}&key=${process.env.VUE_APP_GOOGLE_MAPS_API}`,
              headers: {},
            };

            axios(config)
              .then(function (response) {
                emit('getTimeZone', response.data);
              })
              .catch(function (error) {
                console.log(error);
              });
          }
        });
      }

      const handleKeyPress = event => {
        if (event.keyCode === 13) {
          findLocation();
        }
      };

      return {
        searchInput,
        searchResults,
        findLocation,
        textInput,
      };
    },
  });
</script>

<template class="main-container">
	<div class="search-bar">
		<input
			type="text"
			class="form-control"
			v-model="searchInput"
			ref="textInput"
			placeholder="Search Maps"
		/>
		<button type="button" class="btn btn-primary btn-sm" @click="findLocation">
			Search
		</button>
	</div>
</template>

<style>
.search-bar {
	display: flex;
	gap: 6px;
}

.main-container {
	display: flex;
	flex-direction: column;
}
</style>

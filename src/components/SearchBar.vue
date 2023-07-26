<script>
  import { ref, onMounted, onBeforeUnmount, defineComponent, getCurrentInstance } from 'vue';
  import { Loading } from '@/constants'

  export default defineComponent ({
    emits: ["searching"],
    setup() {
      const searchInput = ref('')
      const searchResults = ref([])
      const map = ref(null);
      const textInput = ref(null);
      const {emit} = getCurrentInstance()

      onMounted(() => {
        const loader = Loading
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
          center: { lat: 43.786370, lng: -79.463070 },
          zoom: 15,
          mapId: "4504f8b37365c3d0",
        });
      }

      async function findLocation() {
        const service = new window.google.maps.places.PlacesService(map.value);

        const request = {
          query: searchInput.value,
          fields: ['name', 'geometry'],
        };

        service.textSearch(request, (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            emit('searching', results, searchInput)
          }
        });
      }

      const handleKeyPress = (event) => {
      if (event.keyCode === 13) {
        findLocation();
      }
    };

      return {
        searchInput,
        searchResults,
        findLocation,
        textInput
      }
    }
  });
</script>

<template class="main-container">
  <div class="search-bar">
    <input type="text" class="form-control" v-model="searchInput" ref="textInput" placeholder="Search Maps">
    <button type="button" class="btn btn-primary btn-sm" @click="findLocation">Search</button>
  </div>
</template>

<style>
  .search-bar{
    display: flex;
    gap: 6px;
  }

  .main-container {
    display: flex;
    flex-direction: column;
  }
</style>



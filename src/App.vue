<script>
import SearchBar from "./components/SearchBar.vue";
import MapView from './components/MapView.vue'
import {reactive, ref, computed, watch } from "vue";
import {filterResults, filterHistory} from './hooks'


export default {
  name: 'App',
  components: {
    SearchBar,
    MapView,
  },
  setup() {
    const search = reactive({results: []});
    const allSearchedPlaces = reactive({searchHistory: []})
    const id = ref(0)
    const checkedItems = ref([]);
    const currentPage = ref(1)
    const itemsPerPage = 10

    function getUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          search.results.push({name: 'My Location', lat: position.coords.latitude, lng: position.coords.longitude, address: ''})
          allSearchedPlaces.searchHistory.push({name: 'My Location', lat: position.coords.latitude, lng: position.coords.longitude, address: '' })
        })}
    }

    const updateMap = async (locations, searchInput) => {
      locations.map((location) => {
        const lat = location.geometry.location.lat()
        const lng = location.geometry.location.lng()
        search.results.push({name: location.name, address: location.formatted_address, lat: lat, lng:lng, id: id.value})
      })
      allSearchedPlaces.searchHistory.push({id: id.value, name: searchInput.value})
      id.value = id.value + 1
    };

    const deleteLocation = () => {
      const filteredResult = filterResults(search, checkedItems)
      const filteredSearchHistory = filterHistory(allSearchedPlaces, checkedItems)

      search.results.splice(0, search.results.length, ...filteredResult);
      allSearchedPlaces.searchHistory.splice(0, allSearchedPlaces.searchHistory.length, ...filteredSearchHistory)
      checkedItems.value.splice(0, checkedItems.value.length)
    }

    function toggleChecked(search) {
      const index = checkedItems.value.indexOf(search);
      if (index === -1) {
        checkedItems.value.push(search);
      } else {
        checkedItems.value.splice(index, 1);
      }
    }

    const displayLocations = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return allSearchedPlaces.searchHistory.slice(start, end);
    });
    function goToPage(newPage) {
      if (newPage >= 1 && newPage <= pageCount.value) {
        currentPage.value = newPage;
      }
    }
    const pageCount = computed(() => Math.ceil(allSearchedPlaces.searchHistory.length / itemsPerPage));
    const showDeleteButton = computed(() => checkedItems.value.length > 0);

    watch(allSearchedPlaces.searchHistory, () => {
      if (currentPage.value > pageCount.value) {
        goToPage(currentPage.value - 1);
      }
    });

    return {
      getUserLocation,
      updateMap,
      showDeleteButton,
      checkedItems,
      deleteLocation,
      toggleChecked,
      displayLocations,
      pageCount,
      goToPage,
      currentPage,
      searchResults : search.results,
      searchHistory : allSearchedPlaces.searchHistory
    }
  }
}
</script>

<template>
  <div class='main-container'>
    <div class="left-side">
      <SearchBar @searching="updateMap"/>
      <button type="button" class="btn btn-success btn-lg" @click="getUserLocation">My Location</button>
      <button class="btn btn-danger p-2" v-if="showDeleteButton" @click="deleteLocation">Delete</button>
      <div v-for="(search) in displayLocations" :key="search.id" class="search-history">
        <div class="w-100 d-flex align-items-center gap-3 p-2">
          <input class="checkbox" style="cursor: pointer;" type="checkbox" @click="toggleChecked(search)" :id="`checkbox-${search.id}`">
          <label style="font-size: 18px; cursor: pointer;" :for="`checkbox-${search.id}`" >{{ search.name }}</label>
        </div>
      </div>
      <div v-if="searchHistory.length > 10" class="d-flex align-items-center gap-2">
        <button class="btn btn-md btn-primary" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">Prev</button>
        <span style="font-size: 18px;">{{ currentPage }} / {{ pageCount }}</span>
        <button class="btn btn-primary" @click="goToPage(currentPage + 1)" :disabled="searchHistory.length <= 3 || currentPage === pageCount">Next</button>
      </div>
    </div>
    <div class="right-side">
      <MapView :searchResults="searchResults" />
    </div>
  </div>
</template>




<style>
.main-container {
  display: flex;
  flex-direction: row;
}
.left-side {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 10px;
  height: 100vh;
  width: 450px;
  padding: 8px;
  padding-left: 14px;
}

.checkbox {
  height: 20px;
  width: 20px;
}
.right-side {
  width: 100%;
  position: relative;
}

.search-history {
  display: flex;
  gap: 4px;
}
</style>

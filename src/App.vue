<script>
	import SearchBar from './components/SearchBar.vue';
	import MapView from './components/MapView.vue';
	import GetUserLocation from './components/GetUserLocation.vue';
	import DeleteButton from './components/DeleteButton.vue';
	import SeaerchHistory from './components/SeaerchHistory.vue';
	import { reactive, ref, computed, provide, watch } from 'vue';

	export default {
		name: 'App',
		components: {
			SearchBar,
			MapView,
			GetUserLocation,
			DeleteButton,
			SeaerchHistory,
		},
		setup() {
			const search = reactive({ results: [] });
			const allSearchedPlaces = reactive({ searchHistory: [] });
			const id = ref(0);
			const checkedItems = ref([]);
			const currentPage = ref(1);
			const itemsPerPage = 10;
			const timeZone = reactive({
				timeZone: '',
				localTime: '',
			});

			function addUserToMap(results) {
				search.results.push(results);
				allSearchedPlaces.searchHistory.push(results);
			}

			const updateMap = async (locations, searchInput) => {
				locations.map(location => {
					const lat = location.geometry.location.lat();
					const lng = location.geometry.location.lng();
					search.results.push({
						name: location.name,
						address: location.formatted_address,
						lat: lat,
						lng: lng,
						id: id.value,
					});
				});
				allSearchedPlaces.searchHistory.push({
					id: id.value,
					name: searchInput.value,
				});
				id.value = id.value + 1;
			};

			const updateTimeZone = data => {
				const localTime = new Date().toLocaleString('en-US', {
					timeZone: data.timeZoneId,
					hour: 'numeric',
					minute: 'numeric',
					hour12: true,
				});
				timeZone.timeZone = data.timeZoneName;
				timeZone.localTime = localTime;
			};

			function toggleChecked(search) {
				const index = checkedItems.value.indexOf(search);
				if (index === -1) {
					checkedItems.value.push(search);
				} else {
					checkedItems.value.splice(index, 1);
				}
			}

			const displayLocations = computed(() => {
				console.log('it works');
				const start = (currentPage.value - 1) * itemsPerPage;
				const end = start + itemsPerPage;
				return allSearchedPlaces.searchHistory.slice(start, end);
			});

			function goToPage(newPage) {
				if (newPage >= 1 && newPage <= pageCount.value) {
					currentPage.value = newPage;
				}
			}
			const pageCount = computed(() =>
				Math.ceil(allSearchedPlaces.searchHistory.length / itemsPerPage),
			);

			watch(allSearchedPlaces.searchHistory, () => {
				console.log('it works');
				if (currentPage.value > pageCount.value) {
					goToPage(currentPage.value - 1);
				}
			});

			provide('pagination', {
				currentPage,
				goToPage,
				pageCount,
			});

			provide('refs', {
				search,
				allSearchedPlaces,
				checkedItems,
			});

			return {
				addUserToMap,
				updateMap,
				checkedItems,
				toggleChecked,
				displayLocations,
				currentPage,
				searchResults: search.results,
				searchHistory: allSearchedPlaces.searchHistory,
				timeZone,
				updateTimeZone,
			};
		},
	};
</script>

<template>
	<div class="main-container">
		<div class="left-side">
			<SearchBar @searching="updateMap" @getTimeZone="updateTimeZone" />
			<GetUserLocation
				@locationFound="addUserToMap"
				@getTimeZone="updateTimeZone"
			/>
			<DeleteButton />
			<div
				v-for="search in displayLocations"
				:key="search.id"
				class="search-history"
			>
				<div class="w-100 d-flex align-items-center gap-3 p-2">
					<input
						class="checkbox"
						style="cursor: pointer"
						type="checkbox"
						@click="toggleChecked(search)"
						:id="`checkbox-${search.id}`"
					/>
					<label
						style="font-size: 18px; cursor: pointer"
						:for="`checkbox-${search.id}`"
						>{{ search.name }}</label
					>
				</div>
			</div>
			<div
				v-if="searchHistory.length > 10"
				class="d-flex align-items-center gap-2"
			>
				<SeaerchHistory />
			</div>
		</div>
		<div class="right-side">
			<div class="fixed" v-if="timeZone.timeZone !== ''">
				<span>{{ timeZone.localTime }}</span>
				<span>{{ timeZone.timeZone }}</span>
			</div>
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

	.fixed {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		gap: 4px;
		top: 0;
		left: 50%;
		z-index: 100;
		background-color: white;
		padding: 4px;
		margin-top: 8px;
		min-width: 300px;
		height: 40px;
	}
</style>

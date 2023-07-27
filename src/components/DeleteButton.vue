<script>
	import { defineComponent, computed, inject } from 'vue';
	import { filterResults, filterHistory } from '@/hooks';

	export default defineComponent({
		setup() {
			const { search, allSearchedPlaces, checkedItems } = inject('refs');

			const showButton = computed(() => checkedItems.value.length > 0);

			function deleteLocation() {
				const filteredResult = filterResults(search, checkedItems);
				const filteredSearchHistory = filterHistory(
					allSearchedPlaces,
					checkedItems,
				);

				search.results.splice(0, search.results.length, ...filteredResult);
				allSearchedPlaces.searchHistory.splice(
					0,
					allSearchedPlaces.searchHistory.length,
					...filteredSearchHistory,
				);
				checkedItems.value.splice(0, checkedItems.value.length);
			}

			return {
				deleteLocation,
				showButton,
			};
		},
	});
</script>

<template>
	<button class="btn btn-danger p-2" @click="deleteLocation" v-if="showButton">
		Delete
	</button>
</template>

<style></style>

<script>
	import { inject } from 'vue';

	export default {
		setup() {
			const { currentPage, goToPage, pageCount } = inject('pagination');
			const { allSearchedPlaces } = inject('refs');

			return {
				goToPage,
				currentPage,
				pageCount,
				searchHistory: allSearchedPlaces.searchHistory,
			};
		},
	};
</script>

<template>
	<button
		class="btn btn-md btn-primary"
		@click="goToPage(currentPage - 1)"
		:disabled="currentPage === 1"
	>
		Prev
	</button>
	<span style="font-size: 18px">{{ currentPage }} / {{ pageCount }}</span>
	<button
		class="btn btn-primary"
		@click="goToPage(currentPage + 1)"
		:disabled="searchHistory.length <= 3 || currentPage === pageCount"
	>
		Next
	</button>
</template>

<style></style>

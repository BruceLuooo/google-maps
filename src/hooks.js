export async function initMap() {
	const { Map } = await window.google.maps.importLibrary('maps');
	return new Map(document.getElementById('map'), {
		center: { lat: 43.65107, lng: -79.347015 },
		zoom: 10,
		mapId: '4504f8b37365c3d0',
	});
}

export function filterResults(search, checkedItems) {
	return search.results.filter(result => {
		return !checkedItems.value.some(filterItem => filterItem.id === result.id);
	});
}
export function filterHistory(allSearchedPlaces, checkedItems) {
	return allSearchedPlaces.searchHistory.filter(result => {
		return !checkedItems.value.some(filterItem => filterItem.id === result.id);
	});
}

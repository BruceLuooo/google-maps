import { Loader } from '@googlemaps/js-api-loader';

export const Loading = new Loader({
	apiKey: process.env.VUE_APP_GOOGLE_MAPS_API,
	version: 'weekly',
	libraries: ['places'],
});

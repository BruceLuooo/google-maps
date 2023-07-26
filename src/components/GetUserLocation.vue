<script>
  import{
    defineComponent,
    getCurrentInstance
  } from 'vue';
  import { timestamp } from '@/constants';
  import axios from 'axios'

  export default defineComponent({
    emits: ['locationFound', 'getTimeZone'],
    setup() {
      const {emit} = getCurrentInstance()

      function getUserLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async(position) => {
          const results = {
            name: 'My Location',
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: ''
          }
          emit('locationFound', results)

          var config = {
            method: 'get',
            url: `https://maps.googleapis.com/maps/api/timezone/json?location=${position.coords.latitude}%2C${position.coords.longitude}&timestamp=${timestamp}&key=${process.env.VUE_APP_GOOGLE_MAPS_API}`,
            headers: {},
          };
          axios(config)
            .then(function (response) {
              emit('getTimeZone', response.data);
            })
            .catch(function (error) {
              console.log(error);
            });
        })}

      }

      return {
        getUserLocation,
      }
    }
  })
</script>

<template>
  <button type="button" class="btn btn-success btn-lg" @click="getUserLocation">
    My Location
  </button>
</template>
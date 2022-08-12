<script setup>

import { ref, computed, watch } from 'vue'

import { useGeolocation } from '@vueuse/core'
const { coords, locatedAt, error } = useGeolocation()

import { getDistance } from 'geolib';

import { shops } from './components/shops.js'

const locationToString = (location) => {
  return `${location.lat}, ${location.lng}`
}

const locationFromString = (str) => {
  const [lat, lng] = str.split(',')
  return { lat: parseFloat(lat), lng: parseFloat(lng) }
}

const location = ref({
  lat: 35.65805131479146,
  lng: 139.7016465261968
})

const textLocation = ref(locationToString(location.value))

const radius = ref(3000)

const shopsInRange = computed(() => {
  return shops.filter(shop => {
    const distance = getDistance(
      { latitude: location.value.lat, longitude: location.value.lng },
      { latitude: parseFloat(shop.latitude), longitude: parseFloat(shop.longitude) }
    )
    return distance < radius.value
  })
})

const useCurrent = () => {
  location.value = {
    lng: coords.value.longitude,
    lat: coords.value.latitude
  }
}

</script>

<template>
  <div>
    <div>
      <p>Location</p>
      <p>You can paste a location from google maps here:</p>
      <img src="/paste-location.png"/>
      <button @click="useCurrent">Use my current location</button>
      <input type="text" v-model="textLocation"/>
    </div>
    <p>
      <input type="range" min="100" max="5000" v-model="radius" step="100" /><br/>
      Radius {{ radius }}m
    </p>

  <div>
    <p>A total of {{ shopsInRange.length }} shops are in range</p>
    <div class="shops">
      <div class="shop-card" v-for="shop in shopsInRange" :key="shop.id">{{ shop.name }}</div>
    </div>
  </div>
  </div>
</template>

<style scoped>

.vue-map-container {
  display: flex;
}

.shops {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.shop-card {
  margin: 4px;
  padding: 4px 16px;
  border-radius: 12px;
  border: 1px solid #eee;
}
</style>

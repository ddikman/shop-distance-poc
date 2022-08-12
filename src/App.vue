<script setup>

import { ref, computed, watch } from 'vue'

import { useGeolocation } from '@vueuse/core'

const { coords, locatedAt, error } = useGeolocation()
import { getDistance } from 'geolib';

import { shops } from './components/shops.js'

const orFinite = (val, fallback) => {
  return isFinite(val) ? val : fallback;
}

const textLocation = ref(null)

const center = ref({
    lat: 35.6548608,
    lng: 139.6736
})

watch(center, () => {
  textLocation.value = `${center.value.lat.toFixed(6)}, ${center.value.lng.toFixed(6)}`
})

const markers = computed(() => {
  return [
    {
      position: {
        lat: center.value.lat,
        lng: center.value.lng
      }
    }
  ]
});

const radius = ref(3000)

const circleOptions = ref({
  strokeColor: "#FF0000",
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: "#FF0000",
  fillOpacity: 0.1,
  clickable: false
})

const shopsInRange = computed(() => {
  return shops.filter(shop => {
    const distance = getDistance(
      { latitude: center.value.lat, longitude: center.value.lng },
      { latitude: parseFloat(shop.latitude), longitude: parseFloat(shop.longitude) }
    )
    return distance < radius.value
  })
})

const setCurrent = () => {
  center.value = {
    lat: orFinite(coords.value.latitude, 35.6548608),
    lng: orFinite(coords.value.longitude, 139.6736)
  }
}

const updateTextLocation = (event) => {
  center.value = {
    lat: parseFloat(event.target.value.split(',')[0]),
    lng: parseFloat(event.target.value.split(',')[1])
  }
}

const handleClick = (event) => {
  console.log('clicked')
  console.log(event.latLng)
  center.value = {
    lat: event.latLng.lat(),
    lng: event.latLng.lng()
  }
}

</script>

<template>
  <div>
    <div>
      <p>Location</p>
      <button @click="setCurrent">Use current location</button>
      <input type="text" :value="textLocation" @blur="updateTextLocation"/>
    </div>
    <p>
      <input type="range" min="100" max="5000" v-model="radius" step="100" /><br/>
      Radius {{ radius }}m
    </p>

    <GMapMap
      v-if="center.lat"
      :center="center"
      :zoom="14"
      map-type-id="terrain"
      style="height: 300px"
      :click="true"
      @click="handleClick"
  >
    <GMapCluster>
      <GMapMarker
          :key="index"
          v-for="(m, index) in markers"
          :position="m.position"
          :draggable="true"
      />
      <GMapCircle
        :key="shop.id"
        v-for="shop in shops"
        :radius="parseInt(radius)"
        :options="circleOptions"
        :center="{ lat: parseFloat(shop.latitude), lng: parseFloat(shop.longitude)}"
    />
    </GMapCluster>
  </GMapMap>

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

<script setup>
import { RouterView } from 'vue-router'
import AddFavory from '../components/addFavory.vue'

</script>
<template>
  <div class="page">
    <AddFavory/>
  </div>
</template>
<style scoped>
.page { 
  max-width: 100%; 
  margin: 0 auto; 
  padding: 40px 20px; 
  font-family: 'Noto Sans TC', sans-serif; 
  background-color: #fffafb; 
}
</style>

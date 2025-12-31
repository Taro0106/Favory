<script setup>
import { RouterView } from 'vue-router'
import Like from '../components/list.vue'
</script>
<template>
  <div class="page">
    <Like/>
  </div>
</template>
<style scoped>
.page { 
  max-width: 100%; 
  margin: 0 auto; 
  padding: 10px 10px; 
  font-family: 'Noto Sans TC', sans-serif; 
  
}
</style>
<script setup>
import { RouterView } from 'vue-router'
import Like from '../components/list.vue'
</script>
<template>
  <div class="container">
    <Like/>
  </div>
</template>
<style scoped>
.container { 
  max-width: 100%; 
  margin: 0 auto; 
  padding: 40px 20px; 
  font-family: 'Noto Sans TC', sans-serif; 
  background-color: #fffafb; 
}
</style>
<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />
  <main class="content">
    <RouterView />
  </main>
</template>

<style>
*, *::before, *::after {
  box-sizing: border-box; 
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100vw;       
  overflow-x: hidden; 
  font-family: 'Inter', -apple-system, sans-serif;
  background-color: #fff;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;        
  overflow-x: hidden; 
}

.content {
  flex: 1;
  width: 100%;
  max-width: 100%;    
  overflow-y: auto;
  overflow-x: hidden; 
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
<script setup>
import { computed } from 'vue' // 記得導入 computed
import { RouterView, useRoute } from 'vue-router' // 記得導入 useRoute
import Navbar from '../components/Navbar.vue'

const route = useRoute()

</script>

<template>
  <div class="myhome-container">
    <Navbar/>

    <main class="main-container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.myhome-container {
  display: flex; /* 讓左右並排 */
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

/* 側邊欄容器：實體佔位，不使用 fixed */
.sidebar {
  flex-shrink: 0; /* 防止被擠壓 */
  height: 100vh;
  border-right: 2px solid #ffe4e1;
}

/* 主內容區：自動填滿剩餘空間 */
.main-container {
  flex: 1; /* 這裡不需要 margin-left，它會自動貼在 sidebar 右邊 */
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  /* 🌸 主背景：淡奶白＋極柔粉 */
  background:
    radial-gradient(circle at 80% 20%, #fff3f6 0%, transparent 35%),
    radial-gradient(circle at 20% 80%, #f3f6ff 0%, transparent 40%),
    linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  /* background-image: url('https://i.pinimg.com/736x/e5/74/98/e574986391e767659f0fe852c8c7ede2.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed; */
  /* 核心代碼：確保內容過多時可捲動，但隱藏滾輪條 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

/* Chrome, Safari, Edge 的隱藏方式 */
.main-container::-webkit-scrollbar {
  display: none;
}

/* 手機版適應：改回上下堆疊 */
@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: 70px; /* 如果手機版 Navbar 在底部，這裡甚至可以設為 0 */
  }

  .main-container {
  margin-bottom: 70px;
}
}
</style>
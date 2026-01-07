<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '../firebase'
// 🌟 引入 doc 和 getDoc
import { doc, getDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const currentUser = ref(null)
const userData = ref(null) // 🌟 儲存從 Firestore 抓來的真實資料

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    currentUser.value = user
    
    if (user) {
      try {
        // 🌟 去 users 集合抓取該使用者的最新資料
        const userRef = doc(db, "users", user.uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          userData.value = userSnap.data()
        } else {
          // 如果資料庫還沒建立（剛註冊），先用 Auth 的資料墊檔
          userData.value = {
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        }
      } catch (error) {
        console.error("導覽列抓取資料失敗:", error)
      }
    } else {
      userData.value = null
    }
  })
})
</script>

<template>
  <nav class="top-nav">
    <div class="nav-left">
      <img src="../pic/logo2.png" class="mini-logo" alt="Logo">
      
      <template v-if="userData">
        <div class="user-info">
          <img :src="userData.photoURL || 'https://cdn-icons-png.flaticon.com/512/3682/3682281.png'" class="nav-avatar">
          <span class="nav-name">{{ userData.displayName || '收藏家' }}</span>
        </div>
        <router-link to="/Myhome/List" class="nav-item">我的收藏庫</router-link>
        <router-link to="/Home" class="nav-item active">全站收藏</router-link>
      </template>
      
      <router-link v-else to="/" class="nav-item">立即登入</router-link>
    </div>
  </nav>
</template>

<style scoped>
/* 導覽列 */
.top-nav {
  padding: 15px 5%;
  display: flex;
  align-items: center;
  position: fixed;
  width: 100%;
  z-index: 100;
  height: 40px;
}
.nav-left {
  display: flex;
  align-items: center;
  gap: 15px;
  
  /* 🌟 核心設計：半透明毛玻璃膠囊 */
  background: rgba(255, 255, 255, 0.6); /* 半透明白 */
  padding: 8px 20px;
  border-radius: 50px; /* 圓角膠囊形狀 */
  
  /* 細緻的邊框與陰影 */
  border: 1px solid rgba(255, 121, 159, 0.2); /* 淡淡的粉色邊框 */
  box-shadow: 0 4px 15px rgba(255, 182, 203, 0.15);
  
  /* 毛玻璃效果 */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  
  /* 讓導覽列在滑動時有輕微的浮動感 */
  transition: all 0.3s ease;
}

/* 滑鼠滑入時的細微變化 */
.nav-left:hover {
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 6px 20px rgba(255, 182, 203, 0.25);
  transform: translateY(-1px);
}

/* 內部的使用者資訊區塊 */
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-right: 15px;
  border-right: 1px solid rgba(255, 121, 159, 0.2); /* 分隔線 */
}

/* 調整名字樣式 */
.nav-name {
  font-weight: 600;
  color: #ff799f; /* 標牌粉色 */
  font-size: 0.9rem;
}

/* 導覽連結的樣式優化 */
.nav-item {
  text-decoration: none;
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 20px;
  transition: all 0.2s;
}

.nav-item:hover {
  color: #ff799f;
  background: rgba(255, 121, 159, 0.05);
}

.nav-item.active {
  color: white;
  background: #ff799f; /* 選中時的實色背景 */
}
.mini-logo { height: 30px; }
.nav-avatar { width: 32px; height: 32px; border-radius: 50%; }

/* --- 手機版 RWD 調整 --- */
@media (max-width: 768px) {
  .top-nav {
    padding: 10px 15px; /* 縮小導覽列邊界 */
    height: auto;      /* 讓高度隨內容撐開 */
    justify-content: flex-start; /* 膠囊靠左對齊 */
  }

  .nav-left {
    padding: 6px 12px; /* 縮小膠囊內部的空隙 */
    gap: 10px;        /* 縮小元素間的距離 */
    max-width: 90vw;   /* 確保膠囊寬度不會超出螢幕 */
  }

  /* 1. 隱藏名字節省空間 */
  .nav-name {
    display: none;
  }

  /* 2. 移除使用者資訊右側的線（因為名字不見了，線會顯得很突兀） */
  .user-info {
    padding-right: 0;
    border-right: none;
  }

  /* 3. 縮小 Logo 與頭貼尺寸 */
  .mini-logo {
    height: 24px;
  }
  .nav-avatar {
    width: 28px;
    height: 28px;
  }

  /* 4. 調整導覽連結文字大小 */
  .nav-item {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
}

/* 針對極窄螢幕 (如 iPhone SE) 的極致精簡 */
@media (max-width: 380px) {
  .nav-left {
    gap: 8px;
  }
  .nav-item {
    padding: 4px 6px; /* 更窄的按鈕 */
  }
}
</style>
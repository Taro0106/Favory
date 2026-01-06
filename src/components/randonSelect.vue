<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '../firebase'
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import TopNav from '../components/topNav.vue'
import Hero from '../components/homeHero.vue'

const recentItems = ref([])
const currentUser = ref(null)

// 抓取全站最新 5 筆
const fetchRecentItems = async () => {
  const q = query(
    collection(db, "myFavoryList"),
    orderBy("createdAt", "desc")
  )
  const querySnapshot = await getDocs(q)
  recentItems.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user
  })
  fetchRecentItems()
})

import Swal from 'sweetalert2'

// 隨機抽取函式
const handleRandomPick = () => {
  const randomIndex = Math.floor(Math.random() * recentItems.value.length);
  selectedPick.value = recentItems.value[randomIndex];
  showGacha.value = true;
};

const showGacha = ref(false); // 控制彈窗顯示
const selectedPick = ref(null); // 存抽到的那筆資料

  
</script>

<template>
<section class="gacha-section">
  <div class="gacha-container" @click="handleRandomPick">
    <div class="gacha-content">
      <span class="gacha-icon">?</span>
      <div class="gacha-text">
        <h3>不知道看什麼嗎？</h3>
        <p>點擊抽一張驚喜收藏！</p>
      </div>
    </div>
    <button class="gacha-btn">試試手氣</button>
  </div>
</section>
  <Transition name="fade">
  <div v-if="showGacha" class="modal-overlay" @click.self="showGacha = false">
    <Transition name="pop">
      <div class="gacha-result-card">
        <button class="close-btn" @click="showGacha = false">×</button>
        
        <div class="result-img-wrapper">
          <img :src="selectedPick.image" class="result-img">
          <div class="category-tag"># {{ selectedPick.category }}</div>
          <div class="rating-tag">★ {{ selectedPick.rating }}</div>
        </div>

        <div class="result-info">
          <div class="result-user">
            <img :src="selectedPick.userAvatar || 'https://i.pinimg.com/474x/ac/df/d8/acdfd8460a47c598dbbc9d1794561595.jpg'" class="mini-avatar">
            <span>{{ selectedPick.uid }} 的分享</span>
          </div>
          <h2 class="result-title">{{ selectedPick.name }}</h2>
          <p class="result-comment">{{ selectedPick.comment }}</p>
          
          <div class="modal-footer">
            <div class="result-actions">
            <button class="retry-btn" @click="handleRandomPick">再抽一次</button>
            <button class="go-btn">查看詳情</button>
            </div>
        </div>
        </div>
      </div>
    </Transition>
  </div>
</Transition>
</template>


<style scoped>
/* --- Gacha 互動區塊 --- */
.gacha-section {
  width: 90%;
  max-width: 800px; /* 控制不要太寬 */
  margin: 20px auto; /* 與上方 Hero 隔開 */
  padding-bottom: 60px; /* 給底部留點空間 */
}

.gacha-container {
  background: linear-gradient(135deg, #ff799f 0%, #ffb6cb 100%);
  border-radius: 24px;
  padding: 25px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(255, 121, 159, 0.25);
  transition: transform 0.3s ease;
}

.gacha-container:hover {
  transform: translateY(-5px) scale(1.01);
}

.gacha-content {
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
}

.gacha-icon { font-size: 45px;margin-right: 15px; }

.gacha-text h3 { margin: 0; font-size: 1.3rem; }
.gacha-text p { margin: 5px 0 0; opacity: 0.9; font-size: 0.95rem; }

.gacha-btn {
  background: white;
  color: #ff799f;
  border: none;
  padding: 12px 25px;
  border-radius: 50px;
  font-weight: bold;
  font-size: 1rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

/* 關閉按鈕樣式 */
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 24px;
  color: #ccc;
  cursor: pointer;
  z-index: 100;
}
.close-btn:hover { color: #ff799f; }

/* RWD 調整：手機版縮小但維持左右排列 */
@media (max-width: 768px) {
  .gacha-section {
    width: 80%;      /* 稍微加寬一點點利用空間 */
    margin: 20px auto;
  }

  .gacha-container {
    padding: 15px 20px; /* 🌟 大幅縮小內距 (原本是 25px 40px) */
    border-radius: 18px; /* 圓角也縮小一點比較精緻 */
    gap: 10px;          /* 確保左右兩側有最小間距 */
  }

  .gacha-content {
    gap: 12px;          /* 🌟 圖示與文字的距離縮小 */
  }

  .gacha-icon { 
    font-size: 30px;    /* 🌟 圖示從 45px 縮到 30px */
  }

  .gacha-text h3 { 
    font-size: 1rem;    /* 🌟 標題縮小 */
  }

  .gacha-text p { 
    font-size: 0.8rem;  /* 🌟 副標題縮小 */
    white-space: nowrap; /* 確保這行字不會折行，維持乾淨 */
  }

  .gacha-btn {
    padding: 8px 16px;  /* 🌟 按鈕縮小 */
    font-size: 0.85rem;
    white-space: nowrap; /* 🌟 關鍵：防止按鈕文字變兩行 */
    flex-shrink: 0;      /* 🌟 關鍵：防止按鈕被左邊文字擠扁 */
  }
}

/* 針對極小螢幕 (如 iPhone SE) 的微調 */
@media (max-width: 375px) {
  .gacha-icon { display: none; } /* 🌟 螢幕太小時隱藏圖示，確保文字放得下 */
  .gacha-container { padding: 12px 15px; }
}

/* 遮罩背景 */
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 182, 203, 0.4);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* 抽獎結果卡片 - 改為 Flex 佈局 */
.gacha-result-card {
  background: white;
  width: 95%;
  max-width: 800px; /* 橫向版型可以稍微寬一點點 */
  border-radius: 30px;
  
  /* 🌟 核心：電腦版橫向排列 */
  display: flex; 
  flex-direction: row; 
  align-items: center; 
  
  padding: 40px; /* 移除原本為了向上突破設定的 padding-top */
  position: relative;
  box-shadow: 0 20px 60px rgba(255, 121, 159, 0.3);
}

/* 🌟 左側圖片區 */
.result-img-wrapper {
  flex: 0 0 180px; /* 固定圖片區寬度 */
  position: relative;
  /* 移除原本的 absolute 定位與 top/left 偏移 */
  transform: none; 
  left: auto;
  top: auto;
  z-index: 10;
}

.result-img {
  width: 200px;
  height: 280px;
  object-fit: cover;
  border-radius: 20px;
  /* 保持你的白邊與硬陰影 */
  border: 6px solid white;
}

.category-tag {
  position: absolute;
  bottom: 25px;
  right: -20px; /* 稍微往右突出一點 */
  background: #ff799fe2;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  z-index: 11;
}

.rating-tag {
  position: absolute;
  top: 20px;
  left: -15px; /* 稍微往右突出一點 */
  background: rgba(255, 255, 255, 0.881);
  color: #ff799f;
  border: 2px solid #ff799f;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  z-index: 11;
}

/* 🌟 右側文字資訊區 */
.result-info {
  flex: 1;
  /* 🌟 核心修正：允許 Flex 子元素縮小到比內容窄 */
  min-width: 0;
  padding-left: 40px; /* 與圖片拉開距離 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* 確保它佔滿右側所有高度，這樣 footer 才能到底部 */
  align-self: stretch;
}

.result-comment { 
    white-space: pre-wrap;    /* 🌟 核心：保留原始換行與空格 */
    word-break: break-all;
    color: #666; 
    font-size: 0.9rem; 
    line-height: 1.5; 
    margin-top: 0px; 
    text-align: center;
    max-height: calc(1.5em * 8); /* 5 行 */
    overflow: hidden;
}

/* --- 手機版 RWD 調整 --- */
@media (max-width: 768px) {
  .gacha-result-card {
    flex-direction: column; /* 🌟 垂直排列 */
    width: 80%;        /* 讓它隨螢幕寬度自動伸縮 */
    padding: 80px 20px 30px; /* 回復原本上方預留空間的 padding */
    text-align: center;
  }

  .result-img-wrapper {
    position: absolute; /* 手機版變回向上突破的樣式 */
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    flex: none;
  }

  .result-img {
    width: 150px;
    height: 210px;
    object-fit: cover;
    border-radius: 20px;
    /* 保持你的白邊與硬陰影 */
    border: 6px solid white;
  }

  .result-info {
    padding-left: 0;
    text-align: center;
    margin-top: 125px;
    /* 🌟 核心修正：強制寬度為卡片內容寬，並允許縮小 */
    width: 100%;
    min-width: 0; 
    flex: 1;
    display: flex;
    flex-direction: column;
    /* 🌟 不要用 align-items: center; 否則 footer 會縮小 */
    align-items: stretch;
  }

  .category-tag {
    bottom: 20px;
    right: -20px; /* 稍微往右突出一點 */
  }

  .rating-tag {
    position: absolute;
    top: 15px;
    left: -20px; /* 稍微往右突出一點 */
}

.result-comment { 
    max-height: calc(1.5em * 5); /* 5 行 */
    overflow: hidden;
}
}

/* 文字區域 */
.result-user { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px; opacity: 0.7; font-size: 0.8rem; }
.mini-avatar { width: 20px; height: 20px; border-radius: 50%; }
.result-title { 
    font-size: 1.5rem;
  margin: 0;
  color: #fff;
  font-family: 'Varela Round', 'M PLUS Rounded 1c', sans-serif;
  /* 製作出類似白色邊框的效果 */
  text-shadow: 
    1px 1px 0 #ff799f,
   -1px -1px 0 #ff799f,
    1px -1px 0 #ff799f,
   -1px 1px 0 #ff799f,
    0px 4px 10px rgba(255, 121, 159, 0.2);
  margin: 10px 0;
  
  /* 🌟 單行省略三部曲 */
  white-space: nowrap;     /* 強制不換行 */
  overflow: hidden;        /* 隱藏溢出 */
  text-overflow: ellipsis; /* 顯示 ... */
  
  /* 確保在 Flex 容器中能正確計算寬度 */
  display: block;
  width:100%;
  text-align: center;
}

/* 按鈕區 */
/* 🌟 Modal Footer 設計 */
.modal-footer {
  margin-top: auto; /* 強制推到底部 */
  padding-top: 20px;
  position: relative;
  
  /* 加上一條超可愛的波浪線或虛線作為分隔 */
  border-top: 2px dashed #ffe4e1;
}

/* 讓 Footer 帶有一點點向上遮罩，增加層次感 */
.modal-footer::before {
  content: "";
  position: absolute;
  top: -40px;
  left: 0;
  width: 100%;
  height: 40px;
  background: linear-gradient(to top, white, transparent);
  pointer-events: none; /* 確保不影響點擊 */
}
.result-actions { display: flex; gap: 10px; }
.retry-btn, .go-btn {
  flex: 1; padding: 12px; border-radius: 15px; border: none; font-weight: bold; cursor: pointer; transition: 0.3s;
}
.retry-btn { background: #f0f0f0; color: #666; }
.go-btn { background: #ff799f; color: white; }
.retry-btn:hover { background: #e0e0e0; }
.go-btn:hover { background: #ff5c8a; transform: translateY(-3px); }

/* --- 動畫 --- */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-enter-from { transform: scale(0.5) translateY(100px); opacity: 0; }
</style>
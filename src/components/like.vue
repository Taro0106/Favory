<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase' // 請確認路徑是 ./firebase 還是 ../firebase
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'

// --- 1. 表單變數 ---
const animeName = ref('')
const imageUrl = ref('') 
const category = ref('漫畫')
const status = ref('未完結')
const rating = ref(5)
const comment = ref('')

const collectionList = ref([]) // 儲存從 Firebase 抓回來的清單

// --- 2. Cloudinary 設定 ---
const cloudName = "dn6r2yt4y"; 
const uploadPreset = "Favory";

// --- 3. Firebase 邏輯 ---

// 組件掛載時，開始監聽資料庫
onMounted(() => {
  const q = query(collection(db, "myAnimeList"), orderBy("createdAt", "desc"));
  onSnapshot(q, (querySnapshot) => {
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    collectionList.value = list;
  });
})

// 新增資料
const addItem = async () => {
  if (!animeName.value) return alert('請輸入名稱');
  if (!imageUrl.value) return alert('請先上傳圖片');

  try {
    await addDoc(collection(db, "myAnimeList"), {
      name: animeName.value,
      image: imageUrl.value,
      category: category.value,
      status: status.value,
      rating: rating.value,
      comment: comment.value,
      createdAt: new Date()
    });
    alert('儲存成功！');
    // 清空欄位
    animeName.value = ''; imageUrl.value = ''; comment.value = '';
  } catch (e) {
    console.error(e);
  }
}

// 刪除功能
const deleteItem = async (id) => {
  if (confirm('確定要刪除這筆收藏嗎？')) {
    await deleteDoc(doc(db, "myAnimeList", id));
  }
}

const openUploadWidget = () => {
  window.cloudinary.openUploadWidget(
    {
      cloudName: cloudName,
      uploadPreset: uploadPreset,
      // 1. 設定為繁體中文
      language: "zh",
      text: {
        zh: {
          menu: { files: "手機/電腦檔案", web: "網路圖片", camera: "打開相機" },
          local: { browse: "挑選一張萌圖", dd_title_single: "把圖片拖進來這裡吧！" }
        }
      },
      // 2. 開啟裁切功能，讓封面比例整齊 (海報比例 3:4)
      cropping: true,
      croppingAspectRatio: 0.75,
      showSkipCropButton: false,
      
      // 3. 可愛風粉嫩配色
      styles: {
        palette: {
          window: "#FFF5F7",         // 視窗背景（淡淡粉白）
          windowBorder: "#FFB6C1",   // 邊框（淺粉紅）
          tabIcon: "#FF69B4",        // 圖示顏色（熱情粉）
          menuIcons: "#FF82AB",      // 選單圖示
          textDark: "#5D4037",       // 深色文字（暖暖可可色）
          textLight: "#FFFFFF",      // 淺色文字
          link: "#FF69B4",           // 連結顏色
          action: "#FF82AB",         // 主要按鈕（粉紅色）
          inactiveTabIcon: "#FFC1CC",// 未選中圖示
          error: "#F44235",
          inProgress: "#FF69B4",
          complete: "#20B832",
          sourceBg: "#FFF0F5"        // 來源列表背景
        },
        fonts: {
          default: null,
          // 引用一個可愛的字體
          "'Noto Sans TC', sans-serif": "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&display=swap"
        }
      },
      sources: ["local", "url", "camera"],
      multiple: false,
    },
    (error, result) => {
      if (!error && result && result.event === "success") {
        console.log("上傳成功！", result.info);
        imageUrl.value = result.info.secure_url;
      }
    }
  );
};
</script>

<template>
  <div class="container">
    <h1>我的動漫收藏清單</h1>

    <div class="form-card">
      <input v-model="animeName" placeholder="作品名稱">
      
      <div class="upload-section">
        <button type="button" @click="openUploadWidget">選擇並上傳封面圖</button>
        <div v-if="imageUrl" class="preview">
          <img :src="imageUrl" style="width: 80px; margin-top: 10px; border-radius: 5px;">
        </div>
      </div>

      <div class="row">
        <select v-model="category">
          <option value="漫畫">漫畫</option>
          <option value="動漫">動漫</option>
        </select>
        <select v-model="status">
          <option value="完結">完結</option>
          <option value="未完結">未完結</option>
        </select>
      </div>

      <div class="row">
        評分：<input type="number" v-model="rating" min="1" max="5"> 顆星
      </div>

      <textarea v-model="comment" placeholder="寫下評語..."></textarea>

      <button @click="addItem" class="submit-btn">新增到收藏清單</button>
    </div>

    <hr>

    <div class="list-grid">
      <div v-for="item in collectionList" :key="item.id" class="item-card">
        <div class="card-img">
          <img :src="item.image" alt="cover">
          <span class="tag">{{ item.category }}</span>
        </div>
        <div class="info">
          <h3>{{ item.name }}</h3>
          <p class="status">{{ item.status }} · {{ '⭐'.repeat(item.rating) }}</p>
          <p class="comment">{{ item.comment }}</p>
          <button class="delete-btn" @click="deleteItem(item.id)">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 20px; font-family: sans-serif; }
.form-card { background: #f9f9f9; padding: 20px; border-radius: 12px; margin-bottom: 30px; }
input, select, textarea { width: 100%; margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 6px; }
.row { display: flex; gap: 10px; align-items: center; }
.submit-btn { width: 100%; padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; }

.list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; }
.item-card { background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); position: relative; }
.card-img { position: relative; height: 250px; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.tag { position: absolute; top: 10px; left: 10px; background: rgba(0,0,0,0.7); color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px; }
.info { padding: 15px; }
.status { color: #666; font-size: 14px; margin: 5px 0; }
.comment { font-size: 13px; color: #444; border-top: 1px solid #eee; }
.delete-btn { margin-top: 10px; background: none; border: 1px solid #ff4d4d; color: #ff4d4d; padding: 4px 8px; border-radius: 4px; cursor: pointer; }
.delete-btn:hover { background: #ff4d4d; color: white; }

/* 把這段蓋掉原本的 .item-card 相關樣式 */
.item-card { 
  background: white; 
  border-radius: 20px; /* 超圓潤角 */
  overflow: hidden; 
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.3); /* 粉紅色系的陰影 */
  border: 2px solid #FFE4E1; /* 淡淡的粉色邊框 */
  transition: transform 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px) rotate(2deg); /* 移上去會微微歪頭，比較俏皮 */
}

.tag { 
  position: absolute; 
  top: 10px; 
  left: 10px; 
  background: #FFB6C1; /* 粉紅標籤 */
  color: white; 
  padding: 4px 12px; 
  border-radius: 20px; 
  font-size: 12px; 
  font-weight: bold;
}

.submit-btn { 
  width: 100%; 
  padding: 12px; 
  background: linear-gradient(135deg, #FFB6C1 0%, #FF69B4 100%); /* 漸層粉紅按鈕 */
  color: white; 
  border: none; 
  border-radius: 50px; /* 膠囊型按鈕 */
  cursor: pointer; 
  font-size: 16px; 
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(255, 105, 180, 0.3);
}
</style>
<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase' 
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore'

// --- 1. 表單變數 ---
const animeName = ref('')
const imageUrl = ref('') 
const category = ref('漫畫')
const status = ref('未完結')
const rating = ref(5)
const comment = ref('')
const isUploading = ref(false) // 新增：追蹤上傳狀態

const collectionList = ref([]) 

// --- 2. Cloudinary 設定 ---
const cloudName = "dn6r2yt4y"; 
const uploadPreset = "Favory";

// --- 3. 自定義上傳邏輯 (取代原本的 Widget) ---
const uploadToCloudinary = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  try {
    // 直接呼叫 API，不用等待視窗載入
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })
    
    const data = await response.json()
    if (data.secure_url) {
      imageUrl.value = data.secure_url
    }
  } catch (error) {
    console.error('上傳失敗：', error)
    alert('圖片傳送失敗，小精靈鬧脾氣了 Q_Q')
  } finally {
    isUploading.value = false
  }
}

// --- 4. Firebase 邏輯 ---
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

const addItem = async () => {
  if (!animeName.value) return alert('請輸入作品名稱喔！');
  if (!imageUrl.value) return alert('請幫作品挑一張美美的圖～');

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
    // 成功後清空
    animeName.value = ''; imageUrl.value = ''; comment.value = '';
  } catch (e) {
    console.error(e);
  }
}

const deleteItem = async (id) => {
  if (confirm('確定要跟這部作品說掰掰嗎？')) {
    await deleteDoc(doc(db, "myAnimeList", id));
  }
}
</script>

<template>
  <div class="container">
    <h1 class="main-title">🌸 我的收藏小本本 🌸</h1>

    <div class="form-card">
      <input v-model="animeName" class="cute-input" placeholder="✨ 輸入作品名稱...">
      
      <div class="upload-section">
        <label class="cute-upload-btn">
          <input type="file" @change="uploadToCloudinary" accept="image/*" />
          <span v-if="!isUploading">📷 挑選封面圖</span>
          <span v-else>🪄 魔法傳送中...</span>
        </label>
        
        <div v-if="imageUrl" class="preview-container">
          <img :src="imageUrl" class="cute-preview">
          <button @click="imageUrl = ''" class="remove-btn">✕</button>
        </div>
      </div>

      <div class="row">
        <select v-model="category" class="cute-select">
          <option value="漫畫">📖 漫畫</option>
          <option value="動漫">📺 動漫</option>
        </select>
        <select v-model="status" class="cute-select">
          <option value="完結">✅ 完結</option>
          <option value="未完結">⏳ 未完結</option>
        </select>
      </div>

      <div class="row rating-row">
        <span>評分：</span>
        <input type="number" v-model="rating" min="1" max="5" class="cute-number">
        <span class="stars">{{ '⭐'.repeat(rating) }}</span>
      </div>

      <textarea v-model="comment" class="cute-textarea" placeholder="💬 寫點悄悄話吧..."></textarea>

      <button @click="addItem" class="submit-btn" :disabled="isUploading">新增到小本本 ✨</button>
    </div>

    <div class="list-grid">
      <div v-for="item in collectionList" :key="item.id" class="item-card">
        <div class="card-img">
          <img :src="item.image" alt="cover">
          <span class="tag">{{ item.category }}</span>
        </div>
        <div class="info">
          <h3>{{ item.name }}</h3>
          <p class="status"><span>{{ item.status }}</span> ‧ <span>{{ '⭐'.repeat(item.rating) }}</span></p>
          <p class="comment">{{ item.comment || '這部作品還沒有評語喔～' }}</p>
          <button class="delete-btn" @click="deleteItem(item.id)">刪除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全域與標題 */
.container { max-width: 900px; margin: 0 auto; padding: 40px 20px; font-family: 'Noto Sans TC', sans-serif; background-color: #fffafb; min-height: 100vh; }
.main-title { text-align: center; color: #ff82ab; margin-bottom: 30px; font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(255, 182, 193, 0.5); }

/* 表單卡片 */
.form-card { background: white; padding: 30px; border-radius: 25px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(255, 182, 193, 0.2); border: 2px solid #ffe4e1; }

/* 輸入框樣式 */
.cute-input, .cute-select, .cute-textarea, .cute-number { border: 2px solid #fff0f5; background: #fffafb; border-radius: 15px; padding: 12px; margin: 8px 0; font-size: 16px; color: #5d4037; outline: none; transition: 0.3s; }
.cute-input:focus, .cute-select:focus, .cute-textarea:focus { border-color: #ffb6c1; background: white; box-shadow: 0 0 10px rgba(255, 182, 193, 0.3); }
.cute-textarea { height: 100px; resize: none; }

/* 自定義上傳按鈕 */
.upload-section { margin: 15px 0; text-align: center; }
.cute-upload-btn { display: block; padding: 15px; background: #fff0f5; border: 2px dashed #ffb6c1; border-radius: 15px; color: #ff82ab; cursor: pointer; font-weight: bold; transition: 0.3s; }
.cute-upload-btn:hover { background: #ffe4e1; border-style: solid; }
.cute-upload-btn input { display: none; }

.preview-container { position: relative; display: inline-block; margin-top: 15px; }
.cute-preview { width: 120px; height: 160px; object-fit: cover; border-radius: 15px; border: 3px solid white; box-shadow: 0 5px 15px rgba(255, 182, 193, 0.4); }
.remove-btn { position: absolute; top: -5px; right: -5px; background: #ff69b4; color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 12px; }

/* 橫向佈局 */
.row { display: flex; gap: 15px; align-items: center; }
.rating-row { margin: 10px 0; color: #5d4037; font-weight: bold; }
.cute-number { width: 80px; }

/* 新增按鈕 */
.submit-btn { width: 100%; padding: 15px; background: linear-gradient(135deg, #ffb6c1 0%, #ff82ab 100%); color: white; border: none; border-radius: 50px; cursor: pointer; font-size: 18px; font-weight: bold; margin-top: 15px; box-shadow: 0 5px 15px rgba(255, 130, 171, 0.4); transition: 0.3s; }
.submit-btn:hover { transform: scale(1.02); filter: brightness(1.05); }
.submit-btn:disabled { background: #ddd; box-shadow: none; cursor: not-allowed; }

/* 列表展示 */
.list-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px; }
.item-card { background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 20px rgba(255, 182, 193, 0.2); border: 2px solid #ffe4e1; transition: 0.3s ease; }
.item-card:hover { transform: translateY(-8px) rotate(1deg); }

.card-img { position: relative; height: 280px; }
.card-img img { width: 100%; height: 100%; object-fit: cover; }
.tag { position: absolute; top: 12px; left: 12px; background: #ffb6c1; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }

.info { padding: 18px; }
.info h3 { margin: 0; color: #5d4037; font-size: 1.2rem; }
.status { color: #888; font-size: 0.9rem; margin: 8px 0; }
.comment { font-size: 0.85rem; color: #666; border-top: 1px pink dashed; padding-top: 10px; min-height: 40px; }

.delete-btn { margin-top: 12px; background: none; border: 1.5px solid #ffb6c1; color: #ff82ab; padding: 5px 12px; border-radius: 15px; cursor: pointer; font-size: 12px; transition: 0.2s; }
.delete-btn:hover { background: #fff0f5; transform: scale(1.05); }
</style>
<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '../firebase' 
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

// --- 1. 狀態與表單變數 ---
const isModalOpen = ref(false)
const FavoryName = ref('')
const imageUrl = ref('') 
const category = ref('漫畫')
const status = ref('未完結')
const rating = ref(5)
const comment = ref('')
const isUploading = ref(false)
const collectionList = ref([]) 

// --- 2. Cloudinary 設定 ---
const cloudName = "dn6r2yt4y"; 
const uploadPreset = "Favory";

const uploadToCloudinary = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  isUploading.value = true
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    })
    const data = await response.json()
    if (data.secure_url) imageUrl.value = data.secure_url
  } catch (error) {
    alert('圖片傳送失敗 Q_Q')
  } finally {
    isUploading.value = false
  }
}

const addItem = async () => {
  if (!FavoryName.value) return alert('請輸入名稱！');
  if (!imageUrl.value) return alert('請挑選圖片！');
  if (!auth.currentUser) return alert('登入後才能收藏喔！');

  try {
    await addDoc(collection(db, "myFavoryList"), {
      name: FavoryName.value,
      image: imageUrl.value,
      category: category.value,
      status: status.value,
      rating: rating.value,
      comment: comment.value,
      uid: auth.currentUser.uid, // 紀錄擁有者 UID
      createdAt: new Date()
    });
    // 成功後重置並關閉
    FavoryName.value = ''; imageUrl.value = ''; comment.value = '';
    isModalOpen.value = false;
  } catch (e) {
    console.error(e);
  }
}

</script>

<template>
    <h1 class="main-title">🌸 新增Favory 🌸</h1>

    <div class="form-card">
      <input v-model="FavoryName" class="cute-input" placeholder="✨ 輸入作品名稱...">
      
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

    
</template>

<style scoped>
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

</style>
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
  <div class="container">
    <div class="form-card">
      <div class="input-group">
        <label class="label">作品名稱</label>
        <input v-model="FavoryName" class="cute-input" placeholder="輸入你喜歡的作品...">
      </div>
      
      <div class="upload-section">
        <label class="label">封面圖片</label>
        <label class="cute-upload-btn" :class="{ uploading: isUploading }">
          <input type="file" @change="uploadToCloudinary" accept="image/*" />
          <div class="upload-content">
            <span class="upload-icon">{{ isUploading ? '🪄' : '📷' }}</span>
            <span class="upload-text">{{ isUploading ? '魔法傳送中...' : '點擊上傳圖片' }}</span>
          </div>
        </label>
        
        <div v-if="imageUrl" class="preview-container">
          <img :src="imageUrl" class="cute-preview">
          <button @click="imageUrl = ''" class="remove-btn">
            <span>×</span>
          </button>
        </div>
      </div>

      <div class="row">
        <div class="input-group half">
          <label class="label">分類</label>
          <select v-model="category" class="cute-select">
            <option value="漫畫">📖 漫畫</option>
            <option value="動漫">📺 動漫</option>
          </select>
        </div>
        <div class="input-group half">
          <label class="label">狀態</label>
          <select v-model="status" class="cute-select">
            <option value="完結">✅ 完結</option>
            <option value="未完結">⏳ 未完結</option>
          </select>
        </div>
      </div>

      <div class="input-group">
        <label class="label">我的評分</label>
        <div class="rating-container">
          <input type="range" v-model="rating" min="1" max="5" class="rating-slider">
          <div class="rating-display">
            <span class="stars">{{ '⭐'.repeat(rating) }}</span>
            <span class="rating-number">{{ rating }}/5</span>
          </div>
        </div>
      </div>

      <div class="input-group">
        <label class="label">心得筆記</label>
        <textarea v-model="comment" class="cute-textarea" placeholder="寫下你的想法..."></textarea>
      </div>

      <button @click="addItem" class="submit-btn" :disabled="isUploading">
        <span v-if="!isUploading">💝 加入收藏</span>
        <span v-else>⏳ 處理中...</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.main-title {
  text-align: center;
  background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 40px;
  letter-spacing: 2px;
}

.sparkle {
  display: inline-block;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
}

.form-card {
  background: linear-gradient(135deg, #fff 0%, #fff5f7 100%);
  padding: 40px;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(255, 107, 157, 0.15);
  border: 1px solid rgba(255, 182, 193, 0.2);
}

.input-group {
  margin-bottom: 25px;
}

.input-group.half {
  flex: 1;
}

.label {
  display: block;
  font-weight: 600;
  color: #c06c84;
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.cute-input,
.cute-select,
.cute-textarea {
  width: 100%;
  border: 2px solid #ffe4e8;
  background: white;
  border-radius: 15px;
  padding: 14px 18px;
  font-size: 16px;
  color: #5d4037;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.cute-input:focus,
.cute-select:focus,
.cute-textarea:focus {
  border-color: #ff6b9d;
  box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.1);
  transform: translateY(-2px);
}

.cute-textarea {
  height: 120px;
  resize: vertical;
  line-height: 1.6;
}

.upload-section {
  margin-bottom: 25px;
}

.cute-upload-btn {
  display: block;
  padding: 0;
  background: white;
  border: 2px dashed #ffb6c1;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.cute-upload-btn:hover {
  border-color: #ff6b9d;
  border-style: solid;
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(255, 107, 157, 0.2);
}

.cute-upload-btn.uploading {
  pointer-events: none;
  opacity: 0.7;
}

.cute-upload-btn input {
  display: none;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px;
}

.upload-icon {
  font-size: 48px;
}

.upload-text {
  color: #ff6b9d;
  font-weight: 600;
  font-size: 16px;
}

.preview-container {
  position: relative;
  display: inline-block;
  margin-top: 20px;
}

.cute-preview {
  width: 150px;
  height: 200px;
  object-fit: cover;
  border-radius: 20px;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(255, 107, 157, 0.3);
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff4d87 100%);
  color: white;
  border: 3px solid white;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(255, 77, 135, 0.4);
  transition: all 0.2s ease;
}

.remove-btn:hover {
  transform: scale(1.1) rotate(90deg);
}

.row {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.rating-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-slider {
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #ffe4e8;
  outline: none;
}

.rating-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff4d87 100%);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 77, 135, 0.4);
  transition: all 0.2s ease;
}

.rating-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
}

.rating-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff4d87 100%);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(255, 77, 135, 0.4);
}

.rating-display {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-radius: 12px;
  border: 2px solid #ffe4e8;
}

.stars {
  font-size: 20px;
  letter-spacing: 2px;
}

.rating-number {
  font-weight: 700;
  color: #ff6b9d;
  font-size: 18px;
}

.submit-btn {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #ff6b9d 0%, #ff4d87 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  margin-top: 10px;
  box-shadow: 0 10px 30px rgba(255, 77, 135, 0.4);
  transition: all 0.3s ease;
  letter-spacing: 1px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(255, 77, 135, 0.5);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(-1px);
}

.submit-btn:disabled {
  background: linear-gradient(135deg, #ccc 0%, #aaa 100%);
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
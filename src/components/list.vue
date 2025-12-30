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

// --- 3. Firebase 邏輯：加入 UID 隔離 ---
onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // 關鍵：只抓取 uid 等於當前使用者的資料
      const q = query(
        collection(db, "myFavoryList"), 
        where("uid", "==", user.uid), 
        orderBy("createdAt", "desc")
      );
      onSnapshot(q, (querySnapshot) => {
        const list = [];
        querySnapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        collectionList.value = list;
      });
    } else {
      collectionList.value = [];
    }
  });
})

const deleteItem = async (id) => {
  if (confirm('要跟這部作品說掰掰嗎？')) {
    await deleteDoc(doc(db, "myFavoryList", id));
  }
}
</script>

<template>
  <div class="container">
    <h1 class="main-title">🌸 我的Favory🌸</h1>

    

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
.container { 
  max-width: 100%; 
  margin: 0 auto; 
  padding: 40px 20px; 
  font-family: 'Noto Sans TC', sans-serif; 
  background-color: #fffafb; 
  min-height: 100vh; 
  max-height: 100%;
  overflow-y: scroll;
}
.main-title { text-align: center; color: #ff82ab; margin-bottom: 30px; font-size: 2.5rem; text-shadow: 2px 2px 4px rgba(255, 182, 193, 0.5); }

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
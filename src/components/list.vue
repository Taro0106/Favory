<script setup>
import { ref, onMounted } from 'vue'
import { db, auth } from '../firebase' 
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

const collectionList = ref([]) 

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
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
  if (confirm('要跟這部作品說掰掰嗎？ 🥺')) {
    await deleteDoc(doc(db, "myFavoryList", id));
  }
}
</script>

<template>
  <div class="container">
    <div class="list-grid">
      <div v-for="item in collectionList" :key="item.id" class="item-card">
        <button class="delete-btn" @click="deleteItem(item.id)" title="刪除">
          <span>×</span>
        </button>
        
        <div class="card-img">
          <img :src="item.image" :alt="item.name">
          <div class="overlay">
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
        
      </div>
    </div>

    <div v-if="collectionList.length === 0" class="empty-state">
      <div class="empty-icon">📚</div>
      <p>還沒有收藏任何作品呢～</p>
    </div>
  </div>
</template>

<style scoped>
* { box-sizing: border-box; }

.container {
  max-width: 95%; /* 稍微加寬，讓一排三個不擁擠 */
  margin: 0 auto;
  padding: 20px 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* 2. 強制一排三個 (Grid 調整) */
.list-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)); /* 永遠至少三格 */
  gap: 12px;
}

.main-title {
  text-align: center;
  background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 50px;
  letter-spacing: 2px;
}

.heart {
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.1); }
  50% { transform: scale(1); }
}

.item-card {
  position: relative;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(255, 107, 157, 0.15);
  transition: all 0.3s ease;
  cursor: pointer;
}

.item-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 15px 40px rgba(255, 107, 157, 0.25);
}

.delete-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: #ff6b9d;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: all 0.3s ease;
}

.item-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #ff6b9d;
  color: white;
  transform: scale(1.1) rotate(90deg);
}

.card-img {
  position: relative;
  width: 100%;
  padding-top: 140%;
  overflow: hidden;
}

.card-img img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .card-img img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
  padding: 20px 15px 10px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.item-card:hover .overlay {
  transform: translateY(0);
}

.name {
  color: white;
  font-weight: 700;
  font-size: 15px;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  line-height: 1.3;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #c06c84;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 18px;
  font-weight: 600;
}

/* --- 電腦版 RWD 調整 --- */
@media (min-width: 768px) {
  .container {
    padding: 40px;
  }
  
  .list-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); /* 大螢幕可自動增格 */
    gap: 25px;
  }

  .item-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .name {
    font-size: 14px;
  }

  .stars {
    font-size: 10px;
  }
}
</style>
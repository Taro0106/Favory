<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase'
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore'

const newMessage = ref('')
const messages = ref([])

// 1. 監聽資料庫變動 (即時讀取)
onMounted(() => {
  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
  
  // 當 Firestore 資料有變，這個 callback 就會觸發
  onSnapshot(q, (querySnapshot) => {
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });
    messages.value = list;
  });
})

// 2. 新增資料到 Firestore
const sendMessage = async () => {
  if (newMessage.value.trim() === '') return;
  
  try {
    await addDoc(collection(db, "messages"), {
      text: newMessage.value,
      createdAt: new Date()
    });
    newMessage.value = ''; // 清空輸入框
  } catch (e) {
    console.error("發送失敗：", e);
  }
}
</script>

<template>
  <div>
    <h2>Firebase 留言板222222</h2>
    <input v-model="newMessage" placeholder="想說什麼？" @keyup.enter="sendMessage">
    <button @click="sendMessage">送出</button>

    <ul>
      <li v-for="msg in messages" :key="msg.id">
        {{ msg.text }}
      </li>
    </ul>
  </div>
  
</template>

<style>
/* 基礎重置，確保滿版 */
body {
  margin: 0;
  padding: 0;
  font-family: sans-serif;
  background-color: #f4f4f4;
}

.container {
  margin: 2rem auto;
  padding: 0 20px;
  text-align: center;
}
</style>
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnH6OrDHBa-ljtrEpfAmwDzSXZdVqLBzw",
  authDomain: "taro-test-dc290.firebaseapp.com",
  projectId: "taro-test-dc290",
  storageBucket: "taro-test-dc290.firebasestorage.app",
  messagingSenderId: "561002476888",
  appId: "1:561002476888:web:8a51ece156741e965a212d",
  measurementId: "G-7LQTPF9BNL"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 導出資料庫實例
export const db = getFirestore(app);
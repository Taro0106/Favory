import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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

// 初始化服務（這裡不要加 export）
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 統一在最後一行導出
export { db, auth, provider };
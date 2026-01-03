<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

</script>

<template>
  <div class="home-container">
    主頁
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: white;
}

/* 左側品牌區 */
.brand-section {
  flex: 1.2; /* 佔據稍微多一點的空間 */
  background: linear-gradient(135deg, #fff5f7 0%, #ffe4e1 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.brand-content {
  text-align: center;
}

.main-logo {
  width: 180px;
  filter: drop-shadow(0 10px 20px rgba(255, 182, 193, 0.4));
  margin-bottom: 20px;
}

.app-title {
  font-size: 3.5rem;
  color: #ff82ab;
  margin: 10px 0;
  letter-spacing: 2px;
}

.app-slogan {
  color: #5d4037;
  font-size: 1.2rem;
  opacity: 0.8;
}

/* 右側登入區 */
.auth-section {
  flex: 0.8;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background: white;
}

.login-card {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-card h2 {
  color: #5d4037;
  font-size: 2rem;
  margin-bottom: 10px;
}

.login-card p {
  color: #888;
  margin-bottom: 40px;
}

/* Google 按鈕樣式 */
.google-login-btn {
  width: 100%;
  padding: 15px;
  border: 2px solid #ffe4e1;
  background: white;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 1.1rem;
  color: #5d4037;
  cursor: pointer;
  transition: 0.3s;
}

.google-login-btn:hover {
  background: #fff5f7;
  border-color: #ffb6c1;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 182, 193, 0.2);
}

.google-icon {
  width: 24px;
}

.footer-links {
  margin-top: 30px;
  font-size: 0.9rem;
  color: #ccc;
}

/* --- 手機版自適應 --- */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column; /* 改為上下排列 */
  }

  .brand-section {
    flex: 0.4; /* 上面佔比縮小 */
    padding: 20px;
  }

  .main-logo { width: 100px; }
  .app-title { font-size: 2rem; }
  .app-slogan { font-size: 1rem; }

  .auth-section {
    flex: 0.6;
    padding: 30px 20px;
    border-radius: 30px 30px 0 0;
    margin-top: -30px; /* 讓白色卡片稍微疊在粉色背景上，更有層次感 */
  }
}
</style>
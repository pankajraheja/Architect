<script setup>
import { ref, onMounted } from "vue";

const message = ref("Loading message from backend...");
const error = ref("");

async function loadMessage() {
  try {
    error.value = "";

    const response = await fetch("http://localhost:3001/api/hello");

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    message.value = data.message;
  } catch (err) {
    error.value = "Could not load backend message.";
    message.value = "";
    console.error("Frontend fetch error:", err);
  }
}

onMounted(() => {
  loadMessage();
});
</script>

<template>
  <main class="container">
    <h1>Simple Vue + Express App</h1>
    <p>This message comes from the backend API:</p>

    <p v-if="message" class="message">{{ message }}</p>
    <p v-if="error" class="error">{{ error }}</p>

    <button @click="loadMessage">Call Backend Again</button>
  </main>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 60px auto;
  font-family: Arial, sans-serif;
  text-align: center;
}

.message {
  color: #1f7a1f;
  font-weight: bold;
  margin: 20px 0;
}

.error {
  color: #b00020;
  font-weight: bold;
  margin: 20px 0;
}

button {
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  background: #42b883;
  color: white;
  border-radius: 6px;
}
</style>
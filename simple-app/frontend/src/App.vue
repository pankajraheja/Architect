<script setup>
import { ref } from "vue";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const userName = ref("");
const accessToken = ref("");
const protectedMessage = ref("");
const error = ref("");

async function signIn() {
  try {
    error.value = "";

    await msalInstance.initialize();

    const loginResponse = await msalInstance.loginPopup(loginRequest);
    userName.value = loginResponse.account?.username || "Signed in user";

    const tokenResponse = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      account: loginResponse.account
    });

    accessToken.value = tokenResponse.accessToken;
  } catch (err) {
    console.error("Login error:", err);
    error.value = "Login failed.";
  }
}

async function callProtectedApi() {
  try {
    error.value = "";
    protectedMessage.value = "";

    const response = await fetch("http://localhost:3001/api/protected", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    protectedMessage.value = data.message;
  } catch (err) {
    console.error("Protected API error:", err);
    error.value = "Protected API call failed.";
  }
}
</script>

<template>
  <main class="container">
    <h1>Vue + Express + Microsoft Login</h1>

    <button @click="signIn">Sign in with Microsoft</button>

    <p v-if="userName">Signed in as: {{ userName }}</p>

    <button :disabled="!accessToken" @click="callProtectedApi">
      Call Protected Backend API
    </button>

    <p v-if="protectedMessage" class="message">{{ protectedMessage }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </main>
</template>

<style scoped>
.container {
  max-width: 700px;
  margin: 60px auto;
  font-family: Arial, sans-serif;
  text-align: center;
}

button {
  padding: 10px 16px;
  border: none;
  cursor: pointer;
  background: #42b883;
  color: white;
  border-radius: 6px;
  margin: 10px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  color: #1f7a1f;
  font-weight: bold;
  margin-top: 20px;
}

.error {
  color: #b00020;
  font-weight: bold;
  margin-top: 20px;
}
</style>
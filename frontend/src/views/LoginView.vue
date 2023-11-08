<script setup lang="ts">
</script>

<template>
  <main class="full_screen">
    <div class="login">
      <div class="header">Login</div>
      <div class="login_form">
        <div class="login_element">
          <p>Email:</p>
          <input type="email" size=50 v-model="email">
        </div>
        <div class="login_element">
          <p>Password:</p>
          <input type="password" size=50 v-model="pasword">
        </div>
        <div class="login_element buttons">
          <RouterLink to="/weights">
            <button @click="login">Login</button>
          </RouterLink>
          <RouterLink to="/">
            <button>Cancel</button>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.header {
  top: 0;
  width: 100%;
  height: 30px;
  background-color: #000;
  color: #FFF;
  padding-left:0.5em;
  font-weight: bold;
  line-height:2.1em;
  font-size:0.85em
}
.login {
  display: flex;
  flex-direction: column;
  border:1px solid #000;
  height:250px;
  width:100%
}
.login_form {
  padding-top:10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login_element {
  padding-top: 15px;
}
.login_element.buttons button {
  padding-right:10px;
}
</style>

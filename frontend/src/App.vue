<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <RouterLink to="/">
      <h1>WeightTracker</h1>
    </RouterLink>
    <nav>
      Welcome Back Dave, user | logout
      <RouterLink to="/login">Login</RouterLink>
    </nav>
  </header>
  <div class="main">
    <RouterView />
  </div>
  <footer>
    &copy; zz50.co.uk
    <div class="version">weighttracker v0.1</div>
  </footer>
</template>

<style scoped>
header {
  top: 0;
  width: 100%;
  height: 80px;
  background-color: #000;
  line-height: 1.5;
  display: flex;
  padding:0 1em 0 1em;
  color:#FFF;
}
nav {
  float:right;
  text-align: right;
  margin-left: auto;
  order:2;
  font-size: 0.85rem;
  padding-top:0.5em;
}
a {
  color: #FFF;
  text-decoration: none;
  padding-top:1em;
}
.main {
}
footer {
  width: 100%;
  height:28px;
  display: flex;
  place-items: center;
  font-weight:bold;
  font-size: 0.75em;
  padding:0 1em 0 1em;
  background-color: #000;
  color: #FFF;
}
.version {
  float:right;
  text-align: left;
  margin-left: auto;
  order:2;
  font-weight:bold;
  padding:0 1em 0 1em;
}
</style>

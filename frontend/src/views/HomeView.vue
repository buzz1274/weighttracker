<script setup lang="ts">
import { decodeCredential } from 'vue3-google-login'

function authenticateUser(data) {
  console.log(data)

  const userData = decodeCredential(data.credential)

  console.log(userData)

  fetch('/api/user/login/', {
    method: 'POST',
    body: JSON.stringify({
      authentication_method: 'GOOGLE',
      credential: data.credential
    }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
    })
    .catch((error) => {
      console.log(error)
    })
}

const callback = (response) => {
  authenticateUser(response)
}
</script>

<template>
  <main class="full_screen">
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum porttitor tortor id urna
      efficitur ultrices. Maecenas fringilla dapibus condimentum. Duis ut sapien non leo feugiat
      tempus non ac dolor. Ut accumsan rhoncus pulvinar. Mauris tincidunt est vitae ex ornare
      varius. Phasellus id dolor in felis molestie bibendum non eu arcu. Nunc molestie maximus
      vestibulum. Ut tempor nunc a nisi suscipit, ac ullamcorper massa mattis. Etiam justo lacus,
      scelerisque non quam in, suscipit vehicula neque. Phasellus non diam ac lorem ornare
      ullamcorper. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
      turpis egestas. Duis faucibus est erat, a suscipit diam blandit in.
      <br /><br />
      Nulla eu ullamcorper libero, vel eleifend orci. Cras massa erat, rhoncus facilisis enim at,
      maximus varius mauris. Fusce at sapien vitae velit laoreet suscipit. In finibus molestie
      rhoncus. Donec risus velit, hendrerit ut quam quis, hendrerit finibus purus. Nam quis faucibus
      lorem. Pellentesque at sem quam. Fusce rhoncus orci vitae iaculis efficitur. Maecenas elit
      purus, pharetra at lectus id, accumsan gravida enim. Duis elementum velit non leo ultrices, a
      rutrum eros cursus. Morbi nec finibus risus. Cras lacus sapien, pretium at nisi quis,
      consequat dignissim ante. Phasellus molestie suscipit suscipit. Integer tristique tincidunt
      est, vitae pellentesque justo consequat scelerisque. Praesent interdum dolor felis, at aliquet
      neque placerat vel. Aliquam feugiat urna lorem, nec lobortis lectus pretium sed.
    </p>
    <div class="home_buttons">
      <GoogleLogin :callback="callback" />
    </div>
  </main>
</template>

<style>
.home_buttons {
  padding-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}
button {
  margin-right: 20px;
}
</style>

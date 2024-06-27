<script setup lang="ts">
import type { CallbackTypes } from 'vue3-google-login'
import router from '../router/'
import { ref, onBeforeMount } from 'vue'

const NOT_REGISTERED_URL = '/register'
const REGISTERED_URL = '/weights'

const error = ref('')

onBeforeMount(() => {
  if (localStorage.getItem('access_token')) {
    if (localStorage.getItem('registered') && !localStorage.getItem('registered')) {
      router.push(REGISTERED_URL)
    } else {
      router.push(NOT_REGISTERED_URL)
    }
  }
})

const callback: CallbackTypes.CodeResponseCallback = (response) => {
  fetch('https://' + window.location.hostname + '/api/user/login/', {
    method: 'POST',
    body: JSON.stringify({
      authentication_method: 'GOOGLE',
      code: response.code
    }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      return Promise.reject(response)
    })
    .then((data) => {
      localStorage.setItem('access_token', data['access_token'])
      localStorage.setItem('refresh_token', data['access_token'])
      localStorage.setItem('registered', data['registered'])

      if ('registered' in data && !data['registered']) {
        router.push(NOT_REGISTERED_URL)
      } else {
        router.push(REGISTERED_URL)
      }
    })
    .catch((response) => {
      response.json().then((json: string) => {
        if ('error' in json && json['error']) {
          error.value = json['error']
        } else {
          error.value = 'An error has occurred'
        }
      })
    })
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
    <div v-if="error">{{ error }}</div>
    <div class="home_buttons">
      <GoogleLogin :callback="callback">
        <div id="gSignInWrapper">
          <div id="customBtn" class="customGPlusSignIn">
            <span class="icon"></span>
            <span class="buttonText">Login with Google</span>
          </div>
        </div>
      </GoogleLogin>
    </div>
  </main>
</template>

<style scoped>
#customBtn {
  display: inline-block;
  background: white;
  color: #444;
  width: 190px;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
}
#customBtn:hover {
  cursor: pointer;
}
span.icon {
  display: inline-block;
  vertical-align: middle;
  height: 42px;
}
span.buttonText {
  display: inline-block;
  vertical-align: middle;
  padding-left: 33px;
  padding-right: 42px;
  font-size: 14px;
  font-weight: bold;
}
</style>

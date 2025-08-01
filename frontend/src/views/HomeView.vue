<script setup lang="ts">
/*global google */

import { ref, onMounted, onBeforeMount } from 'vue'
import { useStore } from '@/stores/store'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import router from '@/router'
import type { UserModel } from '@/models/UserModel'
import type { WeightModel } from '@/models/WeightModel'

const store = useStore()
const route = useRoute()

const { userModel, weightModel } = storeToRefs(store)

const user: UserModel = userModel.value
const weight: WeightModel = weightModel.value

const error = ref('')
const displayLogoutMessage = ref(false)
const displayErrorMessage = ref(false)

onBeforeMount(() => {
  if (route.path.slice(1) === 'logout' && user.isAuthenticated()) {
    user.logout()
    user.reset()
    weight.reset()
    displayLogoutMessage.value = true
  }
})

onMounted(() => {
  if (typeof google !== 'undefined' && typeof google.accounts !== 'undefined') {
    initSignIn()
  }
})

const initSignIn = () => {
  google.accounts.id.initialize({
    client_id: '805742976196-kl4thfduqpgso0v52rp31djh95kgmenu.apps.googleusercontent.com',
    auto_select: true,
    callback: loginCallback
  })

  google.accounts.id.renderButton(document.getElementById('gSignInButton'), {
    type: 'standard',
    text: 'sign_in_with',
    theme: 'outline',
    size: 'large',
    width: '80'
  })
}

const loginCallback = async (credentials) => {
  if (await user.login(credentials.credential, 'GOOGLE')) {
    await user.get()
    await weight.get()
    await router.push('/weights')
  } else {
    displayErrorMessage.value = true
  }
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
    <div v-if="error" class="w-100">
      <div class="d-flex justify-content-center text-danger">{{ error }}</div>
    </div>
    <div class="home_buttons">
      <div>
        <component
          v-bind:is="script"
          src="https://accounts.google.com/gsi/client"
          @load="initSignIn"
          hidden="{{ user.isAuthenticated() ? 'hidden' : '' }}"
          async
          defer
        />
        <div id="gSignInButton" />
        <div v-if="displayLogoutMessage" class="d-flex justify-content-center mt-3 text-danger">
          You have been logged out
        </div>
        <div v-if="displayErrorMessage" class="d-flex justify-content-center mt-3 text-danger">
          An error has occurred
        </div>
      </div>
    </div>
  </main>
</template>

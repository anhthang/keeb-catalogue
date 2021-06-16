<template>
  <div class="right-header">
    <a-dropdown>
      <div>
        <a-avatar :src="user.avatar" />
        {{ user.name }}
      </div>
      <a-menu slot="overlay">
        <a-menu-item>
          <span @click="loginWithGoogle">
            <a-icon type="google" /> Login with Google
          </span>
        </a-menu-item>
        <a-menu-item>
          <a href="javascript:;"> Logout </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'

export default {
  computed: {
    ...mapState(['user']),
  },
  methods: {
    ...mapMutations(['SET_USER']),
    async loginWithGoogle() {
      const provider = new this.$fireModule.auth.GoogleAuthProvider()
      const { user } = await this.$fireModule.auth().signInWithPopup(provider)

      this.SET_USER({
        avatar: user.photoURL,
        name: user.displayName,
      })
    },
  },
}
</script>

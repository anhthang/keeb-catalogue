<template>
  <div class="right-header">
    <a-dropdown>
      <div>
        <a-avatar :src="user.avatar" />
        {{ user.name }}
      </div>
      <a-menu slot="overlay">
        <a-menu-item v-if="!user.avatar">
          <span @click="loginWithGoogle">
            <a-icon type="google" /> Login with Google
          </span>
        </a-menu-item>
        <a-menu-item v-else>
          <span @click="logout"><a-icon type="logout" /> Logout </span>
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
      const google = new this.$fireModule.auth.GoogleAuthProvider()
      await this.$fireModule
        .auth()
        .signInWithPopup(google)
        .then(({ credential, user }) => {
          this.SET_USER({
            avatar: user.photoURL,
            name: user.displayName,
            token: credential.accessToken,
          })

          this.$message.success(
            `Hello, ${user.displayName}. You successfully logged into this website.`
          )
        })
        .catch((err) => {
          this.$message.warning(err.message)
        })
    },
    async logout() {
      await this.$fireModule
        .auth()
        .signOut()
        .then(() => {
          this.SET_USER({
            avatar: '',
            name: '',
          })

          this.$router.push('/')
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
  },
}
</script>

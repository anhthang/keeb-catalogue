<template>
  <div class="right-header">
    <a-dropdown>
      <div>
        <a-avatar :src="user.photoURL" />
        {{ user.displayName }}
      </div>
      <a-menu slot="overlay">
        <a-menu-item v-if="!user.photoURL">
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
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['user']),
  },
  methods: {
    async loginWithGoogle() {
      const google = new this.$fireModule.auth.GoogleAuthProvider()
      await this.$fireModule
        .auth()
        .signInWithPopup(google)
        .then(({ credential, user }) => {
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
          this.$message.success('You have been logged out successfully.')
          this.$router.push('/')
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
  },
}
</script>

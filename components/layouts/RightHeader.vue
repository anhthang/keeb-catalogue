<template>
  <div class="right-header">
    <a-dropdown v-if="user.emailVerified">
      <div v-if="$device.isMobile">
        <a-avatar :src="user.photoURL" />
      </div>
      <div v-else>
        <a-avatar :src="user.photoURL" />
        {{ user.displayName }}
      </div>
      <a-menu slot="overlay">
        <a-menu-item>
          <span @click="gotoSettings"><a-icon type="setting" /> Settings </span>
        </a-menu-item>
        <a-menu-divider />
        <a-menu-item>
          <span @click="logout"><a-icon type="logout" /> Logout </span>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
    <a-dropdown v-else>
      <div>
        <a-avatar
          src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
        />
        Login
      </div>
      <a-menu slot="overlay">
        <a-menu-item>
          <span @click="loginWithGoogle">
            <a-icon type="google" /> Login with Google
          </span>
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
      await this.$fire.auth
        .signOut()
        .then(() => {
          this.$message.success('You have been logged out successfully.')
          this.$router.push('/')
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
    },
    gotoSettings() {
      this.$router.push('/account/settings')
    },
  },
}
</script>

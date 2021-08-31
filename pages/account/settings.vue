<template>
  <div class="container">
    <a-page-header title="Settings">
      <a-card>
        <a-tabs default-active-key="profile" :tab-position="tabPosition">
          <a-tab-pane key="profile" tab="Profile">
            <setting-profile />
          </a-tab-pane>
          <a-tab-pane key="appearance" tab="Appearance">
            <setting-appearance />
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </a-page-header>
  </div>
</template>

<script>
import SettingAppearance from '~/components/accounts/SettingAppearance.vue'
import SettingProfile from '~/components/accounts/SettingProfile.vue'

export default {
  components: { SettingAppearance, SettingProfile },
  middleware({ store, redirect }) {
    // If the user is not authenticated
    if (!store.state.user.emailVerified) {
      return redirect('/login')
    }
  },
  data() {
    return {
      tabPosition: this.$device.isMobile ? 'top' : 'left',
    }
  },
  head() {
    return {
      title: `Account Settings - ${process.env.appName}`,
    }
  },
}
</script>

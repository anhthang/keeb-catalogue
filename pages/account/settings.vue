<template>
  <div class="container">
    <a-page-header title="Settings">
      <a-tabs default-active-key="general" :tab-position="tabPosition">
        <a-tab-pane key="general" tab="General">
          <a-row>
            <a-col :xs="24" :sm="16">
              <a-form-item label="Name">
                <a-input v-model="user.displayName" disabled>
                  <a-icon slot="prefix" type="user" />
                </a-input>
              </a-form-item>
              <a-form-item label="Email">
                <a-input v-model="user.email" disabled>
                  <a-icon slot="prefix" type="mail" />
                  <a-icon
                    v-if="user.emailVerified"
                    slot="suffix"
                    type="check-circle"
                    class="email-verified"
                  />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="0" :sm="8">
              <img class="avatar" :src="user.photoURL" />
            </a-col>
          </a-row>
        </a-tab-pane>
        <a-tab-pane key="social" tab="Social Profiles">
          <a-row>
            <a-col :xs="24" :sm="16">
              <a-form-item label="Reddit">
                <a-input
                  v-model="settings.social.reddit"
                  placeholder="u/username"
                >
                  <a-icon slot="prefix" type="reddit" />
                </a-input>
              </a-form-item>
              <a-form-item label="Discord">
                <a-input
                  v-model="settings.social.discord"
                  placeholder="Discord#0000"
                >
                  <a-icon
                    slot="prefix"
                    :component="DiscordSvg"
                    class="custom-icon"
                  />
                </a-input>
              </a-form-item>
              <a-form-item label="QQ">
                <a-input v-model="settings.social.qq" placeholder="00000000">
                  <a-icon slot="prefix" type="qq" />
                </a-input>
              </a-form-item>
              <a-form-item>
                <a-button
                  icon="save"
                  type="primary"
                  :loading="loading"
                  @click="saveSettings('social')"
                >
                  Save
                </a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import DiscordSvg from '@/components/icons/DiscordSvg'

export default {
  middleware({ store, redirect }) {
    // If the user is not authenticated
    if (!store.state.user.emailVerified) {
      return redirect('/login')
    }
  },
  data() {
    return {
      tabPosition: this.$device.isMobile ? 'top' : 'left',
      DiscordSvg,
      loading: false,
      settings: {
        social: {},
      },
    }
  },
  computed: {
    ...mapState(['user']),
  },
  beforeMount() {
    this.settings.social = this.user.social
  },
  methods: {
    saveSettings(type) {
      this.loading = true
      this.$fire.firestore
        .collection('users')
        .doc(this.user.uid)
        .update({
          [type]: this.settings[type],
        })
        .then(() => {
          this.$message.success('Settings updated successfully.')
          this.loading = false
        })
        .catch((e) => {
          this.$message.success(e.message)
          this.loading = false
        })
    },
  },
}
</script>

<style lang="less">
.avatar {
  margin: 0 auto;
  border-radius: 50%;
  display: block;
}
</style>

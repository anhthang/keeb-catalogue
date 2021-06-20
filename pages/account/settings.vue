<template>
  <a-page-header title="Settings" class="container">
    <a-tabs default-active-key="general" tab-position="left">
      <a-tab-pane key="general" tab="General">
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
              style="color: green"
            />
          </a-input>
        </a-form-item>
      </a-tab-pane>
      <a-tab-pane key="social" tab="Social">
        <a-form-item label="Reddit">
          <a-input v-model="settings.social.reddit" placeholder="u/username">
            <a-icon slot="prefix" type="reddit" />
          </a-input>
        </a-form-item>
        <a-form-item label="Discord">
          <a-input v-model="settings.social.discord" placeholder="Discord#0000">
            <a-icon
              slot="prefix"
              :component="DiscordSvg"
              class="discord-icon"
            />
          </a-input>
        </a-form-item>
        <a-form-item label="QQ">
          <a-input v-model="settings.social.qq" placeholder="00000000">
            <a-icon slot="prefix" type="qq" />
          </a-input>
        </a-form-item>
      </a-tab-pane>
    </a-tabs>
  </a-page-header>
</template>

<script>
import { mapState } from 'vuex'
import DiscordSvg from '@/components/DiscordSvg'

export default {
  data() {
    return {
      DiscordSvg,
      settings: {
        social: {},
      },
    }
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

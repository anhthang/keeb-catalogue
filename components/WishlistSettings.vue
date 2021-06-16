<template>
  <a-card title="Settings" size="small">
    <template slot="extra">
      <a-button type="primary" icon="save" @click="saveSettings">
        Save
      </a-button>
    </template>

    <!-- <a-form-item label="Caps per Line">
      <a-input-number v-model="settings.caps_per_line" :min="1" :max="10" />
    </a-form-item> -->
    <a-form-item label="Wish Title">
      <a-input v-model="settings.wish.title">
        <a-icon slot="prefix" type="font-size" />
      </a-input>
    </a-form-item>
    <a-form-item label="Wish Collection">
      <a-select v-model="settings.wish.collection" style="width: 100%">
        <a-select-option
          v-for="collection in collections"
          :key="collection.slug"
          :value="collection.slug"
        >
          {{ collection.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item>
      <a-checkbox
        v-model="settings.want_to_trade"
        :checked="wantToTrade"
        @change="handleWantToTrade"
      >
        Want to trade
      </a-checkbox>
    </a-form-item>
    <a-form-item v-if="settings.want_to_trade" label="Trade Title">
      <a-input v-model="settings.trade.title">
        <a-icon slot="prefix" type="font-size" />
      </a-input>
    </a-form-item>
    <a-form-item v-if="settings.want_to_trade" label="Trade Collection">
      <a-select v-model="settings.trade.collection" style="width: 100%">
        <a-select-option
          v-for="collection in collections"
          :key="collection.slug"
          :value="collection.slug"
        >
          {{ collection.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="Reddit">
      <a-input v-model="settings.social.reddit" placeholder="u/username">
        <a-icon slot="prefix" type="reddit" />
      </a-input>
    </a-form-item>
    <a-form-item label="Discord">
      <a-input v-model="settings.social.discord" placeholder="Discord#0000">
        <a-icon slot="prefix" :component="DiscordSvg" class="discord-icon" />
      </a-input>
    </a-form-item>
    <a-form-item label="QQ">
      <a-input v-model="settings.social.qq" placeholder="00000000">
        <a-icon slot="prefix" type="qq" />
      </a-input>
    </a-form-item>
  </a-card>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import DiscordSvg from '@/components/DiscordSvg'
import { COLLECTIONS, WISHLIST_SETTINGS } from '@/constants'

export default {
  data() {
    return {
      DiscordSvg,
      wantToTrade: false,
      settings: {},
      collections: [],
    }
  },
  fetch() {
    this.settings = this.wishlistSettings
  },
  computed: {
    ...mapState('artisans', ['wishlistSettings']),
  },
  watch: {
    settings: {
      handler(val) {
        this.WISHLIST_SETTINGS(JSON.parse(JSON.stringify(val)))
      },
      deep: true,
    },
  },
  beforeMount() {
    this.collections = JSON.parse(localStorage.getItem(COLLECTIONS)) || []
  },
  methods: {
    ...mapMutations('artisans', ['WISHLIST_SETTINGS']),
    saveSettings() {
      localStorage.setItem(WISHLIST_SETTINGS, JSON.stringify(this.settings))

      this.$message.success('Settings saved')
    },
    handleWantToTrade() {
      this.wantToTrade = !this.wantToTrade
    },
  },
}
</script>

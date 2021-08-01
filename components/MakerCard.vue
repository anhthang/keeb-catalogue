<template>
  <nuxt-link :to="`/${type}/maker/${maker.id}`">
    <a-card hoverable :title="maker.name" :size="size">
      <a-icon
        v-if="user.emailVerified && type === 'artisans'"
        slot="extra"
        type="star"
        :class="favorite ? 'favorite-maker' : ''"
        @click="
          (e) => {
            e.preventDefault()
            addFavoriteMaker(maker.id)
          }
        "
      />
      <img
        slot="cover"
        loading="lazy"
        :alt="maker.name"
        :src="maker.img || nologo"
      />
    </a-card>
  </nuxt-link>
</template>

<script>
import { mapState } from 'vuex'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['type', 'maker', 'favorite'],
  data() {
    return {
      nologo: 'https://i.imgur.com/wYMcZiI.png',
      size: this.$device.isMobile ? 'small' : 'default',
    }
  },
  computed: {
    ...mapState(['user']),
  },
  methods: {
    addFavoriteMaker(name) {
      this.$store.dispatch('artisans/updateFavoriteMakers', name)
    },
  },
}
</script>

<template>
  <nuxt-link :to="hyperlink">
    <a-card hoverable :title="maker.name" :size="size">
      <a-icon
        v-if="user.emailVerified && !isKeeb"
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
  props: ['maker', 'isKeeb', 'favorite'],
  data() {
    return {
      nologo: 'https://i.imgur.com/wYMcZiI.png',
      size: this.$device.isMobile ? 'small' : 'default',
    }
  },
  computed: {
    ...mapState(['user']),
    hyperlink() {
      return this.isKeeb
        ? `/keebs/maker/${this.maker.id}`
        : `/artisans/maker/${this.maker.id}`
    },
  },
  methods: {
    addFavoriteMaker(name) {
      this.$store.dispatch('artisans/updateFavoriteMakers', name)
    },
  },
}
</script>

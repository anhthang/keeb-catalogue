<template>
  <nuxt-link :to="`/artisans/${maker.slug}`">
    <a-card hoverable :title="maker.name">
      <a-icon
        slot="extra"
        type="star"
        :class="favorite ? 'favorite-maker' : ''"
        @click="
          (e) => {
            e.preventDefault()
            addFavoriteMaker(maker.slug)
          }
        "
      />
      <img
        slot="cover"
        loading="lazy"
        :alt="maker.name"
        :src="`https://github.com/keycap-archivist/website/raw/master/src/assets/img/logos/${maker.id}.jpg`"
      />
    </a-card>
  </nuxt-link>
</template>

<script>
import { mapState } from 'vuex'

export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['maker', 'favorite'],
  computed: {
    ...mapState(['user']),
  },
  methods: {
    addFavoriteMaker(name) {
      this.$store.dispatch('artisans/updateFavoriteMakers', {
        name,
        uid: this.user.uid,
      })
    },
  },
}
</script>

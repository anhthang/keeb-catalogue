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
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['maker', 'favorite'],
  methods: {
    addFavoriteMaker(slug) {
      this.$store.dispatch('artisans/updateFavoriteMakers', slug)
    },
  },
}
</script>

<style lang="less">
.anticon-star {
  &.favorite-maker {
    color: #eb2f96;
  }
}
</style>

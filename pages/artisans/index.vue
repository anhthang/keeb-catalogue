<template>
  <div class="artisan-container">
    <a-page-header title="Artisan Makers">
      <div>
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="maker in sortedMakers"
            :key="maker.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <nuxt-link :to="`/artisans/${maker.slug}`">
              <a-card hoverable :title="maker.name">
                <a-icon
                  slot="extra"
                  type="star"
                  :theme="
                    favoriteMakers.includes(maker.slug) ? 'twoTone' : 'outlined'
                  "
                  two-tone-color="#eb2f96"
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
          </a-col>
        </a-row>
      </div>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { FAVORITE_MAKERS } from '@/constants'
import { sortBy } from 'lodash'

export default {
  data() {
    return {
      favoriteMakers: [],
    }
  },
  computed: {
    ...mapState('artisans', ['makers']),
    sortedMakers() {
      return sortBy(this.makers, (i) => !this.favoriteMakers.includes(i.slug))
    },
  },
  beforeMount() {
    this.favoriteMakers =
      JSON.parse(localStorage.getItem(FAVORITE_MAKERS)) || []
  },
  methods: {
    addFavoriteMaker(slug) {
      if (!this.favoriteMakers.includes(slug)) {
        this.favoriteMakers.push(slug)
      } else {
        this.favoriteMakers = this.favoriteMakers.filter((i) => i !== slug)
      }

      localStorage.setItem(FAVORITE_MAKERS, JSON.stringify(this.favoriteMakers))
    },
  },
}
</script>

<style>
.artisan-container {
  margin: 0 auto;
  min-height: 100vh;
  text-align: center;
  max-width: 1600px;
}

/** remove this if all maker had cover/logo */
.artisan-container .ant-card {
  height: 100%;
}
</style>

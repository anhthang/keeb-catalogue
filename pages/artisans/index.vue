<template>
  <div class="artisan-container">
    <a-page-header title="Artisan Makers">
      <div>
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="maker in artisans.makers"
            :key="maker.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
          >
            <nuxt-link :to="`/artisans/${maker.slug}`">
              <a-card hoverable :title="maker.name">
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

export default {
  computed: {
    ...mapState(['artisans']),
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

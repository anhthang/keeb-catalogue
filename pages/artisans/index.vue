<template>
  <div class="artisan-container">
    <a-page-header title="Artisan Makers">
      <div style="padding: 16px 0">
        <a-row :gutter="[16, 16]" type="flex">
          <a-col v-for="maker in artisans.makers" :key="maker.id" :span="6">
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
}

.artisan-container .ant-card-cover {
  height: 300px;
  overflow: hidden;
}

.artisan-container .ant-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.discord-icon {
  font-size: 18px;
  vertical-align: middle;
}
</style>

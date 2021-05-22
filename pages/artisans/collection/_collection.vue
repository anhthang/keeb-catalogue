<template>
  <div class="maker-container">
    <a-page-header :title="name">
      <a-button slot="extra" disabled type="primary" icon="file-add">
        Add
      </a-button>
      <div>
        <a-row :gutter="[16, 16]" type="flex">
          <a-col
            v-for="colorway in collections"
            :key="colorway.id"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
            :xl="4"
          >
            <a-card hoverable :title="cardTitle(colorway)">
              <img
                slot="cover"
                loading="lazy"
                :alt="colorway.name"
                :src="colorway.img"
              />
              <a-popconfirm
                slot="extra"
                title="Are you sure remove this cap?"
                ok-text="Yes"
                cancel-text="No"
                @confirm="removeCap(colorway)"
              >
                <a-icon type="delete" />
              </a-popconfirm>
              <a-card-meta v-if="colorway.releaseDate">
                <template slot="description">
                  {{ colorway.releaseDate }}
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-page-header>
  </div>
</template>

<script>
import { COLLECTIONS } from '@/constants'

export default {
  layout: 'artisan',
  asyncData({ params }) {
    const collections = JSON.parse(localStorage.getItem(`${COLLECTIONS}`)) || []
    const collection = collections.find((c) => c.slug === params.collection)

    const colorways =
      JSON.parse(localStorage.getItem(`${COLLECTIONS}_${params.collection}`)) ||
      {}
    return {
      ...params,
      name: collection.name,
      colorways,
      collections: Object.values(colorways),
    }
  },
  methods: {
    cardTitle(clw) {
      return `${clw.name} ${clw.sculpt_name}`
    },
    removeCap(clw) {
      this.collections = this.collections.filter((c) => c.id !== clw.id)

      delete this.colorways[clw.id]
      localStorage.setItem(
        `${COLLECTIONS}_${this.collection}`,
        JSON.stringify(this.colorways)
      )

      this.$message.success(`${clw.name} removed from the collection`)
    },
  },
}
</script>

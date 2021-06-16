<template>
  <div class="container maker-container">
    <a-page-header :title="name">
      <a-button slot="extra" type="primary" icon="file-add" @click="showModal">
        Add
      </a-button>
      <a-modal
        v-model="visible"
        title="Add keycap to collection"
        @ok="addToCollection"
      >
        <search-artisans :selected="selectedIds" :visible="visible" />
      </a-modal>

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
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-page-header>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { keyBy } from 'lodash'
import { COLLECTIONS } from '@/constants'

export default {
  asyncData({ params }) {
    const collections = JSON.parse(localStorage.getItem(`${COLLECTIONS}`)) || []
    const collection = collections.find((c) => c.slug === params.collection)

    const colorways =
      JSON.parse(localStorage.getItem(`${COLLECTIONS}_${params.collection}`)) ||
      {}
    return {
      ...params,
      name: collection.name,
      collections: Object.values(colorways),
    }
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    ...mapState('artisans', ['addToCollectionItems']),
    selectedIds() {
      return this.collections.map((c) => c.id)
    },
  },
  methods: {
    cardTitle(clw) {
      return `${clw.name} ${clw.sculpt_name}`
    },
    showModal() {
      this.visible = !this.visible
    },
    updateLocalStorage() {
      const key = `${COLLECTIONS}_${this.collection}`
      const value = keyBy(this.collections, 'id')

      localStorage.setItem(key, JSON.stringify(value))
    },
    removeCap(clw) {
      this.collections = this.collections.filter((c) => c.id !== clw.id)

      this.updateLocalStorage()

      this.$message.success(`${clw.name} removed from the collection`)
    },
    async addToCollection(value) {
      const caps = await this.$store.dispatch(
        'artisans/fetchCaps',
        this.addToCollectionItems.map((i) => i.key)
      )

      this.collections.push(...caps)

      this.updateLocalStorage()

      this.visible = false
    },
  },
}
</script>

<template>
  <a-page-header title="Collection" class="maker-container">
    <a-button slot="extra" type="primary" icon="file-add" @click="showModal">
      Add
    </a-button>
    <a-modal v-model="visible" title="Add new collection" @ok="handleOk">
      <a-input v-model="collectionName" placeholder="Enter collection name" />
    </a-modal>

    <a-row :gutter="[16, 16]" type="flex">
      <a-col
        v-for="collection in collections"
        :key="collection"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <a-card hoverable :title="collection" size="small">
          <img
            slot="cover"
            loading="lazy"
            :alt="collection"
            :src="getPreviewImg(collection)"
          />

          <a-popconfirm
            slot="extra"
            title="Are you sure delete this collection?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="delCollection(collection)"
          >
            <a-button type="danger" icon="delete" />
          </a-popconfirm>
        </a-card>
      </a-col>
    </a-row>
  </a-page-header>
</template>

<script>
import { COLLECTIONS } from '@/constants'
import { sample } from 'lodash'

export default {
  layout: 'artisan',
  data() {
    return {
      visible: false,
      collectionName: undefined,
      collections: [],
    }
  },
  beforeMount() {
    this.collections = JSON.parse(localStorage.getItem(COLLECTIONS)) || []
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk() {
      if (!this.collections.includes(this.collectionName)) {
        this.collections.push(this.collectionName)

        localStorage.setItem(COLLECTIONS, JSON.stringify(this.collections))
        localStorage.setItem(
          `${COLLECTIONS}_${this.collectionName}`,
          JSON.stringify({})
        )
        this.visible = false

        this.$message.success('Added new collection')
      }
    },
    getPreviewImg(name) {
      const storage = JSON.parse(localStorage.getItem(`${COLLECTIONS}_${name}`))
      return (
        sample(Object.values(storage || {}))?.img ??
        'https://user-images.githubusercontent.com/507615/54591670-ac0a0180-4a65-11e9-846c-e55ffce0fe7b.png'
      )
    },
    delCollection(name) {
      localStorage.removeItem(`${COLLECTIONS}_${name}`)

      this.$message.success('Collection deleted')

      this.collections = this.collections.filter((n) => n !== name)
      localStorage.setItem(COLLECTIONS, JSON.stringify(this.collections))
    },
  },
}
</script>

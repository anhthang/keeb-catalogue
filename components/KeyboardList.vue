<template>
  <a-card>
    <a-list
      item-layout="vertical"
      :data-source="keyboards"
      :pagination="keyboards.length > pageSize ? { pageSize } : false"
      :loading="loading"
    >
      <a-list-item slot="renderItem" key="item.name" slot-scope="item">
        <template slot="actions">
          <span key="user">
            <a-icon type="user" />
            <nuxt-link :to="`/keebs/maker/${item.maker_id}`">
              {{ makerName(item.maker_id) }}
            </nuxt-link>
          </span>
        </template>
        <template v-if="item.url" slot="actions">
          <span key="home">
            <a-icon type="home" />
            <a :href="item.url" target="_blank">Home</a>
          </span>
        </template>
        <template v-if="item.geekhack" slot="actions">
          <span key="global">
            <a-icon type="global" />
            <a :href="item.geekhack">geekhack</a>
          </span>
        </template>
        <img
          v-if="item.img"
          slot="extra"
          width="300"
          :alt="item.name"
          :src="item.img"
        />
        <a-empty
          v-else
          slot="extra"
          class="keyboard-no-img"
          description="No Image"
        />
        <a-list-item-meta :title="item.name" @click="showDrawer(item)">
          <a-avatar
            slot="avatar"
            :src="makers[item.maker_id] && makers[item.maker_id].img"
          />
          <a-badge
            slot="description"
            :status="badgeStatus[item.status]"
            :text="item.status"
          />
        </a-list-item-meta>
        <a-descriptions :column="1" size="small">
          <a-descriptions-item v-if="item.price" label="Price">
            ${{ item.price }}
          </a-descriptions-item>
          <a-descriptions-item v-if="item.layout" label="Layout">
            <nuxt-link :to="`/keebs/layout/${layoutSlug(item.layout)}`">
              {{ item.layout }}
            </nuxt-link>
          </a-descriptions-item>
          <a-descriptions-item v-if="item.start && item.end" label="GB Time">
            {{ item.start }} - {{ item.end }}
          </a-descriptions-item>
          <a-descriptions-item v-else-if="item.start" label="GB Date">
            {{ item.start }}
          </a-descriptions-item>
          <a-descriptions-item>
            {{ item.description }}
          </a-descriptions-item>
        </a-descriptions>
      </a-list-item>
    </a-list>

    <keyboard-details
      :visible="visible"
      :on-close="onClose"
      :keyboard="currentKeyboard"
    />
  </a-card>
</template>

<script>
import { mapState } from 'vuex'
import slugify from 'slugify'

export default {
  props: {
    loading: Boolean,
  },
  data() {
    return {
      currentKeyboard: {},
      visible: false,
      pageSize: 5,
    }
  },
  computed: {
    ...mapState('keebs', ['badgeStatus', 'keyboards', 'makers']),
    makerName() {
      return (makerId) => this.makers[makerId]?.name
    },
    layoutSlug() {
      return (layout) => slugify(layout, { lower: true })
    },
  },
  methods: {
    showDrawer(item) {
      this.visible = true
      this.currentKeyboard = item
    },
    onClose() {
      this.visible = false
      this.currentKeyboard = {}
    },
  },
}
</script>

<style lang="less">
.container {
  .ant-list-item-extra {
    display: flex;
    align-items: center;
  }
}
.keyboard-no-img {
  width: 300px;
}
</style>

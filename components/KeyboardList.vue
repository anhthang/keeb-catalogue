<template>
  <a-card>
    <a-list
      item-layout="vertical"
      :data-source="keyboards"
      :pagination="pagination"
    >
      <a-list-item slot="renderItem" key="item.Name" slot-scope="item">
        <template slot="actions">
          <span key="user">
            <a-icon type="user" style="margin-right: 8px" />
            {{ item.Maker }}
          </span>
        </template>
        <template slot="actions">
          <span key="home">
            <a-icon type="home" style="margin-right: 8px" />
            <a :href="item.Homepage" target="_blank">Home</a>
          </span>
        </template>
        <template v-if="item.geekhack" slot="actions">
          <span key="global">
            <a-icon type="global" style="margin-right: 8px" />
            <a :href="item.geekhack">geekhack</a>
          </span>
        </template>
        <img slot="extra" width="300" :alt="item.Name" :src="item.Image" />
        <a-list-item-meta :description="item.Layout" @click="showDrawer(item)">
          <a slot="title">{{ item.Name }}</a>
          <a-avatar slot="avatar">{{ item.Maker.charAt(0) }}</a-avatar>
        </a-list-item-meta>
        <a-descriptions :column="1" size="small">
          <a-descriptions-item v-if="item.Status" label="Status">
            <a-badge :status="statusMap[item.Status]" :text="item.Status" />
          </a-descriptions-item>
          <a-descriptions-item v-if="item.Start" label="GB Time">
            {{ item.Start }} - {{ item.End }}
          </a-descriptions-item>
          <a-descriptions-item>
            {{ item.Description }}
          </a-descriptions-item>
        </a-descriptions>
      </a-list-item>
    </a-list>
    <KeyboardDetails
      :visible="visible"
      :on-close="onClose"
      :keyboard="currentKeyboard"
    />
  </a-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentKeyboard: {},
      visible: false,
      pagination: {
        pageSize: 5,
      },
    }
  },
  computed: {
    ...mapState(['statusMap', 'keyboards']),
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

<template>
  <div class="container">
    <div>
      <!-- <Logo /> -->
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
          <template v-if="item.Geekhack" slot="actions">
            <span key="global">
              <a-icon type="global" style="margin-right: 8px" />
              <a :href="item.Geekhack">geekhack</a>
            </span>
          </template>
          <img
            slot="extra"
            width="300"
            alt="logo"
            :src="
              item.Image ||
              'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png'
            "
          />
          <a-list-item-meta @click="showDrawer(item)">
            <a slot="title">{{ item.Name }}</a>
            <a-avatar slot="avatar">{{ item.Maker.charAt(0) }}</a-avatar>
          </a-list-item-meta>
          <a-descriptions :column="1" size="small">
            <a-descriptions-item v-if="item.Status" label="Status">
              <a-badge :status="statusMap[item.Status]" :text="item.Status" />
            </a-descriptions-item>
            <a-descriptions-item v-if="item.Release" label="GB Time">
              {{ item.Release }}
            </a-descriptions-item>
            <a-descriptions-item>
              {{ item.Description }}
            </a-descriptions-item>
          </a-descriptions>
        </a-list-item>
      </a-list>
    </div>
    <KeyboardDetails
      :visible="visible"
      :on-close="onClose"
      :keyboard="currentKeyboard"
    />
  </div>
</template>

<script>
import keyboards from '../assets/keyboards.json'

export default {
  data() {
    return {
      keyboards,
      currentKeyboard: {},
      visible: false,
      statusMap: {
        Shipped: 'success',
        Closed: 'processing',
        Running: 'default',
      },
      pagination: {
        pageSize: 5,
      },
    }
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

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;

  /* text-align: center;
  justify-content: center;
  align-items: center; */
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>

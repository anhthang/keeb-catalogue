<template>
  <a-layout>
    <a-layout-header :class="isMobile ? 'mobile' : ''">
      <a-button
        v-if="isMobile"
        type="link"
        ghost
        :icon="collapsed ? 'menu-unfold' : 'menu-fold'"
        class="sidebar-toggle"
        @click="sidebarToogle"
      />

      <nuxt-link to="/">
        <div class="logo">Keeb Catalogue</div>
      </nuxt-link>

      <menu-tree v-if="!isMobile" mode="horizontal" />

      <right-header />
    </a-layout-header>

    <a-layout>
      <a-layout-sider
        v-if="isMobile"
        :collapsed="collapsed"
        collapsed-width="0"
      >
        <menu-tree mode="inline" />
      </a-layout-sider>

      <a-layout-content>
        <Nuxt />
      </a-layout-content>
    </a-layout>

    <a-layout-footer style="text-align: center">
      Keeb Catalogue ©2021 Created by Anh Thang Bui
    </a-layout-footer>
  </a-layout>
</template>

<script>
import MenuTree from '~/components/layouts/MenuTree.vue'
import RightHeader from '~/components/layouts/RightHeader.vue'

export default {
  components: { MenuTree, RightHeader },
  data() {
    return {
      isMobile: this.$device.isMobile,
      collapsed: true,
    }
  },
  methods: {
    sidebarToogle() {
      this.collapsed = !this.collapsed
    },
  },
}
</script>

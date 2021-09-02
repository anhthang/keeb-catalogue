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
        <menu-tree mode="inline" @click="sidebarToogle" />
      </a-layout-sider>

      <a-layout-content>
        <Nuxt />
      </a-layout-content>
    </a-layout>

    <a-layout-footer>
      <layout-footer />
    </a-layout-footer>
  </a-layout>
</template>

<script>
import LayoutFooter from '~/components/layouts/Footer.vue'
import MenuTree from '~/components/layouts/MenuTree.vue'
import RightHeader from '~/components/layouts/RightHeader.vue'

export default {
  components: { MenuTree, RightHeader, LayoutFooter },
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

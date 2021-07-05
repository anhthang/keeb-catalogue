<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header>
      <nuxt-link to="/">
        <div class="logo">Keeb Catalogue</div>
      </nuxt-link>
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['1']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          <nuxt-link to="/"><a-icon type="calendar" />Calendar </nuxt-link>
        </a-menu-item>

        <a-sub-menu key="2">
          <span slot="title">
            <a-icon :component="KeyboardSvg" class="custom-icon" /> Keebs
          </span>
          <a-menu-item key="3">
            <nuxt-link to="/keebs/keyboards?status=live">
              <a-icon type="forward" />Live GBs
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="4">
            <nuxt-link to="/keebs/keyboards?status=ic">
              <a-icon type="question-circle" />Interest Check
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="5">
            <nuxt-link to="/keebs/keyboards?status=closed">
              <a-icon type="backward" />Previous GBs
            </nuxt-link>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="2.1">
            <nuxt-link to="/keebs">
              <a-icon type="user-add" />Makers
            </nuxt-link>
          </a-menu-item>
        </a-sub-menu>

        <a-sub-menu key="6">
          <span slot="title"><a-icon type="user" /> Artisans </span>
          <a-menu-item key="7">
            <nuxt-link to="/artisans">
              <a-icon type="user-add" />Makers
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="8">
            <nuxt-link to="/artisans/collection">
              <a-icon type="book" />Collection
            </nuxt-link>
          </a-menu-item>
          <a-menu-item key="9">
            <nuxt-link to="/artisans/wishlist">
              <a-icon type="shopping-cart" />Wishlist
            </nuxt-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>

      <right-header />
    </a-layout-header>
    <a-layout-content>
      <Nuxt />
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Keeb Catalogue ©2021 Created by Anh Thang Bui
    </a-layout-footer>
  </a-layout>
</template>

<script>
import KeyboardSvg from '@/components/icons/KeyboardSvg.vue'

export default {
  data() {
    return {
      KeyboardSvg,
    }
  },
}
</script>

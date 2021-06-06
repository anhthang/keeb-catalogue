<template>
  <a-layout id="components-layout-demo-top" class="layout">
    <a-layout-header>
      <nuxt-link to="/">
        <div class="logo" />
      </nuxt-link>
      <a-menu
        theme="dark"
        mode="horizontal"
        :default-selected-keys="['1']"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1">
          <nuxt-link to="/artisans">
            <a-icon type="user-add" />Makers
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="2">
          <nuxt-link to="/artisans/collection">
            <a-icon type="book" />Collection
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="3">
          <nuxt-link to="/artisans/wishlist">
            <a-icon type="shopping-cart" />Wishlist
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content>
      <Nuxt />
    </a-layout-content>
    <a-layout-footer style="text-align: center">
      Keyboard Calendar ©2021 Created by Anh Thang Bui
    </a-layout-footer>
  </a-layout>
</template>

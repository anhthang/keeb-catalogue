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
          <nuxt-link to="/calendar">
            <a-icon type="calendar" />Calendar
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="2">
          <nuxt-link to="/?status=live">
            <a-icon type="forward" />Live GBs
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="3">
          <nuxt-link to="/?status=ic">
            <a-icon type="question-circle" />Interest Check
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="4">
          <nuxt-link to="/?status=closed">
            <a-icon type="backward" />Previous GBs
          </nuxt-link>
        </a-menu-item>
        <a-menu-item key="5">
          <nuxt-link to="/artisans"><a-icon type="link" /> Artisans </nuxt-link>
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

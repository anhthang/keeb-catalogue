<template>
  <a-page-header title="Calendar" class="container">
    <a-calendar @panelChange="onPanelChange" />
  </a-page-header>
</template>

<script>
export default {
  methods: {
    onPanelChange(value, mode) {
      // console.log(value, mode)
    },
  },
}
</script>

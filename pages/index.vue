<template>
  <div class="container">
    <a-page-header title="Calendar">
      <a-calendar @panelChange="onPanelChange" />
    </a-page-header>
  </div>
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

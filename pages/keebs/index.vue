<template>
  <div class="container">
    <a-page-header>
      <SubmitNewKeyboard slot="extra" />
      <KeyboardList />
    </a-page-header>
  </div>
</template>

<script>
export default {
  asyncData({ query }) {
    return {
      ...query,
    }
  },
  watchQuery({ status }) {
    this.boardByStatus(status)
  },
  mounted() {
    this.boardByStatus(this.status)
  },
  methods: {
    boardByStatus(status) {
      this.$store.dispatch('keebs/getKeyboardsByStatus', status)
    },
  },
}
</script>

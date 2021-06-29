<template>
  <div class="container">
    <a-page-header :title="titleMap[status]">
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
  data() {
    return {
      titleMap: {
        live: 'Live GBs',
        ic: 'Interest Check',
        closed: 'Previous GBs',
      },
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

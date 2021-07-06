<template>
  <div class="container">
    <a-page-header :title="pageTitle">
      <SubmitNewKeyboard slot="extra" />
      <KeyboardList />
    </a-page-header>
  </div>
</template>

<script>
export default {
  asyncData({ query }) {
    return {
      status: query.status || 'live',
    }
  },
  data() {
    return {
      pageTitle: undefined,
      titleMap: {
        live: 'Live GBs',
        ic: 'Interest Check',
        closed: 'Previous GBs',
      },
    }
  },
  fetch() {
    this.boardByStatus(this.status)
    this.pageTitle = this.titleMap[this.status]
  },
  watchQuery({ status = 'live' }) {
    this.boardByStatus(status)
    this.pageTitle = this.titleMap[status]
  },
  methods: {
    boardByStatus(status) {
      this.$store.dispatch('keebs/getKeyboardsByStatus', status)
    },
  },
}
</script>

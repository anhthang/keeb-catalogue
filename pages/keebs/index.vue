<template>
  <div class="container">
    <a-page-header :title="pageTitle">
      <submit-new-keyboard slot="extra" />
      <keyboard-list :loading="loading" />
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
      loading: false,
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
      this.loading = true
      this.$store.dispatch('keebs/getKeyboardsByStatus', status).then(() => {
        this.loading = false
      })
    },
  },
}
</script>

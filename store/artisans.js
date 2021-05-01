import makers from '@/assets/makers.json'

export const state = () => {
  return {
    makers,
    sculpts: [],
    colorways: [],
    wishlistSettings: {
      caps_per_line: 3,
      wish: {
        title: 'Want',
      },
      trade: {
        title: 'Have',
      },
      social: {
        reddit: '',
        discord: '',
        qq: '',
      },
    },
  }
}

export const actions = {
  async fetchScults({ commit }, name) {
    await this.$axios
      .get(
        `https://keycap-archivist.com/page-data/maker/${name}/page-data.json`
      )
      .then(({ data }) => {
        commit('SCULPTS', data.result.pageContext.maker.sculpts)
      })
  },
  async fetchColorways({ commit }, sculpt) {
    await this.$axios
      .get(
        `https://keycap-archivist.com/page-data/maker/${sculpt}/page-data.json`
      )
      .then(({ data }) => {
        commit('SCULPTS', data.result.pageContext.sculpt.colorways)
      })
  },
}

export const mutations = {
  SCULPTS(state, data) {
    state.sculpts = data
  },
  COLORWAYS(state, data) {
    state.colorways = data
  },
  WISHLIST_SETTINGS(state, data) {
    state.wishlistSettings = data
  },
}

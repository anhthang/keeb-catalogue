import keyboards from '../assets/keyboards.json'

export const state = () => {
  return {
    statusMap: {
      Shipped: 'success',
      Live: 'processing',
      Closed: 'default',
    },
    keyboards,
  }
}

export const actions = {
  filterByMaker({ commit }, maker) {
    commit('FILTER_MAKER', maker)
  },
}

export const mutations = {
  FILTER_MAKER(state, maker) {
    state.keyboards = state.keyboards.filter(
      (k) => k.Maker.toLowerCase() === maker
    )
  },
}

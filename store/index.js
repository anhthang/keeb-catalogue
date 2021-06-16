import keyboards from '@/assets/keyboards.json'

export const state = () => {
  return {
    statusMap: {
      Shipped: 'success',
      Live: 'processing',
      Closed: 'default',
    },
    keyboards,
    keebs: keyboards,
    user: {
      avatar: '',
      name: '',
    },
  }
}

export const actions = {
  filterByMaker({ commit }, maker) {
    commit('FILTER_MAKER', maker)
  },
  filterByStatus({ commit }, status = 'live') {
    commit('FILTER_STATUS', status)
  },
}

export const mutations = {
  FILTER_MAKER(state, maker) {
    state.keyboards = state.keebs.filter((k) => k.Maker.toLowerCase() === maker)
  },
  FILTER_STATUS(state, status) {
    state.keyboards = state.keebs.filter(
      (k) => k.Status.toLowerCase() === status
    )
  },
  SET_USER(state, user) {
    state.user = user
  },
}

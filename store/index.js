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
    user: {},
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
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (!authUser) {
      state.user = {}
      // claims = null
      // perform logout operations
    } else {
      const { uid, email, emailVerified, displayName, photoURL } = authUser
      state.user = { uid, email, emailVerified, displayName, photoURL }
    }
  },
}

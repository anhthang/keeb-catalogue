export const state = () => {
  return {
    user: {},
  }
}

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (!authUser) {
      state.user = {}
      state.artisans.collections = []
      state.artisans.favoriteMakers = []
      // claims = null
      // perform logout operations
    } else {
      const { uid, email, emailVerified, displayName, photoURL } = authUser
      state.user = { uid, email, emailVerified, displayName, photoURL }
    }
  },
}

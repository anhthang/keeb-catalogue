export const state = () => {
  return {
    user: {},
    authenticated: false,
  }
}

export const actions = {
  onAuthStateChangedAction({ commit }, { authUser, claims }) {
    if (!authUser) {
      // claims = null
      // Perform logout operations
    } else {
      // Initialize user document
      // eslint-disable-next-line no-console
      console.log('getting user document', authUser.uid)
      this.$fire.firestore
        .collection('users')
        .doc(authUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            commit('USER_DOCUMENT', doc.data())
          } else {
            // doc.data() will be undefined in this case
          }
        })
    }
  },
}

export const mutations = {
  ON_AUTH_STATE_CHANGED_MUTATION: (state, { authUser, claims }) => {
    if (!authUser) {
      // claims = null
      // perform logout operations
      state.authenticated = false
      state.user = {}
      state.artisans.collections = []
      state.artisans.favoriteMakers = []
    } else {
      const { uid, email, emailVerified, displayName, photoURL } = authUser
      state.user = { uid, email, emailVerified, displayName, photoURL }
      state.authenticated = true
    }
  },
  USER_DOCUMENT(state, data) {
    state.user.social = data.social || {}
    state.artisans.collections = data.collections || []
    state.artisans.favoriteMakers = data.makers || []
  },
}

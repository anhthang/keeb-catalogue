import { sortBy } from 'lodash'

export const state = () => {
  return {
    user: {},
  }
}

export const actions = {
  async onAuthStateChangedAction({ commit }, { authUser, claims }) {
    if (!authUser) {
      // claims = null
      // Perform logout operations
    } else {
      // Initialize user document
      // eslint-disable-next-line no-console
      console.log('getting user document', authUser.uid)
      await this.$fire.firestore
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
      state.user = {}
      state.artisans.collections = [
        {
          name: 'Wish',
          slug: 'wish',
        },
        {
          name: 'Trade',
          slug: 'trade',
        },
      ]
      state.artisans.favoriteMakers = []
    } else {
      const { uid, email, emailVerified, displayName, photoURL } = authUser
      state.user = { uid, email, emailVerified, displayName, photoURL }
    }
  },
  USER_DOCUMENT(state, data) {
    state.user.social = data.social || {}
    state.user.isAdmin = data.isAdmin || false
    state.user.isEditor = data.isEditor || false
    state.artisans.collections = sortBy(data.collections, 'name') || []
    state.artisans.favoriteMakers = data.makers || []
  },
}

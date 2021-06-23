import * as qs from 'querystring'
import { sortBy, sample, keyBy } from 'lodash'
import slugify from 'slugify'

export const state = () => {
  return {
    makers: [],
    database: {},
    collections: [],
    favoriteMakers: [],
    addToCollectionItems: [],
    wishlistSettings: {
      caps_per_line: 4,
      want_to_trade: false,
      wish: {
        title: 'Want',
        collection: undefined,
      },
      trade: {
        title: 'Have',
        collection: undefined,
      },
      social: {
        reddit: undefined,
        discord: undefined,
        qq: undefined,
      },
    },
  }
}

export const actions = {
  async fetchMakerDatabase({ commit }, name) {
    await fetch(
      `https://raw.githubusercontent.com/keycap-archivist/database/master/db/${name}.json`
    )
      .then((res) => res.json())
      .then((data) => {
        // eslint-disable-next-line prefer-const
        let { sculpts, ...rest } = data

        sculpts = sculpts.map((sculpt) => {
          const random = sample(sculpt.colorways)

          return {
            ...sculpt,
            slug: slugify(sculpt.name, { lower: true }),
            preview: random.img,
          }
        })

        const db = {
          maker: { ...rest, slug: name },
          sculpts: keyBy(sortBy(sculpts, 'name'), 'slug'),
        }

        commit('MAKER_DB', db)
      })
  },
  async fetchCaps({ commit }, id) {
    return await fetch(
      `http://localhost:4000/keycaps?${qs.stringify({ id })}`
    ).then((res) => res.json())
  },
  async updateFavoriteMakers({ commit, state, rootState }, name) {
    let favoriteMakers = [...state.favoriteMakers]
    if (!favoriteMakers.includes(name)) {
      favoriteMakers.push(name)
    } else {
      favoriteMakers = favoriteMakers.filter((i) => i !== name)
    }

    await this.$fire.firestore
      .collection('users')
      .doc(rootState.user.uid)
      .update({
        makers: favoriteMakers,
      })
      .then(() => {
        commit('FAVORITE_MAKERS', favoriteMakers)
      })
  },
  getArtisanMakers({ commit }) {
    // eslint-disable-next-line no-console
    console.log('getting artisan makers')
    this.$fire.firestore
      .collection('artisan-makers')
      .get()
      .then((snapshots) => {
        const makers = []
        snapshots.forEach((doc) => {
          makers.push(doc.data())
        })

        commit('ARTISAN_MAKERS', makers)
      })
  },
  addCollection({ commit, state }, data) {
    const collections = [...state.collections]
    collections.push(data)

    commit('USER_COLLECTIONS', collections)
  },
  delCollection({ commit, state }, slug) {
    const collections = state.collections.filter((c) => c.slug !== slug)

    commit('USER_COLLECTIONS', collections)
  },
}

export const mutations = {
  ARTISAN_MAKERS(state, makers) {
    state.makers = makers
  },
  MAKER_DB(state, data) {
    state.database[data.maker.slug] = data
  },
  WISHLIST_SETTINGS(state, data) {
    state.wishlistSettings = data
  },
  FAVORITE_MAKERS(state, data) {
    state.favoriteMakers = data
  },
  ADD_TO_COLLECTION(state, data) {
    state.addToCollectionItems = data
  },
  USER_COLLECTIONS(state, data) {
    state.collections = data
  },
}

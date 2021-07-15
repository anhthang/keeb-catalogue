# keyboard-calendar
Building a catalog for mechanical keyboard community

## TODO
- Fix dark mode

### Keyboard
- Calendar view
- Favorite/Wishlist page

### Artisan
- Show commission keycap or anything is not in keycap-archivist database

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

### Autocomplete API

Use `json-server` to bootstrap the API from `database.json` file. Document is here: https://www.npmjs.com/package/json-server

```bash
# start api at localhost:4000
$ json-server --watch database.json --port 4000
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

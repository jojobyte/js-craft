import '../components-vanilla/style.css'

import Navigo from 'navigo'

import {
  LOADED_ROUTES,
  LAST_ROUTE, // fixes navigo problem
} from '../components-vanilla/store.js'

const loadRoute = async (route, app) => {
  console.log("loadRoute", route, app);

  if (
    !LOADED_ROUTES.value?.[route]?.load
  ) {
    let r = await import(`./routes/${route}.js`)
    LOADED_ROUTES.value[route] = {
      _def: r.default,
      ...(await r.default(app) || {})
    }
  } else {
    let tmpLoad = await LOADED_ROUTES.value[route].load()
    LOADED_ROUTES.value[route] = {
      ...LOADED_ROUTES.value[route],
      unload: tmpLoad
    }
  }

  return LOADED_ROUTES.value[route]
}

const app = document.querySelector('#app')
const router = new Navigo("/");

router.hooks({
  before: async function (done, match) {
    console.log("global before hook", match);

    if (LOADED_ROUTES.value?.[match.route.name]?.load) {
      let tmpLoad = await LOADED_ROUTES.value[match.route.name].load()
      LOADED_ROUTES.value[match.route.name] = {
        ...LOADED_ROUTES.value[match.route.name],
        unload: tmpLoad
      }
    }

    done();
  },
  already(match) {
    console.log("global already hook", match);
  },
  after(match) {
    console.log("global after hook", match);
    LAST_ROUTE.value = match
  },
  leave(done, match) {
    console.log("global leaving hook", match, LAST_ROUTE.value);

    if (LOADED_ROUTES.value?.[LAST_ROUTE.value.route.name]?.unload) {
      LOADED_ROUTES.value[LAST_ROUTE.value.route.name].unload()
    }

    done();
  },
})

router
  .on("/about", () => loadRoute('about', app))
  .on("/convert", () => loadRoute('convert', app))
  .on({"*": { as: 'home', uses: () => loadRoute('home', app)}})
  .resolve();
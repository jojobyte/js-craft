import '../components-vanilla/style.css'

import Navigo from 'navigo'

const loadRoute = async (route, app) => import(`./routes/${route}.js`)
  .then(r => {
    r.default(app)
  })
  .catch(err => console.warn('route not found', err))

const app = document.querySelector('#app')
const router = new Navigo("/");

router
  .on("/about", () => loadRoute('about', app))
  .on("/convert", () => loadRoute('convert', app))
  .on("*", () => loadRoute('home', app))
  .resolve();
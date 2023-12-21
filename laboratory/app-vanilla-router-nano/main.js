import { createRouter } from '@nanostores/router'

import renderHome from './routes/home.js'
import renderAbout from './routes/home.js'
import renderConvert from './routes/home.js'

const app = document.querySelector('#app')

const $router = createRouter({
  home: '/',
  about: '/about',
  convert: '/convert/:fiat'
})

const Layout = () => {
  const page = $router

  if (!page) {
    return renderHome(app)
  } else if (page.route === 'home') {
    return renderHome(app)
  } else if (page.route === 'convert') {
    return renderConvert(app, page.params)
  } else if (page.route === 'about') {
    return renderAbout(app, page.params)
  }
}
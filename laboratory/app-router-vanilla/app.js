import Way from './node_modules/theway/index.js'
import {
  loadRoute,
} from './node_modules/theway/utils.js'

import { routePath } from '../components-vanilla/utils.js'

const router = new Way('/');

export const createApp = (entrypoint, routeBase) => router
  .use("/", loadRoute(routePath('home', routeBase), entrypoint))
  .use("/about", async ({params}, res, next) => {
    console.log('router use /about add name', params)

    res.example ??= {}
    res.example.name = 'jojo'

    next()
  })
  .use(
    "/about",
    loadRoute(routePath('about', routeBase), entrypoint),
  )
  .use(
    "/thing/*?",
    loadRoute(routePath('about', routeBase), entrypoint),
  )
  .use(
    "/convert/:crypto?/:fiat?",
    loadRoute(routePath('convert', routeBase), entrypoint),
  )

export default createApp
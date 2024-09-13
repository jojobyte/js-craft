import http from 'node:http'
import { readFileSync } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import { join, extname } from 'node:path'

import createApp from './app.js'

import {
  entrypoint,
  extToMime,
  serveStaticFiles,
} from './node_modules/theway/server.js'

const routeBase = import.meta?.dirname + '/routes/'
const entryPage = readFileSync('./index.html', 'utf8');
const fakeDOM = entrypoint(`<main id="app"></main>`, entryPage)

const httpServer = http.createServer();

const app = createApp(
  fakeDOM,
  routeBase,
)

app
  .get("/api/crypto", async ({params}, res, next) => {
    let ratesData
    let ratesFilename = './data/rates.json'

    try {
      ratesData = await readFile(ratesFilename, { encoding: 'utf8' })

      if (ratesData) {
        console.log('router get cached /api/crypto', params)

        return res.send(ratesData, 200, {
          'Content-Type': extToMime(extname(ratesFilename).substring(1))
        })
      }
    } catch (err) {
      console.error('failed to load cached rates.json')
    }

    let req = await fetch(
      `https://rates2.dashretail.org/rates`
    )
    let rates = await req.text()

    try {
      await writeFile('./data/rates.json', rates);
    } catch (err) {
      console.error('failed to write rates.json', err)
    }

    if (rates) {
      console.log('router get /api/crypto', params, rates)

      return res.json(rates)
    }

    next('failed to retrieve rates data')
  })
  .use(serveStaticFiles(join(import.meta.dirname, '../'), {
    readFile,
    join,
    extname,
  }))

httpServer.on('request', app.listen);

httpServer.listen(4178, () => {
  console.log('Listening on http://127.0.0.1:4178');
});
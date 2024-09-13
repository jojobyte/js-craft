import { lit as html, isBrowser } from '../../components-vanilla/utils.js'
import {
  setupFiatConvert,
  setupDashConvert,
  updateRates,
} from '../../components-vanilla/fiat.js'

async function createRoute(app, req, res, next) {
  console.log("createRoute convert", [!!app, req.url, res?.finished]);
  let {
    DASH_FIAT_RATE,
  } = await import('../../components-vanilla/store.js')

  function render() {
    app.innerHTML = html`
      <form method="GET" name="convert" novalidate>
        <fieldset class="card">
          <input pattern="^\d*(\.\d{0,2})?$" name="dash" placeholder="DASH" />
          <strong>=</strong>
          <input type="number" step=".01" name="fiat" placeholder="USD" />
          <button type="submit" name="update">🗘</button>
        </fieldset>
        <h3>DASH 1 = $${DASH_FIAT_RATE?.value?.price || 0} USD</h3>
      </form>
    `
  }

  async function loadBrowser(req, res, next) {
    let drel = app.querySelector('h3')

    DASH_FIAT_RATE.on(r => {
      drel.innerHTML = `DASH 1 = $${r?.price || 0} USD`
    })

    let unsubscribeFiat = await setupFiatConvert(
      app.querySelector('input[name=fiat]')
    )
    let unsubscribeDash = await setupDashConvert(
      app.querySelector('input[name=dash]')
    )
    let unsubscribeRates = await updateRates(
      app.querySelector('form[name=convert]')
    )

    return function unload() {
      unsubscribeFiat?.[1]?.()
      unsubscribeDash?.[1]?.()
      unsubscribeRates?.[1]?.()
    }
  }

  async function loadServer(req, res, next) {
    let { entryPage } = app
    let op = entryPage.replace(
      `<main id="app"></main>`,
      app.innerHTML,
    )

    console.log('createRoute convert loadServer', app.innerHTML?.length, op?.length)

    res.send?.(op);
  }

  async function load(req, res, next) {
    console.log("createRoute convert load", [!!app, req.url, res?.finished]);
    let unloadServer, unloadBrowser

    render()

    if (isBrowser()) {
      unloadBrowser = await loadBrowser(req, res, next)
    } else {
      unloadServer = await loadServer(req, res, next)
    }

    return function unload() {
      unloadBrowser?.()
      unloadServer?.()
    }
  }

  return {
    load,
    unload: await load(req, res, next)
  }
}

export default createRoute

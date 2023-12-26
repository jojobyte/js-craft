import { lit as html } from '../../components-vanilla/utils.js'
import {
  setupFiatConvert,
  setupDashConvert,
} from '../../components-vanilla/fiat.js'

async function createApp(app) {
  let {
    DASH_FIAT_RATE,
  } = await import('../../components-vanilla/store.js')

  async function load() {
    app.innerHTML = html`
      <form method="get" name="convert">
        <fieldset class="card">
          <input pattern="^\d*(\.\d{0,2})?$" name="dash" placeholder="DASH" />
          <strong>=</strong>
          <input type="number" step=".01" name="fiat" placeholder="USD" />
        </fieldset>
        <h3>DASH 1 = $${DASH_FIAT_RATE?.value?.price} USD</h3>
        <!-- <div class="card">
          <button id="fetch-rates" type="button">Fetch Updated Rates</button>
        </div> -->
      </form>
    `

    let drel = app.querySelector('h3')

    DASH_FIAT_RATE.on(r => {
      drel.innerHTML = `DASH 1 = $${r.price} USD`
    })

    let unsubscribeFiat = await setupFiatConvert(app.querySelector('input[name=fiat]'))
    let unsubscribeDash = await setupDashConvert(app.querySelector('input[name=dash]'))

    return function unload() {
      unsubscribeFiat?.[1]?.()
      unsubscribeDash?.[1]?.()
    }
  }

  return {
    load,
    unload: await load()
  }
}

export default createApp

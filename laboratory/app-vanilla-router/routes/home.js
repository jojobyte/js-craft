import { lit as html } from '../../components-vanilla/utils.js'
import { setupCounter } from '../../components-vanilla/counter.js'
import { setupBar } from '../../components-vanilla/bar.js'
import { setupLazy } from '../../components-vanilla/lazy.js'

function createApp(app) {
  app.innerHTML = html`
    <div>
      <div class="card">
        <div id="lbar"></div>
        <div id="bar"></div>
      </div>
      <div class="card">
        <button id="counter" type="button"></button>
      </div>
      <div class="card">
        <button id="lazy" type="button">Load Async</button>
      </div>
    </div>
  `

  let lazy
  let lazyEl = app.querySelector('#lazy')

  document.addEventListener('click', async e => {
    if (e.target?.id === 'lazy') {
      console.log('lazy', lazy)
      if (lazy?.[1]) {
        lazy[1]?.()
        lazy = undefined
        lazyEl.innerHTML = `Load Async`
      } else {
        lazy = await setupLazy(app.querySelector('#lbar'))
        lazyEl.innerHTML = `Unload Async`
      }
    }
  })

  setupCounter(app.querySelector('#counter'))
  setupBar(app.querySelector('#bar'))
}

export default createApp

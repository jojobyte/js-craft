import { lit as html } from '../../components-vanilla/utils.js'

function createApp(app) {
  app.innerHTML = html`
    <h1>About</h1>
  `
}

export default createApp

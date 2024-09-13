import { lit as html } from '../../components-vanilla/utils.js'

function createRoute(app, params) {
  console.log("createRoute convert", app, params);

  app.innerHTML = html`
    <h1>About</h1>
  `
}

export default createRoute

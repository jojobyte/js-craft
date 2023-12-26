import { DASH_FIAT_RATE, DASH_VAL, FIAT_VAL } from './store.js'

export async function getRates() {
  let { summon } = await import('./utils.js')
  return await summon(
    `https://rates2.dashretail.org/rates`
  ) || []
}

export function findRate(rates) {
  return rates.find(
    ({ symbol, source }) =>
      source === 'dashretail-average' && symbol === 'DASHUSD'
  )
}

let data = getRates()
data.then(rates => {
  let r = findRate(rates)
  DASH_FIAT_RATE.value = r
})

export async function setupFiatConvert(element) {
  const setValue = (val, event) => {
    // if (element === event.target)
    val = val >= 0 ? val : 0
    FIAT_VAL.value = val
    DASH_VAL.value = val / DASH_FIAT_RATE.value.price
  }
  const render = (v, p) => {
    element.value = v
  }
  const listener = (event) => setValue(event.target.value, event)
  const unsubFiatVal = FIAT_VAL.on(render)
  const unsubDashFiatRate = DASH_FIAT_RATE.on((v,p) => render(v.price, p.price))
  const unsub = () => {
    unsubFiatVal()
    unsubDashFiatRate()
    element.removeEventListener('input', listener)
  }

  element.addEventListener('input', listener)

  if (
    DASH_FIAT_RATE.value.price !== 0 &&
    FIAT_VAL.value === 1
  ) {
    FIAT_VAL.value = FIAT_VAL.value * DASH_FIAT_RATE.value.price
  }
  render(FIAT_VAL.value)

  return [FIAT_VAL, unsub]
}

export async function setupDashConvert(element) {
  const setValue = (val, event) => {
    // if (element === event.target)

    val = val >= 0 ? val : 0
    DASH_VAL.value = val
    FIAT_VAL.value = val * DASH_FIAT_RATE.value.price
  }
  const render = (v, p) => {
    // let n = Number(v)

    element.value = v
  }
  const listener = (event) => setValue(event.target.value, event)
  const unsubDashVal = DASH_VAL.on(render)
  const unsub = () => {
    unsubDashVal()
    element.removeEventListener('input', listener)
  }

  element.addEventListener('input', listener)

  render(DASH_VAL.value)

  return [DASH_VAL, unsub]
}

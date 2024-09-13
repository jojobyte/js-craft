import { DASH_FIAT_RATE, DASH_VAL, FIAT_VAL } from './store.js'
import { createSignal, isBrowser } from './utils.js'

export let FIAT_RATES_STATUS = createSignal(false)

export async function getRates() {
  let { summon } = await import('./utils.js')
  console.log('getting updated rates')
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

export function fetchRates() {
  FIAT_RATES_STATUS.value = true
  let data = getRates()
  data.then(rates => {
    let r = findRate(rates)
    if (isBrowser()) {
      console.log('updated rates', rates, r)
    }
    DASH_FIAT_RATE.value = r
    FIAT_RATES_STATUS.value = false
  })
}

fetchRates()

export async function updateRates(
  /** @type {Element} */
  element
) {
  const render = (v, p) => {
    // element.value = v
    if (v) {
      element.classList?.add?.('fetching')
    } else {
      element.classList?.remove?.('fetching')
    }
  }
  const listener = (
    /** @type {SubmitEvent} */
    event
  ) => {
    event.preventDefault()
    event.stopPropagation()
    fetchRates()
  }
  const unsubFiatRatesStatus = FIAT_RATES_STATUS.on(render)
  const unsub = () => {
    unsubFiatRatesStatus()
    element.removeEventListener('submit', listener)
  }

  element.addEventListener('submit', listener)

  render(FIAT_RATES_STATUS.value)

  return [FIAT_RATES_STATUS, unsub]
}

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

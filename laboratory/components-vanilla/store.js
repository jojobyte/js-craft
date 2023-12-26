import { createSignal, useSignal } from './utils.js'

export let COUNT = createSignal(0)
// export let USE_COUNT = useSignal(0)

export let DASH_FIAT_RATE = createSignal({ price: 0 })
export let DASH_VAL = createSignal(1)
export let FIAT_VAL = createSignal(1)

export let LOADED_ROUTES = createSignal({})
export let LAST_ROUTE = createSignal({})
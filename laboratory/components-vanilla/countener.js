import { COUNTEN } from './store.js'

export function setupCountener(element) {
  let setCountener, listener, unsubCounten, unsub, sub

  setCountener = (count) => COUNTEN.value = count
  listener = () => setCountener(
    COUNTEN.value + (Math.floor(Math.random() * 9)+1)
  )
  sub = () => {
    unsubCounten = COUNTEN.on((v, p) => {
      console.log('COUNTENER', v, p)
      element.innerHTML = `counten is ${v}`
    })
    unsub = () => {
      unsubCounten()
      element.removeEventListener('click', listener)
    }

    element.addEventListener('click', listener)

    setCountener(COUNTEN.value)
  }

  sub()

  setCountener(COUNTEN.value)

  // element.innerHTML = `counten is ${COUNTEN.value}`

  return [COUNTEN, unsub, sub]
}

export function setupLine(element, COUNT) {
  // let { COUNT } = await import('./state.js')

  const setCounter = (count) => {
    count = count > -1 ? count : 0
    COUNT.value = count
  }
  const render = (v, p) => {
    let n = Number(v) * 1.5
    element.style = `width: ${n}px;`
    console.log('LINE', v, p, n)
  }
  const listener = () => setCounter(COUNT.value - 10)
  let unsubCount = COUNT.on(render)
  const unsub = () => {
    unsubCount()
    element.removeEventListener('click', listener)
  }

  element.addEventListener('click', listener)

  render(COUNT.value)

  return [COUNT.value, unsub]
}

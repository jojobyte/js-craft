/**
 * Code Highlighting for String Literals
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#raw_strings MDN Reference}
 *
 * @example
 *    import { lit as html, lit as css } from './utils.js'
 *    let h = html`<div><span>${example}</span></div>`
 *    let c = css`div > span { color: #bad; }`
 *
 * @param {TemplateStringsArray} s
 * @param  {...any} v
 *
 * @returns {string}
 */
export const lit = (s, ...v) => String.raw({ raw: s }, ...v)

/**
 * Creates a reactive signal
 *
 * Inspired By
 * {@link https://gist.github.com/developit/a0430c500f5559b715c2dddf9c40948d Valoo} &
 * {@link https://dev.to/ratiu5/implementing-signals-from-scratch-3e4c Signals from Scratch}
 *
 * @example
 *    let count = createSignal(0)
 *    console.log(count.value) // 0
 *    count.value = 2
 *    console.log(count.value) // 2
 *
 *    count.on((value) => {
 *      document.querySelector("body").innerHTML = value;
 *    });
 *
 * @param {Object} initialValue inital value
*/
export function createSignal(initialValue) {
  let _value = initialValue;
  let _last = _value;
  let subs = [];

  function pub() {
    for (let s of subs) {
      s && s(_value, _last);
    }
  }

  return {
    get value() { return _value; },
    set value(v) {
      _last = _value
      _value = v;
      pub();
    },
    on: s => {
      const i = subs.push(s)-1;
      return () => { subs[i] = 0; };
    }
  }
}

/**
 * Use a reactive signal in hook fashion
 *
 * @example
 *    let [count, setCount, on] = useSignal(0)
 *    console.log(count) // 0
 *    setCount(2)
 *    console.log(count) // 2
 *
 *    let off = on(value => {
 *      document.querySelector("body").innerHTML = value;
 *    });
 *
 *    off()
 *
 * @param {Object} initialValue inital value
*/
export function useSignal(initialValue) {
  let _value = initialValue;
  let _last = _value;
  let subs = [];

  function pub() {
    for (let s of subs) {
      s && s(_value, _last);
    }
  }

  function setValue(v) {
    _last = _value
    _value = v;
    pub();
  }

  return [
    _value,
    setValue,
    s => {
      const i = subs.push(s)-1;
      return () => { subs[i] = 0; };
    }
  ]
}


export async function summon(url) {
  let data
  let req = await fetch(url)
  if (req.ok) {
    data = await req.text()

    try {
      data = JSON.parse(data)
    } catch (err) {
      console.warn('JSON.parse error', err)
    }
  }
  return data
}

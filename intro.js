// First-visit intro (~2–2.5 s). Plays once per browser (localStorage), never with
// prefers-reduced-motion, and any click, key, scroll or touch skips it.
const SEEN_KEY = 'portfolio-intro-seen'

export function initIntro() {
    const root = document.getElementById('intro')
    if (!root) return

    const html = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const params = new URLSearchParams(location.search)
    const force = params.get('intro') === 'again'
    let seen = false
    try { seen = localStorage.getItem(SEEN_KEY) === '1' } catch (err) {}
    const deepLink = (location.hash && location.hash.length > 1) || params.get('sent') === 'true'
    const play = !reduced && (force || (!seen && !deepLink))

    if (!play) {
        root.remove()
        html.classList.remove('is-intro')
        if (!reduced) html.classList.add('is-quiet')
        return
    }

    try { localStorage.setItem(SEEN_KEY, '1') } catch (err) {}

    html.classList.remove('is-quiet')
    html.classList.add('is-intro')

    const count = root.querySelector('[data-count]')
    const clock = root.querySelector('[data-clock]')
    const veil = [document.querySelector('header'), document.querySelector('main'), document.querySelector('footer')]
    veil.forEach((el) => el && el.setAttribute('aria-hidden', 'true'))

    const skipBtn = root.querySelector('.intro-skip')
    if (skipBtn) {
        skipBtn.setAttribute('aria-label', html.lang === 'en' ? 'Skip introduction' : 'Saltar introducción')
    }

    let timers = []
    let raf = 0
    let closed = false
    const later = (fn, ms) => {
        timers.push(setTimeout(fn, ms))
    }

    const skip = () => finish(true)
    const skipEvents = [
        [document, 'keydown'],
        [window, 'wheel'],
        [window, 'touchmove'],
        [root, 'click'],
    ]
    skipEvents.forEach(([target, type]) => target.addEventListener(type, skip, { passive: true }))

    const punch = (n) => {
        const glyph = count.querySelector('.glyph-lens')
        if (glyph) glyph.textContent = String(n)
        else count.textContent = String(n)
        count.classList.remove('is-on')
        void count.offsetWidth
        count.classList.add('is-on')
    }

    const begin = () => {
        if (closed) return
        const t0 = performance.now()
        const duration = 1000
        const tick = (now) => {
            if (closed) return
            const left = Math.max(0, duration - (now - t0))
            const secs = left / 1000
            const whole = Math.floor(secs)
            const tenth = Math.floor((secs - whole) * 10)
            clock.textContent = `T−00:0${whole}.${tenth}`
            if (left > 0) raf = requestAnimationFrame(tick)
            else clock.textContent = 'T−00:00.0'
        }
        raf = requestAnimationFrame(tick)
        later(() => punch(3), 60)
        later(() => punch(2), 380)
        later(() => punch(1), 700)
        later(() => root.classList.add('is-title'), 900)
        later(() => finish(false), 2000)
    }

    if (document.fonts && document.fonts.ready) {
        Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 300)),
        ]).then(begin)
    } else {
        begin()
    }

    function finish(fast) {
        if (closed) return
        closed = true
        timers.forEach(clearTimeout)
        timers = []
        cancelAnimationFrame(raf)
        skipEvents.forEach(([target, type]) => target.removeEventListener(type, skip))
        html.classList.add('played-intro', 'is-ready')
        const unveil = () => {
            if (!root.isConnected) return
            root.remove()
            html.classList.remove('is-intro')
            veil.forEach((el) => el && el.removeAttribute('aria-hidden'))
        }
        if (fast) {
            unveil()
            return
        }
        root.classList.add('is-exit')
        const door = root.querySelector('.door-b')
        if (door) door.addEventListener('transitionend', unveil, { once: true })
        setTimeout(unveil, 700)
    }
}

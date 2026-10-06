import { holePoint } from './sky.js'

export function initIntro() {
    const root = document.getElementById('intro')
    if (!root) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const params = new URLSearchParams(location.search)
    const force = params.get('intro') === 'again'
    let seen = false
    try { seen = sessionStorage.getItem('portfolio-intro') === '1' } catch (err) {}
    const deepLink = (location.hash && location.hash.length > 1) || params.get('sent') === 'true'
    const play = !reduced && (force || (!seen && !deepLink))

    if (!play) {
        root.remove()
        document.documentElement.classList.remove('is-intro')
        if (!reduced) document.documentElement.classList.add('is-quiet')
        return
    }

    const html = document.documentElement
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
    let lensRaf = 0
    let closed = false
    root.querySelectorAll('.intro-name .line span').forEach((span) => {
        if (span.querySelector('.glyph-lens')) return
        const inner = document.createElement('span')
        inner.className = 'glyph-lens'
        inner.textContent = span.textContent
        span.textContent = ''
        span.append(inner)
    })
    const lenses = [...root.querySelectorAll('.intro-name .glyph-lens')]
    let allowSkip = false
    const later = (fn, ms) => {
        const id = setTimeout(fn, ms)
        timers.push(id)
    }

    const onKey = (event) => {
        if (event.key === 'Escape') finish(true)
    }
    document.addEventListener('keydown', onKey)
    root.addEventListener('click', (event) => {
        const tappedSkip = event.target.closest('.intro-skip')
        if (tappedSkip || allowSkip) finish(true)
    })

    const punch = (n) => {
        const glyph = count.querySelector('.glyph-lens')
        if (glyph) glyph.textContent = String(n)
        else count.textContent = String(n)
        count.classList.remove('is-on')
        void count.offsetWidth
        count.classList.add('is-on')
    }

    const warp = () => {
        if (closed) return
        const hole = holePoint('intro')
        lenses.forEach((el) => {
            const rect = (el.parentElement || el).getBoundingClientRect()
            if (!rect.width) return
            const x = rect.left + rect.width / 2
            const y = rect.top + rect.height / 2
            const dx = x - hole.x
            const dy = y - hole.y
            const dist = Math.hypot(dx, dy) || 1
            const t = Math.max(0, 1 - dist / hole.reach)
            const eased = t * t
            if (eased < 0.002) {
                el.style.transform = ''
                el.style.filter = ''
                el.style.textShadow = ''
                return
            }
            const nx = dx / dist
            const ny = dy / dist
            if (root.classList.contains('is-locked')) return
            const pull = eased * 18
            const squeeze = 1 - eased * 0.18
            const stretch = 1 + eased * 0.4
            el.style.transform = `translate(${(-nx * pull).toFixed(1)}px, ${(-ny * pull).toFixed(1)}px) scale(${squeeze.toFixed(3)}, ${stretch.toFixed(3)}) skewX(${(nx * eased * -24).toFixed(2)}deg)`
            el.style.filter = `blur(${(eased * 1.15).toFixed(2)}px) brightness(${(1 + eased).toFixed(2)})`
            el.style.textShadow = `0 0 ${(10 + eased * 26).toFixed(0)}px rgba(176, 140, 255, ${(0.25 + eased * 0.75).toFixed(2)}), 0 0 ${(8 + eased * 16).toFixed(0)}px rgba(255, 176, 110, ${eased.toFixed(2)})`
        })
        if (!root.classList.contains('is-locked')) lensRaf = requestAnimationFrame(warp)
    }

    const begin = () => {
        if (closed) return
        const t0 = performance.now()
        const duration = 2500
        later(() => { allowSkip = true }, 650)
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
        lensRaf = requestAnimationFrame(warp)
        later(() => punch(3), 280)
        later(() => punch(2), 1020)
        later(() => punch(1), 1760)
        later(() => root.classList.add('is-title'), 2420)
        later(() => {
            root.classList.add('is-locked')
            lenses.forEach((el) => {
                el.style.transform = ''
                el.style.filter = ''
                el.style.textShadow = ''
            })
        }, 5900)
        later(() => finish(false), 7200)
    }

    if (document.fonts && document.fonts.ready) {
        Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 700)),
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
        cancelAnimationFrame(lensRaf)
        document.removeEventListener('keydown', onKey)
        try { sessionStorage.setItem('portfolio-intro', '1') } catch (err) {}
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
        setTimeout(unveil, 1700)
    }
}

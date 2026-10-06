const SCENES = {
    intro: { x: 0.5, y: 0.48, r: 0.2 },
    hero: { x: 0.8, y: 0.34, r: 0.16 },
}

const DISK = ['#6d5bff', '#b06cff', '#ee6ca8', '#f2b15a', '#8fd4ff']

export function holePoint(kind) {
    const scene = SCENES[kind] || SCENES.hero
    const w = window.innerWidth
    const h = window.innerHeight
    const narrow = w < 760
    return {
        x: w * scene.x,
        y: h * scene.y,
        reach: Math.min(w, h) * (narrow ? 0.62 : 0.46),
    }
}

export function initSky() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvases = [...document.querySelectorAll('canvas[data-sky]')]
    if (!canvases.length) return

    const skies = canvases.map((canvas) => makeSky(canvas, reduced))
    let raf = 0

    const frame = (now) => {
        raf = 0
        if (document.hidden) return
        let live = false
        skies.forEach((sky) => {
            if (!sky.alive()) return
            live = true
            sky.resize()
            if (sky.shouldDraw()) sky.draw(now)
        })
        if (live && skies.some((sky) => sky.shouldDraw() && !sky.reduced)) {
            raf = requestAnimationFrame(frame)
        }
    }

    const start = () => {
        if (!raf) raf = requestAnimationFrame(frame)
    }

    skies.forEach((sky) => {
        if (sky.kind !== 'hero' || !('IntersectionObserver' in window)) {
            sky.visible = true
            return
        }
        const watcher = new IntersectionObserver((entries) => {
            sky.visible = entries.some((entry) => entry.isIntersecting)
            start()
        }, { threshold: 0 })
        watcher.observe(sky.canvas.closest('.hero') || sky.canvas)
    })

    window.addEventListener('resize', start)
    document.addEventListener('visibilitychange', start)
    start()
}

function makeSky(canvas, reduced) {
    const ctx = canvas.getContext('2d')
    const kind = canvas.dataset.sky
    const sky = {
        canvas,
        ctx,
        kind,
        reduced,
        visible: kind !== 'hero',
        stars: [],
        w: 0,
        h: 0,
        alive() {
            return canvas.isConnected
        },
        shouldDraw() {
            if (!canvas.isConnected) return false
            const intro = document.documentElement.classList.contains('is-intro')
            if (kind === 'intro') return intro
            if (intro || !sky.visible) return false
            return true
        },
        resize() {
            const rect = canvas.getBoundingClientRect()
            const w = Math.max(1, Math.round(rect.width || window.innerWidth))
            const h = Math.max(1, Math.round(rect.height || window.innerHeight))
            if (w === sky.w && h === sky.h) return
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            canvas.width = Math.round(w * dpr)
            canvas.height = Math.round(h * dpr)
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
            sky.w = w
            sky.h = h
            sky.stars = field(w, h, kind === 'intro' ? 160 : 120)
        },
        draw(now) {
            const { w, h } = sky
            const scene = SCENES[kind]
            let cx = scene.x
            let cy = scene.y
            let scale = w < 760 ? 1.35 : 1
            if (kind === 'hero') {
                const progress = flyProgress(canvas)
                const pin = canvas.closest('.hero-pin')
                if (pin) pin.style.setProperty('--fly', progress.toFixed(3))
                scale *= 1 + progress * 0.95
                cx = scene.x + (0.5 - scene.x) * progress * 0.4
                cy = scene.y + (0.46 - scene.y) * progress * 0.5
            }
            const hx = w * cx
            const hy = h * cy
            ctx.clearRect(0, 0, w, h)
            dust(ctx, w, h)
            const pull = kind === 'intro' ? 520 : 140
            stars(ctx, sky.stars, now, reduced, hx, hy, w, h, pull)
            hole(ctx, hx, hy, Math.min(w, h) * scene.r * scale, reduced ? 0.6 : now / 1000)
        },
    }
    return sky
}

function flyProgress(canvas) {
    const hero = canvas.closest('.hero')
    if (!hero) return 0
    const extra = hero.offsetHeight - window.innerHeight
    if (extra <= 8) return 0
    const scrolled = Math.min(extra, Math.max(0, -hero.getBoundingClientRect().top))
    return scrolled / extra
}

function field(w, h, count) {
    let seed = Math.round(w * 13 + h * 7 + count)
    const rand = () => {
        seed = (seed * 16807) % 2147483647
        return (seed - 1) / 2147483646
    }
    const stars = []
    for (let i = 0; i < count; i++) {
        const roll = rand()
        stars.push({
            x: rand() * w,
            y: rand() * h,
            r: roll > 0.96 ? 1.8 : roll > 0.75 ? 1.15 : 0.55,
            a: 0.35 + rand() * 0.65,
            phase: rand() * Math.PI * 2,
            twinkle: rand() > 0.7,
            tint: rand() > 0.92 ? 'violet' : rand() > 0.84 ? 'warm' : rand() > 0.74 ? 'blue' : 'white',
        })
    }
    return stars
}

function dust(ctx, w, h) {
    ctx.save()
    ctx.translate(w * 0.58, h * 0.46)
    ctx.rotate(-0.5)
    const lane = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0)
    lane.addColorStop(0, 'rgba(0, 0, 0, 0)')
    lane.addColorStop(0.35, 'rgba(90, 70, 180, 0.13)')
    lane.addColorStop(0.55, 'rgba(220, 140, 90, 0.08)')
    lane.addColorStop(0.75, 'rgba(80, 140, 200, 0.07)')
    lane.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = lane
    ctx.fillRect(-w, -h * 0.18, w * 2, h * 0.36)
    ctx.restore()
}

function stars(ctx, dots, now, reduced, hx, hy, w, h, pull) {
    dots.forEach((star) => {
        if (!reduced) {
            const dx = hx - star.x
            const dy = hy - star.y
            const dist = Math.hypot(dx, dy) || 1
            const step = Math.min(3.4, pull / dist)
            star.x += (dx / dist) * step
            star.y += (dy / dist) * step
            if (dist < 16) respawn(star, w, h)
        }
        const pulse = star.twinkle && !reduced ? 0.45 + Math.sin(now / 680 + star.phase) * 0.55 : 1
        const alpha = Math.max(0, Math.min(1, star.a * pulse))
        ctx.fillStyle = star.tint === 'warm'
            ? `rgba(255, 196, 150, ${alpha})`
            : star.tint === 'blue'
                ? `rgba(170, 198, 255, ${alpha})`
                : star.tint === 'violet'
                    ? `rgba(214, 176, 255, ${alpha})`
                    : `rgba(240, 240, 250, ${alpha})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2)
        ctx.fill()
        if (star.r > 1.5) {
            ctx.strokeStyle = ctx.fillStyle
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(star.x - star.r * 3.2, star.y)
            ctx.lineTo(star.x + star.r * 3.2, star.y)
            ctx.moveTo(star.x, star.y - star.r * 3.2)
            ctx.lineTo(star.x, star.y + star.r * 3.2)
            ctx.stroke()
        }
    })
}

function respawn(star, w, h) {
    const edge = Math.random()
    if (edge < 0.25) {
        star.x = Math.random() * w
        star.y = 2
    } else if (edge < 0.5) {
        star.x = Math.random() * w
        star.y = h - 2
    } else if (edge < 0.75) {
        star.x = 2
        star.y = Math.random() * h
    } else {
        star.x = w - 2
        star.y = Math.random() * h
    }
}

function hole(ctx, x, y, r, spin) {
    ctx.save()
    const glow = ctx.createRadialGradient(x, y, r * 0.7, x, y, r * 5.4)
    glow.addColorStop(0, 'rgba(150, 170, 255, 0.2)')
    glow.addColorStop(0.28, 'rgba(176, 110, 255, 0.12)')
    glow.addColorStop(0.55, 'rgba(255, 170, 110, 0.07)')
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(x, y, r * 5.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    disk(ctx, x, y, r, spin, false)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fillStyle = '#000'
    ctx.fill()

    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, r * 1.08, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(236, 228, 255, 0.95)'
    ctx.lineWidth = Math.max(1.4, r * 0.045)
    ctx.shadowColor = 'rgba(170, 196, 255, 0.85)'
    ctx.shadowBlur = r * 0.45
    ctx.stroke()
    ctx.restore()

    ctx.beginPath()
    ctx.arc(x, y, r * 1.28, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 186, 120, 0.45)'
    ctx.lineWidth = Math.max(1, r * 0.02)
    ctx.stroke()

    disk(ctx, x, y, r, spin, true)
}

function disk(ctx, x, y, r, spin, front) {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(-0.42)
    ctx.scale(1, 0.34)
    ctx.beginPath()
    ctx.rect(-r * 5, front ? 0 : -r * 5, r * 10, r * 5)
    ctx.clip()
    for (let i = 0; i < 16; i++) {
        ctx.beginPath()
        ctx.strokeStyle = DISK[i % DISK.length]
        ctx.globalAlpha = front ? 0.62 : 0.24
        ctx.lineWidth = r * (0.2 - (i % 4) * 0.03)
        const radius = r * (1.42 + (i % 6) * 0.18)
        const a = spin * 0.55 + i * 0.62
        ctx.arc(0, 0, radius, a, a + 1.25)
        ctx.stroke()
    }
    ctx.restore()
}

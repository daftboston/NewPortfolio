import { initTheme } from './darkmode.js'
import { initLanguage } from './language.js'
import { initIntro } from './intro.js'
import { initSky } from './sky.js'

initIntro()
initSky()
initTheme()
initLanguage()
initMenu()
initSectionSpy()
initMotion()

function initMenu() {
    const button = document.querySelector('.menu-btn')
    const list = document.querySelector('.nav-links')
    if (!button || !list) return

    const close = () => {
        list.classList.remove('is-open')
        button.setAttribute('aria-expanded', 'false')
    }

    button.addEventListener('click', () => {
        const open = !list.classList.contains('is-open')
        list.classList.toggle('is-open', open)
        button.setAttribute('aria-expanded', String(open))
    })

    list.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', close)
    })

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') close()
    })
}

function initSectionSpy() {
    const sections = document.querySelectorAll('.seccion')
    const links = document.querySelectorAll('.nav-links a')
    if (!sections.length || !links.length || !('IntersectionObserver' in window)) return

    const visible = new Set()
    const mark = () => {
        const current = [...sections].filter((section) => visible.has(section)).pop()
        links.forEach((link) => {
            const on = current && link.getAttribute('href') === '#' + current.id
            link.classList.toggle('link--active', on)
            if (on) link.setAttribute('aria-current', 'true')
            else link.removeAttribute('aria-current')
        })
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) visible.add(entry.target)
                else visible.delete(entry.target)
            })
            mark()
        },
        { rootMargin: '-72px 0px -70% 0px', threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
}

function initMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    document.documentElement.classList.add('js')
    const nodes = document.querySelectorAll(
        '.statement .lockup, .statement-body, .section-label, .xp-item, .mission, .contact > .rule, .contact > .eyebrow, .contact > h2, .contact > h3, .contact > .section-lead, .contact form'
    )
    if (!nodes.length) return
    nodes.forEach((node) => node.classList.add('reveal'))
    if (!('IntersectionObserver' in window)) {
        nodes.forEach((node) => node.classList.add('in'))
        return
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            entry.target.classList.add('in')
            observer.unobserve(entry.target)
        })
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' })
    nodes.forEach((node) => observer.observe(node))
}

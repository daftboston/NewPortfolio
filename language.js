import { syncThemeButton } from './darkmode.js'

const titles = {
    es: 'Daniel Santoyo — Desarrollador Full-Stack y Arquitecto',
    en: 'Daniel Santoyo — Full-Stack Developer & Architect',
}

export function initLanguage() {
    const button = document.querySelector('#lang')
    if (!button) return

    const nav = document.querySelector('.site-nav nav')

    const apply = (lang, persist) => {
        document.documentElement.lang = lang
        document.title = titles[lang]
        button.setAttribute('aria-label', lang === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish')
        if (nav) {
            nav.setAttribute('aria-label', nav.getAttribute(lang === 'en' ? 'data-label-en' : 'data-label-es'))
        }
        document.querySelectorAll('img[data-alt-en]').forEach((img) => {
            const alt = img.getAttribute(lang === 'en' ? 'data-alt-en' : 'data-alt-es')
            if (alt) img.setAttribute('alt', alt)
        })
        syncThemeButton()
        if (!persist) return
        try {
            localStorage.setItem('portfolio-lang', lang)
            if (lang === 'en') localStorage.setItem('LANGUAGE', 'true')
            else localStorage.removeItem('LANGUAGE')
        } catch (err) {}
    }

    apply(document.documentElement.lang === 'en' ? 'en' : 'es', false)

    button.addEventListener('click', () => {
        apply(document.documentElement.lang === 'en' ? 'es' : 'en', true)
    })
}

export function syncThemeButton() {
    const button = document.querySelector('#theme')
    if (!button) return
    const dark = document.documentElement.classList.contains('dark')
    const en = document.documentElement.lang === 'en'
    button.setAttribute('aria-pressed', String(dark))
    button.setAttribute(
        'aria-label',
        dark
            ? en
                ? 'Switch to light theme'
                : 'Activar tema claro'
            : en
              ? 'Switch to dark theme'
              : 'Activar tema oscuro'
    )
}

export function initTheme() {
    const button = document.querySelector('#theme')
    if (!button) return

    syncThemeButton()

    button.addEventListener('click', () => {
        const dark = !document.documentElement.classList.contains('dark')
        document.documentElement.classList.toggle('dark', dark)
        syncThemeButton()
        try {
            localStorage.setItem('THEME', dark ? 'dark' : 'light')
            if (dark) localStorage.setItem('DARKMODE', 'true')
            else localStorage.removeItem('DARKMODE')
        } catch (err) {}
    })
}

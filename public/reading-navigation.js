// Enhance rendered Markdown; articles remain readable without JavaScript.
export function initializeContents(doc = document, win = window) {
    const contents = doc.querySelector('[data-contents]')
    const article = doc.querySelector('[data-reading-content]')
    if (!contents || !article) return () => {}
    const headings = [...article.querySelectorAll('h2, h3')]
    if (!headings.length) { contents.hidden = true; return () => {} }
    const list = contents.querySelector('.contents-links')
    const toggle = contents.querySelector('button')
    const links = headings.map((heading, index) => {
        if (!heading.id) {
            let id = `section-${index + 1}`
            while (doc.getElementById(id)) id += '-section'
            heading.id = id
        }
        const link = [...list.querySelectorAll('a')].find((entry) => decodeURIComponent(entry.hash.slice(1)) === heading.id) ?? doc.createElement('a')
        link.href = `#${encodeURIComponent(heading.id)}`
        link.textContent = heading.textContent
        if (heading.tagName === 'H3') link.className = 'contents-subheading'
        if (!link.parentElement) list.append(link)
        return link
    })
    contents.hidden = false
    const collapse = () => {
        list.hidden = !list.hidden
        toggle.setAttribute('aria-expanded', String(!list.hidden))
        toggle.setAttribute('aria-label', list.hidden ? 'Expand contents' : 'Collapse contents')
        toggle.firstElementChild.textContent = list.hidden ? '[+]' : '[−]'
    }
    let frame = 0
    const update = () => {
        frame = 0
        let current = 0
        headings.forEach((heading, index) => {
            if (heading.getBoundingClientRect().top <= 128) current = index
        })
        if (doc.documentElement.scrollHeight > win.innerHeight && win.scrollY + win.innerHeight >= doc.documentElement.scrollHeight - 2) current = headings.length - 1
        links.forEach((link, index) => {
            if (index === current) link.setAttribute('aria-current', 'location')
            else link.removeAttribute('aria-current')
        })
    }
    const schedule = () => { if (!frame) frame = win.requestAnimationFrame(update) }
    toggle.addEventListener('click', collapse)
    win.addEventListener('scroll', schedule, { passive: true })
    win.addEventListener('resize', schedule)
    win.addEventListener('load', schedule)
    update()
    return () => {
        win.cancelAnimationFrame(frame)
        toggle.removeEventListener('click', collapse)
        win.removeEventListener('scroll', schedule)
        win.removeEventListener('resize', schedule)
        win.removeEventListener('load', schedule)
        list.replaceChildren()
        contents.hidden = true
    }
}

if (typeof document !== 'undefined') initializeContents()

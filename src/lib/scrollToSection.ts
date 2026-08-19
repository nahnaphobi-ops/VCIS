export function scrollToSection(hash: string, options?: { behavior?: ScrollBehavior }) {
  const id = hash.startsWith('#') ? hash.slice(1) : hash
  if (!id) return false

  const target = document.getElementById(id)
  if (!target) return false

  const bar = document.getElementById('site-nav-bar')
  const header = bar ?? document.querySelector('header')
  const offset = header instanceof HTMLElement ? header.getBoundingClientRect().height + 8 : 84
  const top = window.scrollY + target.getBoundingClientRect().top - offset

  window.scrollTo({
    top: Math.max(0, top),
    behavior: options?.behavior ?? 'smooth',
  })

  if (window.location.hash !== `#${id}`) {
    history.pushState(null, '', `#${id}`)
  }

  if (!target.hasAttribute('tabindex')) {
    target.tabIndex = -1
  }
  target.focus({ preventScroll: true })
  return true
}

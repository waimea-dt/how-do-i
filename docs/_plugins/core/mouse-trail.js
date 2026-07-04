/**
 * Mouse trails on home page
 */
;(function () {
    'use strict'

    const TRAIL_CLASS = 'mouse-trail-item'
    const ROOT_CLASS = 'mouse-trail-root'
    const ITEM_LIFETIME_MS = 1000
    const ITEM_SPREAD_MAX = 30
    const ITEM_SIZE_MIN = 2
    const ITEM_SIZE_MAX = 5
    const TRAILS_DIR = '_assets/trails/'

    let trailRoot = null
    let isListening = false
    let itemPath = null
    let trailItemsPromise = null
    let activationToken = 0

    function rand(min, max) {
        return (Math.random() * (max - min)) + min
    }

    function randInt(min, max) {
        return Math.floor(rand(min, max))
    }

    async function loadTrailItems() {
        if (!trailItemsPromise) {
            trailItemsPromise = window.fetch(TRAILS_DIR, { cache: 'no-store' })
                .then((response) => response.ok ? response.text() : '')
                .then((html) => {
                    const parser = new window.DOMParser()
                    const doc = parser.parseFromString(String(html || ''), 'text/html')
                    return Array.from(doc.querySelectorAll('a[href$=".svg"]'))
                        .map((link) => link.getAttribute('href').split('/').pop())
                        .map((filename) => new URL(`${TRAILS_DIR}${filename}`, document.baseURI).href)
                })
                .catch(() => [])
        }

        return trailItemsPromise
    }

    function isHomePath(path) {
        const cleanedPath = String(path || '/').replace(/\/+$/, '')
        return cleanedPath === '' || cleanedPath === '/'
    }

    function createTrailRoot() {
        if (trailRoot && document.body.contains(trailRoot)) return trailRoot

        const root = document.createElement('div')
        root.className = ROOT_CLASS
        document.body.appendChild(root)

        trailRoot = root
        return root
    }

    function onPointerMove(event) {
        if (!itemPath) return

        const root = createTrailRoot()
        const item = document.createElement('span')

        item.className = TRAIL_CLASS
        item.style.left = `${event.clientX + (Math.random() * 2 * ITEM_SPREAD_MAX) - ITEM_SPREAD_MAX}px`
        item.style.top  = `${event.clientY + (Math.random() * 2 * ITEM_SPREAD_MAX) - ITEM_SPREAD_MAX}px`

        item.style.setProperty('--trail-image',       `url("${itemPath}")`)
        item.style.setProperty('--trail-size',        `${rand(ITEM_SIZE_MIN, ITEM_SIZE_MAX)}rem`)
        item.style.setProperty('--trail-angle-start', `${rand(-45, 45)}deg`)
        item.style.setProperty('--trail-angle-end',   `${rand(-135, 135)}deg`)
        item.style.setProperty('--trail-lifetime',    `${ITEM_LIFETIME_MS}ms`)

        root.appendChild(item)
        window.setTimeout(function () { item.remove() }, ITEM_LIFETIME_MS)
    }

    async function activate() {
        if (isListening) return

        const token = ++activationToken
        const trailItems = await loadTrailItems()

        if (token !== activationToken || isListening) return
        if (!trailItems.length) return

        itemPath = trailItems[randInt(0, trailItems.length)]

        isListening = true
        createTrailRoot()
        window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    function deactivate() {
        activationToken += 1

        if (!isListening && !trailRoot) return

        isListening = false
        window.removeEventListener('pointermove', onPointerMove)

        if (trailRoot) {
            trailRoot.remove()
            trailRoot = null
        }
    }

    function docsifyMouseTrail(hook, vm) {
        hook.doneEach(function () {
            if (isHomePath(vm?.route?.path)) {
                void activate()
                return
            }

            deactivate()
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyMouseTrail)
})()

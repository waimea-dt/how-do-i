/**
 * Mouse trails on home page
 */
;(function () {
    'use strict'

    const TRAIL_CLASS = 'mouse-trail-item'
    const ROOT_CLASS = 'mouse-trail-root'
    const ITEM_LIFETIME_MS = 1000
    const ITEM_SPREAD_MIN = 0
    const ITEM_SPREAD_MAX = 30
    const ITEM_SIZE_MIN = 0.5
    const ITEM_SIZE_MAX = 10
    const SPEED_FOR_MAX_SIZE = 2      // pixels per sec
    const SPEED_FOR_MAX_SPREAD = 2    // pixels per sec
    const SIZE_SMOOTHING = 0.1
    const SPREAD_SMOOTHING = 0.1
    const TRAILS_DIR = '_assets/trails/'
    const TRAILS_MANIFEST = `${TRAILS_DIR}index.json`

    let trailRoot = null
    let isListening = false
    let itemPath = null
    let trailItems = []
    let trailItemsPromise = null
    let activationToken = 0
    let lastPointer = null
    let currentTrailSize = ITEM_SIZE_MIN
    let currentTrailSpread = ITEM_SPREAD_MIN

    function rand(min, max) {
        return (Math.random() * (max - min)) + min
    }

    function randInt(min, max) {
        return Math.floor(rand(min, max))
    }

    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value))
    }

    function sizeFromSpeed(speedPxPerMs) {
        const ratio = clamp(speedPxPerMs / SPEED_FOR_MAX_SIZE, 0, 1)
        return ITEM_SIZE_MIN + (ITEM_SIZE_MAX - ITEM_SIZE_MIN) * ratio
    }

    function spreadFromSpeed(speedPxPerMs) {
        const ratio = clamp(speedPxPerMs / SPEED_FOR_MAX_SPREAD, 0, 1)
        return ITEM_SPREAD_MIN + (ITEM_SPREAD_MAX - ITEM_SPREAD_MIN) * ratio
    }

    function toTrailUrl(filename) {
        return new URL(`${TRAILS_DIR}${filename}`, document.baseURI).href
    }

    function parseManifest(items) {
        return Array.isArray(items)
            ? items.filter((name) => typeof name === 'string' && name.endsWith('.svg'))
            : []
    }

    async function fetchTrailManifest() {
        const response = await window.fetch(TRAILS_MANIFEST, { cache: 'no-store' })
        if (!response.ok) return []

        const items = parseManifest(await response.json())
        return items.map(toTrailUrl)
    }

    async function loadTrailItems() {
        if (!trailItemsPromise) {
            trailItemsPromise = fetchTrailManifest()
                .catch(() => [])
        }

        return trailItemsPromise
    }

    function pickRandomTrailItem() {
        if (!trailItems.length) return null
        if (trailItems.length === 1) return trailItems[0]

        let nextItem = trailItems[randInt(0, trailItems.length)]
        while (nextItem === itemPath) {
            nextItem = trailItems[randInt(0, trailItems.length)]
        }

        return nextItem
    }

    function isEditableTarget(target) {
        if (!(target instanceof Element)) return false

        return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'))
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

        const nowMs = typeof event.timeStamp === 'number' ? event.timeStamp : performance.now()
        let speedPxPerMs = 0

        if (lastPointer) {
            const dt = nowMs - lastPointer.timeMs
            if (dt > 0) {
                const dx = event.clientX - lastPointer.x
                const dy = event.clientY - lastPointer.y
                speedPxPerMs = Math.hypot(dx, dy) / dt
            }
        }

        lastPointer = { x: event.clientX, y: event.clientY, timeMs: nowMs }

        const targetSize = sizeFromSpeed(speedPxPerMs)
        const targetSpread = spreadFromSpeed(speedPxPerMs)
        currentTrailSize += (targetSize - currentTrailSize) * SIZE_SMOOTHING
        currentTrailSpread += (targetSpread - currentTrailSpread) * SPREAD_SMOOTHING

        const root = createTrailRoot()
        const item = document.createElement('span')

        item.className = TRAIL_CLASS
        item.style.left = `${event.clientX + rand(-currentTrailSpread, currentTrailSpread)}px`
        item.style.top  = `${event.clientY + rand(-currentTrailSpread, currentTrailSpread)}px`

        item.style.setProperty('--trail-image',       `url("${itemPath}")`)
        item.style.setProperty('--trail-size',        `${currentTrailSize}rem`)
        item.style.setProperty('--trail-angle-start', `${rand(-45, 45)}deg`)
        item.style.setProperty('--trail-angle-end',   `${rand(-135, 135)}deg`)
        item.style.setProperty('--trail-lifetime',    `${ITEM_LIFETIME_MS}ms`)

        root.appendChild(item)
        window.setTimeout(function () { item.remove() }, ITEM_LIFETIME_MS)
    }

    function onKeyDown(event) {
        if (event.code !== 'Space') return
        if (!isListening || !trailItems.length) return
        if (isEditableTarget(event.target)) return

        event.preventDefault()

        const nextItem = pickRandomTrailItem()
        if (nextItem) {
            itemPath = nextItem
        }
    }

    async function activate() {
        if (isListening) return

        const token = ++activationToken
        trailItems = await loadTrailItems()

        if (token !== activationToken || isListening) return
        if (!trailItems.length) return

        itemPath = pickRandomTrailItem()

        isListening = true
        createTrailRoot()
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        window.addEventListener('keydown', onKeyDown)
    }

    function deactivate() {
        activationToken += 1
        lastPointer = null
        currentTrailSize = ITEM_SIZE_MIN
        currentTrailSpread = ITEM_SPREAD_MIN

        if (!isListening && !trailRoot) return

        isListening = false
        window.removeEventListener('pointermove', onPointerMove)
        window.removeEventListener('keydown', onKeyDown)

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

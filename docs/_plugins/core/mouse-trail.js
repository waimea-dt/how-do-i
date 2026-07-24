/**
 * Mouse trails on home page
 */
;(function () {
    'use strict'

    const TRAIL_CLASS = 'mouse-trail-item'
    const ROOT_CLASS = 'mouse-trail-root'

    const ITEM_LIFETIME_MAX_MS = 1200
    const ITEM_LIFETIME_MIN_MS = 600
    const ITEM_SPREAD_MIN = 0
    const ITEM_SPREAD_MAX = 30
    const ITEM_SIZE_MIN = 0.5
    const ITEM_SIZE_MAX = 8
    const SPEED_FOR_MAX_SIZE = 3      // pixels per ms
    const SPEED_FOR_MAX_SPREAD = 5    // pixels per ms
    const SPEED_THRESHOLD = 1         // Low threshold to drop static ticks (px/ms)
    const SPEED_SCALING = 100         // scale px/ms for CSS transform
    const SIZE_SMOOTHING = 0.1
    const SPREAD_SMOOTHING = 0.1

    const BURST_COUNT_MIN = 10
    const BURST_COUNT_MAX = 20
    const BURST_SPEED_MIN = 2
    const BURST_SPEED_MAX = 5
    const BURST_SIZE_MIN = ITEM_SIZE_MAX * 0.3
    const BURST_SIZE_MAX = ITEM_SIZE_MAX * 0.5
    const BURST_SPAWN_SPREAD = 18
    const UI_CLICK_EXCLUSION_SELECTOR = '.sidebar, .sidebar-toggle, .app-nav, nav, aside, [data-no-trail-burst]'

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

    function speedRatioFromThreshold(speedPxPerMs, maxSpeedPxPerMs) {
        const denominator = maxSpeedPxPerMs - SPEED_THRESHOLD
        if (denominator <= 0) {
            return speedPxPerMs >= SPEED_THRESHOLD ? 1 : 0
        }

        return clamp((speedPxPerMs - SPEED_THRESHOLD) / denominator, 0, 1)
    }


    function sizeFromSpeed(speedPxPerMs) {
        const ratio = speedRatioFromThreshold(speedPxPerMs, SPEED_FOR_MAX_SIZE)
        return ITEM_SIZE_MIN + (ITEM_SIZE_MAX - ITEM_SIZE_MIN) * ratio
    }

    function spreadFromSpeed(speedPxPerMs) {
        const ratio = speedRatioFromThreshold(speedPxPerMs, SPEED_FOR_MAX_SPREAD)
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

    function isUiTarget(target) {
        if (!(target instanceof Element)) return false

        return Boolean(target.closest(UI_CLICK_EXCLUSION_SELECTOR))
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

    function appendTrailItem(x, y, options) {
        if (!options.imagePath) return

        const root = createTrailRoot()
        const item = document.createElement('span')
        const lifetimeMs = options.lifetimeMs || randInt(ITEM_LIFETIME_MIN_MS, ITEM_LIFETIME_MAX_MS)

        item.className = TRAIL_CLASS
        item.style.left = `${x}px`
        item.style.top = `${y}px`

        item.style.setProperty('--trail-image', `url("${options.imagePath}")`)
        item.style.setProperty('--trail-size', `${options.sizeRem}rem`)
        item.style.setProperty('--trail-angle-start', `${options.angleStartDeg}deg`)
        item.style.setProperty('--trail-angle-end', `${options.angleEndDeg}deg`)
        item.style.setProperty('--trail-lifetime', `${lifetimeMs}ms`)
        item.style.setProperty('--trail-vx', `${options.vxPx}px`)
        item.style.setProperty('--trail-vy', `${options.vyPx}px`)

        root.appendChild(item)
        window.setTimeout(function () { item.remove() }, lifetimeMs)
    }

    function spawnClickBurst(event) {
        const burstCount = randInt(BURST_COUNT_MIN, BURST_COUNT_MAX + 1)
        let lastBurstItemPath = itemPath

        for (let i = 0; i < burstCount; i += 1) {
            const angle = rand(0, Math.PI * 2)
            const speedPxPerMs = rand(BURST_SPEED_MIN, BURST_SPEED_MAX)
            const speedPx = speedPxPerMs * SPEED_SCALING
            const spawnX = event.clientX + rand(-BURST_SPAWN_SPREAD, BURST_SPAWN_SPREAD)
            const spawnY = event.clientY + rand(-BURST_SPAWN_SPREAD, BURST_SPAWN_SPREAD)
            const burstItemPath = pickRandomTrailItem() || itemPath
            lastBurstItemPath = burstItemPath

            appendTrailItem(spawnX, spawnY, {
                imagePath: burstItemPath,
                sizeRem: rand(BURST_SIZE_MIN, BURST_SIZE_MAX),
                angleStartDeg: rand(-180, 180),
                angleEndDeg: rand(-180, 180),
                vxPx: Math.cos(angle) * speedPx,
                vyPx: Math.sin(angle) * speedPx,
                lifetimeMs: randInt(ITEM_LIFETIME_MIN_MS, ITEM_LIFETIME_MAX_MS)
            })
        }

        return lastBurstItemPath
    }

    function onPointerMove(event) {
        if (!itemPath) return

        const nowMs = typeof event.timeStamp === 'number' ? event.timeStamp : performance.now()
        let speedPxPerMs = 0
        let vx = 0
        let vy = 0

        if (lastPointer) {
            const dt = nowMs - lastPointer.timeMs

            if (dt > 0 && dt < 100) {
                const dx = event.clientX - lastPointer.x
                const dy = event.clientY - lastPointer.y
                speedPxPerMs = Math.hypot(dx, dy) / dt

                vx = (dx / dt) * SPEED_SCALING
                vy = (dy / dt) * SPEED_SCALING
            }
        }

        lastPointer = { x: event.clientX, y: event.clientY, timeMs: nowMs }

        if (speedPxPerMs < SPEED_THRESHOLD) return

        const targetSize = sizeFromSpeed(speedPxPerMs)
        const targetSpread = spreadFromSpeed(speedPxPerMs)
        currentTrailSize += (targetSize - currentTrailSize) * SIZE_SMOOTHING
        currentTrailSpread += (targetSpread - currentTrailSpread) * SPREAD_SMOOTHING

        appendTrailItem(
            event.clientX + rand(-currentTrailSpread, currentTrailSpread),
            event.clientY + rand(-currentTrailSpread, currentTrailSpread),
            {
                imagePath: itemPath,
                sizeRem: currentTrailSize,
                angleStartDeg: rand(-45, 45),
                angleEndDeg: rand(-135, 135),
                vxPx: vx,
                vyPx: vy,
                lifetimeMs: randInt(ITEM_LIFETIME_MIN_MS, ITEM_LIFETIME_MAX_MS)
            }
        )
    }

    function onClick(event) {
        if (!isListening || !itemPath) return
        if (isEditableTarget(event.target)) return
        if (isUiTarget(event.target)) return

        const nextItemPath = spawnClickBurst(event)
        if (nextItemPath) {
            itemPath = nextItemPath
        }
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
        window.addEventListener('click', onClick, { passive: true })
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
        window.removeEventListener('click', onClick)
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

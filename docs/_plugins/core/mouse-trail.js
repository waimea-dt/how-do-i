/**
 * Mouse trails on home page
 */
;(function () {
    'use strict'

    const TRAIL_CLASS = 'mouse-trail-item'
    const ROOT_CLASS = 'mouse-trail-root'
    const ITEM_LIFETIME_MS = 500
    const ITEM_SPREAD_MAX = 30
    const ITEM_SIZE_MIN = 2
    const ITEM_SIZE_MAX = 5

    const ITEMS = [
        '../../_assets/scratch/sprites/banana.svg',
        '../../_assets/scratch/sprites/fish.svg',
        '../../_assets/scratch/sprites/heart.svg',
        '../../_assets/scratch/sprites/chicken.svg',
        '../../_assets/scratch/sprites/cake.svg',
        '../../_assets/scratch/sprites/robot.svg',
        '../../_assets/scratch/sprites/bug1.svg',
        '../../_assets/mac/macintosh-face.svg',
        '../../_assets/blobs/blob.svg',
    ]

    let trailRoot = null
    let isListening = false
    let itemPath = null

    function rand(min, max) {
        return (Math.random() * (max - min)) + min
    }

    function randInt(min, max) {
        return Math.floor(rand(min, max))
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

    function activate() {
        if (isListening) return

        isListening = true
        itemPath = ITEMS[randInt(0, ITEMS.length)]
        createTrailRoot()
        window.addEventListener('pointermove', onPointerMove, { passive: true })
    }

    function deactivate() {
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
                activate()
                return
            }

            deactivate()
        })
    }

    window.DocsifyUtils.registerPlugin(docsifyMouseTrail)
})()

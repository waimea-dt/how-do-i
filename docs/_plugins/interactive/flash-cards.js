(function () {

    const ICONS = {
        FIRST:      'chevrons-left',
        PREVIOUS:   'chevron-left',
        NEXT:       'chevron-right',
        FULLSCREEN: 'expand',
    }

    const clamp = (val, min, max) => Math.min(Math.max(val, min), max)

    let cleanupWindowListeners = () => {}

    function processFlashCards() {

        cleanupWindowListeners()
        cleanupWindowListeners = () => {}

        const cleanups = []

        const triggers = document.querySelectorAll('.markdown-section flashcards')

        if (triggers.length === 0) {
            return
        }

        triggers.forEach(function (trigger, triggerIndex) {

            const cardList = trigger.querySelector('ul')

            if (!cardList) {
                return
            }

            cardList.classList.add('flash-cards')

            const cards = [...cardList.children]

            if (cards.length === 0) {
                return
            }

            const numCards = cards.length
            cardList.dataset.cardCount   = numCards
            cardList.dataset.currentCard = 1
            cardList.dataset.finalCard   = 'false'
            cardList.style.setProperty('--card-count', numCards)
            cardList.style.setProperty('--current-card', 1)

            const cardInfo = document.createElement('p')
            cardInfo.textContent = `Card 1 of ${numCards}`

            const changeCard = (offset) => {
                const currentNum = parseInt(cardList.dataset.currentCard)
                const targetNum  = clamp(currentNum + offset, 1, numCards)

                cardList.querySelector(`li[data-card-num="${currentNum}"]`)?.classList.add('hidden')
                cardList.querySelector(`li[data-card-num="${currentNum}"]`)?.classList.remove('revealed')
                cardList.querySelector(`li[data-card-num="${targetNum}"]`)?.classList.remove('hidden')

                cardList.dataset.currentCard = targetNum
                cardList.style.setProperty('--current-card', targetNum)
                cardInfo.textContent = `Card ${targetNum} of ${numCards}`
                cardList.dataset.finalCard = targetNum < numCards ? 'false' : 'true'
            }

            const revealCurrentCard = () => {
                const currentNum = parseInt(cardList.dataset.currentCard)
                cardList.querySelector(`li[data-card-num="${currentNum}"]`)?.classList.toggle('revealed')
            }

            cards.forEach(function (card, i) {

                const divider = card.querySelector('hr')

                if (!divider) {
                    return
                }

                const cardFront = document.createElement('div')
                const cardBack  = document.createElement('div')
                cardFront.classList.add('card-front')
                cardBack.classList.add('card-back')

                let targetFace = cardFront
                ;[...card.childNodes].forEach(function (node) {
                    if (node === divider) {
                        targetFace = cardBack
                    } else {
                        targetFace.append(node)
                    }
                })

                card.innerHTML = ''
                card.append(cardFront, cardBack)
                card.classList.add('flash-card')
                card.dataset.cardNum = i + 1
                if (i > 0) card.classList.add('hidden')



                card.addEventListener('click', () => card.classList.toggle('revealed'))
                card.addEventListener('mousedown', (e) => { if (e.detail > 1) e.preventDefault() })
                removeLinks(card)
                convertImagesToParaBacks(card)
            })

            addControls(cardList, cardInfo, changeCard)

            const keyHandler = (e) => {
                switch (e.code) {
                    case 'ArrowUp':
                    case 'ArrowDown':
                        revealCurrentCard()
                        e.preventDefault()
                        break
                    case 'Escape':
                        exitFullScreen(cardList)
                        changeCard(-999)
                        break
                    case 'ArrowRight': changeCard(1);  break
                    case 'ArrowLeft':  changeCard(-1); break
                }
            }

            const fullscreenHandler = () => {
                if (!document.fullscreenElement) {
                    exitFullScreen(cardList)
                    changeCard(-999)
                }
            }

            window.addEventListener('keydown', keyHandler)
            window.addEventListener('fullscreenchange', fullscreenHandler)
            cleanups.push(() => {
                window.removeEventListener('keydown', keyHandler)
                window.removeEventListener('fullscreenchange', fullscreenHandler)
            })

            // Move the cardList out of the wrapper before removing the wrapper
            trigger.parentNode.insertBefore(cardList, trigger)
            trigger.remove()
        })

        cleanupWindowListeners = () => cleanups.forEach(fn => fn())
    }


    function removeLinks(card) {
        card.querySelectorAll('a').forEach(function (link) {
            while (link.firstChild) {
                link.parentNode.insertBefore(link.firstChild, link);
            }
            link.remove();
        });
    }

    function convertImagesToParaBacks(card) {
        card.querySelectorAll('p:has(> img)').forEach(function (para) {
            const image = para.querySelector('img')
            para.style.backgroundImage = `url(${image.src})`
            para.classList.add('background-image')
            image.remove()
        })
    }

    function goFullScreen(cardList) {
        cardList.classList.add('zoomed')
        document.documentElement.style.scrollbarWidth = 'none'
        if (!document.fullscreenElement) document.documentElement.requestFullscreen()
    }

    function exitFullScreen(cardList) {
        cardList.classList.remove('zoomed')
        document.documentElement.style.scrollbarWidth = 'thin'
        if (document.fullscreenElement) document.exitFullscreen()
    }

    function addControls(cardList, cardInfo, changeCard) {
        const controlPanel = document.createElement('div')
        const controls     = document.createElement('p')
        const firstButton  = document.createElement('span')
        const prevButton   = document.createElement('span')
        const nextButton   = document.createElement('span')
        const zoomButton   = document.createElement('span')

        controlPanel.classList.add('card-control-panel')
        cardInfo.classList.add('card-info')
        controls.classList.add('card-controls')
        firstButton.classList.add('control', 'card-first')
        prevButton.classList.add('control', 'card-previous')
        nextButton.classList.add('control', 'card-next')
        zoomButton.classList.add('control', 'card-zoom')

        cardList.append(controlPanel)
        controlPanel.append(cardInfo, controls)
        controls.append(firstButton, prevButton, nextButton, zoomButton)

        firstButton.innerHTML = lucideIcon(ICONS.FIRST)
        prevButton.innerHTML  = lucideIcon(ICONS.PREVIOUS)
        nextButton.innerHTML  = lucideIcon(ICONS.NEXT)
        zoomButton.innerHTML  = lucideIcon(ICONS.FULLSCREEN)

        firstButton.addEventListener('click', () => changeCard(-999))
        prevButton.addEventListener('click',  () => changeCard(-1))
        nextButton.addEventListener('click',  () => changeCard(1))
        zoomButton.addEventListener('click',  () => {
            cardList.classList.contains('zoomed') ? exitFullScreen(cardList) : goFullScreen(cardList)
        })

        controlPanel.addEventListener('mousedown', (e) => { if (e.detail > 1) e.preventDefault() })

        if (window.lucide) {
            lucide.createIcons({
                attrs: { class: ['icon'], 'stroke-width': 2, stroke: 'currentColor' },
            })
        }
    }

    function lucideIcon(name) {
        return `<i data-lucide="${name}"></i>`
    }

    const docsifyFlashCards = function (hook) {
        hook.doneEach(processFlashCards)
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyFlashCards, window.$docsify.plugins || [])

})()
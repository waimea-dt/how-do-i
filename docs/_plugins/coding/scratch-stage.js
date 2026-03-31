/**
 * docsify-scratch-stage.js — Renders Scratch stage visualizations from markdown code blocks.
 * 
 * Usage in markdown:
 *   ```scratch-stage
 *   stage space #123
 *       sprite rocket 0 0 100 45 1.0 ""
 *       arrow 50 50 100 90 #fff 1.0
 *   endstage
 *   ```
 * 
 * Commands:
 *   stage [back-img] [back-col] - Start a stage container
 *   endstage - End the stage container
 *   sprite [image] [x] [y] [size] [angle] [opacity] [speech]
 *   spriteinfo [image] [x] [y] [size] [angle] [opacity] [speech]
 *   arrow, line, circle, square, label, number - Various markers
 *   question [text] - Question prompt at bottom
 */

;(function () {

    // -------------------------------------------------------------------------
    // Parser Functions
    // -------------------------------------------------------------------------

    const parseLine = (line) => {
        let token = { op: null, args: [] }
        // Bail out if empty line
        if (line.trim().length === 0) return token
        // Otherwise split out the command and the args
        // Regex explained here: https://regex101.com/r/8XaRVr/1
        let parts = line.trim().split(/\s+(?=(?:[^"']*["'][^"']*["'])*[^"']*$)/)
        token.op = parts.shift()
        token.args = parts
        return token
    }

    const identifyBlock = (cmd) => {
        let block = {
            type:      null,
            category:  '',
            props:     [],
            container: false,
            ending:    false
        }

        // What have we got?
        switch (cmd) {
            // Stage
            case 'stage':
                block.type      = 'stage'
                block.category  = 'container'
                block.props     = ['back-img', 'back-col']
                block.container = true
                break

            case 'endstage':
                block.type     = 'stage'
                block.ending   = true
                break

            // Sprites
            case 'sprite':
                block.type     = 'stage-item'
                block.category = 'sprite noinfo'
                block.props    = ['image', 'x', 'y', 'size', 'angle', 'opacity', 'speech']
                break

            case 'spriteinfo':
                block.type     = 'stage-item'
                block.category = 'sprite showinfo'
                block.props    = ['image', 'x', 'y', 'size', 'angle', 'opacity', 'speech']
                break

            // Stage Markers
            case 'arrow':
                block.type     = 'stage-item'
                block.category = 'arrow'
                block.props    = ['x', 'y', 'size', 'angle', 'colour', 'opacity']
                break

            case 'line':
                block.type     = 'stage-item'
                block.category = 'line'
                block.props    = ['x', 'y', 'size', 'angle', 'colour', 'opacity']
                break

            case 'circle':
                block.type     = 'stage-item'
                block.category = 'circle'
                block.props    = ['x', 'y', 'size', 'colour', 'opacity']
                break

            case 'square':
                block.type     = 'stage-item'
                block.category = 'square'
                block.props    = ['x', 'y', 'size', 'angle', 'colour', 'opacity']
                break

            case 'label':
                block.type     = 'stage-item'
                block.category = 'label'
                block.props    = ['text', 'x', 'y', 'colour', 'opacity']
                break

            case 'number':
                block.type     = 'stage-item'
                block.category = 'number'
                block.props    = ['number', 'x', 'y', 'colour', 'opacity']
                break

            // Question
            case 'question':
                block.type     = 'question'
                block.props    = ['text']
                break

            // Comments
            case '//':
                block.type     = 'comment'
                break
        }

        return block
    }

    const expandCommand = (token) => {
        // Find out what type of block we're looking at
        let block = identifyBlock(token.op)
        let code = ''

        // Invalid block
        if (block.type == null)
            return `Command unrecognised: ${token.op}`
        // Incorrect number of args
        if (block.props.length !== token.args.length)
            return `<p>ERROR: ${token.op} ${token.args.join(' ')}
                    &lt;&lt;&lt; wrong arg count (${token.args.length})<br>
                    Usage: ${token.op} ${block.props.join(' ')}</p>`

        // Start a new DIV for all non-ending blocks
        if (!block.ending) {
            code += `<div class="${block.type} ${block.category}" `
        }

        let styling = ''
        let dataAttrs = ''
        let propInfos = ''

        // Any args for this current block?
        for (let i = 0; i < block.props.length; i++) {
            let prop = block.props[i]
            let val = token.args[i]

            switch (prop) {
                case 'x':
                case 'y':
                case 'size':
                case 'angle':
                case 'opacity':
                case 'colour':
                case 'number':
                    styling += `--stage-item-${prop}:${val}; `
                    propInfos += `<div class="value ${prop}">${val}</div>`
                    break

                case 'speech':
                case 'text':
                    let cleanedVal = val.replace(/^["']|["']$/g, '')
                    if (cleanedVal !== '') {
                        styling += `--stage-item-${prop}:${cleanedVal}; `
                        propInfos += `<div class="value ${prop}">${cleanedVal}</div>`
                    }
                    break

                case 'image':
                    styling += `--stage-item-image:url('../../_assets/scratch/sprites/${val}.svg'); `
                    break

                case 'back-col':
                    styling += `--stage-colour:${val}; `
                    break
                case 'back-img':
                    styling += `--stage-image:url('../../_assets/scratch/stages/${val}.svg'); `
                    break
            }
        }

        // Complete the start div
        if (!block.ending) code += `style="${styling}" ${dataAttrs}> ${propInfos}`
        // Wrap up all blocks, except if we're just opening a container
        if (!block.container) code += '</div>'

        return code
    }

    const highlightLine = (line) => {
        // Tokenise the line of code
        const token = parseLine(line)
        const code = (token.op) ? expandCommand(token) : ''
        return code
    }

    const highlightElement = (element) => {
        const code = element.textContent
        if (!code) return

        const lines = code.trim().split('\n')

        let highlightedCode = ''
        lines.forEach(line => {
            highlightedCode += highlightLine(line) + '\n'
        })

        element.innerHTML = highlightedCode
    }

    // -------------------------------------------------------------------------
    // Main Processing Function
    // -------------------------------------------------------------------------

    function processScratchStage() {
        const stageBlocks = document.querySelectorAll('pre[data-lang="scratch-stage"]')

        stageBlocks.forEach(block => {
            // Skip if already processed
            if (block.classList.contains('scratch-stage-processed')) {
                return
            }

            const codeBlock = block.querySelector('code')
            if (!codeBlock) return

            highlightElement(codeBlock)

            block.classList.add('scratch-stage-processed')
        })
    }

    // -------------------------------------------------------------------------
    // Plugin Registration
    // -------------------------------------------------------------------------

    const docsifyScratchStage = function (hook) {
        hook.doneEach(function () {
            processScratchStage()
        })
    }

    window.$docsify = window.$docsify || {}
    window.$docsify.plugins = [].concat(docsifyScratchStage, window.$docsify.plugins || [])

})()


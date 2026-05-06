# Utils Library Tests

<div id="utils-test-results" class="cards"></div>

<script>
(function () {
  const out = document.getElementById('utils-test-results')
  const utils = window.DocsifyUtils
  if (!out || !utils) return

  const tests = [
    {
      name: 'escapeHtml escapes angle brackets and apostrophe',
      run: () => utils.escapeHtml("<x>'\"") === '&lt;x&gt;&#39;&quot;'
    },
    {
      name: 'resolveSourcePath keeps absolute URLs',
      run: () => utils.resolveSourcePath('https://a.com/file.svg') === 'https://a.com/file.svg'
    },
    {
      name: 'resolveSourcePath trims leading slash for local path',
      run: () => utils.resolveSourcePath('/tests/a.svg') === 'tests/a.svg'
    },
    {
      name: 'isSvgImage detects svg image path',
      run: () => {
        const img = document.createElement('img')
        img.setAttribute('src', 'diagram.svg')
        return utils.isSvgImage(img) === true
      }
    },
    {
      name: 'hexToRgb and rgbToHex round trip',
      run: () => {
        const rgb = utils.hexToRgb('#12AB34')
        return rgb.r === 18 && rgb.g === 171 && rgb.b === 52 && utils.rgbToHex(18, 171, 52) === '#12ab34'
      }
    },
    {
      name: 'extractMarker strips marker',
      run: () => {
        const m = utils.extractMarker('!! Focus item')
        return m.hasMarker === true && m.cleanText === 'Focus item'
      }
    },
    {
      name: 'padDigits aligns to block size',
      run: () => utils.padDigits('101', 4) === '0101'
    },
    {
      name: 'DocsifyUtils export is frozen',
      run: () => Object.isFrozen(utils) === true
    }
  ]

  const passed = []
  const failed = []

  tests.forEach(t => {
    try {
      if (t.run()) passed.push(t.name)
      else failed.push(t.name)
    } catch (err) {
      failed.push(t.name + ' (' + err.message + ')')
    }
  })

  const passHtml = passed.map(name => '<li>' + name + '</li>').join('')
  const failHtml = failed.map(name => '<li>' + name + '</li>').join('')

  out.innerHTML = '' +
    '<div class="card">' +
      '<h3>Pass: ' + passed.length + '</h3>' +
      '<ul>' + passHtml + '</ul>' +
    '</div>' +
    '<div class="card">' +
      '<h3>Fail: ' + failed.length + '</h3>' +
      '<ul>' + failHtml + '</ul>' +
    '</div>'
})()
</script>

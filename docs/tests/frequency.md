# Letter Frequency Analysis

> Interactive text frequency analyzer with real-time visualization

## What is Letter Frequency Analysis?

**Letter frequency analysis** examines how often each letter appears in a piece of text. This is useful in cryptography, linguistics, and data analysis. In English text, some letters like 'E', 'T', and 'A' appear much more frequently than others like 'Z', 'Q', and 'X'.

## How It Works

The analyzer counts each letter (case-insensitive) and displays the results as a bar chart. You can:

- **Edit the text** in real-time and watch the chart update
- **Toggle between two sorting modes**:
  - **A-Z**: Alphabetical order
  - **Frequency**: Most common letters first

## Basic Example (Default: A-Z Sort)

Try editing this text to see the frequencies change:

<frequency>
The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet!
</frequency>

## Frequency-Sorted Example

Start with frequency sorting to see the most common letters first:

<frequency sort="freq">
To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer the slings and arrows of outrageous fortune, or to take arms against a sea of troubles and by opposing end them.
</frequency>

## Analyzing Famous Text

Here's the opening of "The Call of Cthulhu" by H.P. Lovecraft:

<frequency sort="az">
The most merciful thing in the world, I think, is the inability of the human mind to correlate all its contents. We live on a placid island of ignorance in the midst of black seas of infinity, and it was not meant that we should voyage far. The sciences, each straining in its own direction, have hitherto harmed us little; but some day the piecing together of dissociated knowledge will open up such terrifying vistas of reality, and of our frightful position therein, that we shall either go mad from the revelation or flee from the deadly light into the peace and safety of a new dark age.

Theosophists have guessed at the awesome grandeur of the cosmic cycle wherein our world and human race form transient incidents. They have hinted at strange survivals in terms which would freeze the blood if not masked by a bland optimism. But it is not from them that there came the single glimpse of forbidden eons which chills me when I think of it and maddens me when I dream of it. That glimpse, like all dread glimpses of truth, flashed out from an accidental piecing together of separated things--in this case an old newspaper item and the notes of a dead professor. I hope that no one else will accomplish this piecing out; certainly, if I live, I shall never knowingly supply a link in so hideous a chain. I think that the professor, too, intended to keep silent regarding the part he knew, and that he would have destroyed his notes had not sudden death seized him.

My knowledge of the thing began in the winter of 1926-27 with the death of my grand-uncle, George Gammell Angell, Professor Emeritus of Semitic Languages in Brown University, Providence, Rhode Island. Professor Angell was widely known as an authority on ancient inscriptions, and had frequently been resorted to by the heads of prominent museums; so that his passing at the age of ninety-two may be recalled by many. Locally, interest was intensified by the obscurity of the cause of death. The professor had been stricken whilst returning from the Newport boat; falling suddenly, as witnesses said, after having been jostled by a nautical-looking negro who had come from one of the queer dark courts on the precipitous hillside which formed a short cut from the waterfront to the deceased's home in Williams Street. Physicians were unable to find any visible disorder, but concluded after perplexed debate that some obscure lesion of the heart, induced by the brisk ascent of so steep a hill by so elderly a man, was responsible for the end. At the time I saw no reason to dissent from this dictum, but latterly I am inclined to wonder--and more than wonder.
</frequency>

## Empty Text Example

Start with a blank slate:

<frequency></frequency>

## Short Text Example

Analyze individual words or phrases:

<frequency>
ABRACADABRA
</frequency>

## Custom Accent Colors

The frequency chart supports custom accent colors via the `--frequency-accent` CSS variable. Below are examples showing different palette colors applied:

<style>
.color-palette-1 { --frequency-accent: var(--palette-color-1); }
.color-palette-2 { --frequency-accent: var(--palette-color-2); }
.color-palette-3 { --frequency-accent: var(--palette-color-3); }
.color-palette-4 { --frequency-accent: var(--palette-color-4); }
.color-attention { --frequency-accent: var(--color-attention); }
</style>

<div class="color-palette-1">

### Palette Color 1 (Green)

<frequency>The quick brown fox jumps over the lazy dog</frequency>

</div>

<div class="color-palette-2">

### Palette Color 2 (Purple)

<frequency>Hello World! This is a test of the frequency analyzer.</frequency>

</div>

<div class="color-palette-3">

### Palette Color 3 (Blue)

<frequency>Programming in Python is fun and powerful!</frequency>

</div>

<div class="color-palette-4">

### Palette Color 4 (Pink)

<frequency>JavaScript, TypeScript, CoffeeScript - so many scripts!</frequency>

</div>

<div class="color-attention">

### Attention Color (Red)

<frequency>Error! Warning! Alert! Critical failure detected!</frequency>

</div>

## Real-World Applications

Letter frequency analysis has many practical uses:

- **Cryptanalysis**: Breaking simple substitution ciphers
- **Language Detection**: Identifying the language of a text
- **Data Compression**: Huffman coding uses frequency for optimal compression
- **Spam Detection**: Analyzing text patterns in emails
- **Linguistics**: Studying language structure and patterns

## Fun Facts

- In English text, 'E' is typically the most common letter (~12-13%)
- 'Z' is usually the rarest letter (~0.07%)
- The distribution is different in other languages (e.g., German has more umlauts)
- Letter frequency can help identify coded messages
- Even without spaces, you can often identify language by letter frequency alone

## Reusable API

The frequency chart can be used by other plugins via the global `window.FrequencyChart` object:

```javascript
// Analyze text and get frequency data
const result = window.FrequencyChart.analyze("Hello World");
// Returns: { frequencies, total, unique, maxCount }

// Generate just the chart HTML (without wrapper)
const chartHTML = window.FrequencyChart.generateChartHTML("Sample text", "freq");
// Returns: HTML string with frequency bars

// Access the analyzer class directly
const analyzer = new window.FrequencyChart.FrequencyAnalyzer("Text to analyze");
```

### Using the Chart in Other Plugins

To embed a frequency chart in another plugin, wrap the generated HTML in a `frequency-chart` container:

```javascript
const text = "Your text to analyze";
const chartHTML = window.FrequencyChart.generateChartHTML(text, "az");

const container = document.createElement('div');
container.className = 'frequency-chart';
container.innerHTML = `<div class="frequency-bars">${chartHTML}</div>`;

// Append container to your plugin's DOM
yourElement.appendChild(container);
```

The CSS styling for `.frequency-chart` is available globally, so the chart will be properly styled anywhere in `.markdown-section`.

### Customizing Chart Colors

The chart color can be customized using the `--frequency-accent` CSS variable:

```css
/* Override the accent color for a specific chart */
.my-custom-plugin .frequency-chart {
    --frequency-accent: var(--palette-color-2);
}
```

Or inline with HTML:

```html
<div style="--frequency-accent: var(--palette-color-3)">
    <div class="frequency-chart">
        <div class="frequency-bars"><!-- chart HTML here --></div>
    </div>
</div>
```

**Available palette colors:**
- `--palette-color-1` - Orange/Amber
- `--palette-color-2` - Green
- `--palette-color-3` - Blue
- `--palette-color-4` - Purple
- `--color-attention` - Red/Pink (for warnings/errors)
- `--highlight-color` - Yellow/Gold (for highlighting)

By default:
- Charts within `<frequency>` elements use `--theme-color`
- Standalone charts also use `--theme-color` unless overridden by a parent element

This allows other plugins to embed frequency charts or use the analysis logic without duplicating code.


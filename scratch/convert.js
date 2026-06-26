const fs = require('fs');
const path = require('path');

const results = {};

function cleanSvg(filename, uniqueIdPrefix) {
  let content = fs.readFileSync(filename, 'utf-8');
  
  // Remove XML declaration and comments
  content = content.replace(/<\?xml.*?\?>/g, '');
  content = content.replace(/<!--.*?-->/gs, '');
  
  // Parse classes in styles if any
  const styleMatch = content.match(/<style[^>]*>(.*?)<\/style>/s);
  const classToFill = {};
  if (styleMatch) {
    const styleText = styleMatch[1];
    const rules = styleText.match(/\.([a-zA-Z0-9_-]+)\s*\{\s*fill\s*:\s*(#[a-zA-Z0-9]+)\s*\}/g) || [];
    rules.forEach(rule => {
      const match = rule.match(/\.([a-zA-Z0-9_-]+)\s*\{\s*fill\s*:\s*(#[a-zA-Z0-9]+)\s*\}/);
      if (match) {
        classToFill[match[1]] = match[2];
      }
    });
  }

  // Remove style tags
  content = content.replace(/<style[^>]*>.*?<\/style>/gs, '');

  // Convert SVG properties to React camelCase
  const attributeReplacements = [
    { regex: /class="([^"]+)"/g, replacement: (match, className) => {
      if (classToFill[className]) {
        return `fill="${classToFill[className]}"`;
      }
      if (filename.includes('codeclouds')) {
        if (className === 'cls-1') return `fill="#0e90d0"`;
        if (className === 'cls-2') return `fill="#014e72"`;
      }
      return `className="${className}"`;
    }},
    { regex: /style="fill:\s*(#[a-zA-Z0-9]+)(?:;[^"]*)?"/g, replacement: 'fill="$1"' },
    { regex: /style="fill:\s*([^;"]+)(?:;[^"]*)?"/g, replacement: 'fill="$1"' },
    { regex: /clip-path=/g, replacement: 'clipPath=' },
    { regex: /gradientTransform=/g, replacement: 'gradientTransform=' },
    { regex: /gradientUnits=/g, replacement: 'gradientUnits=' },
    { regex: /stop-color=/g, replacement: 'stopColor=' },
    { regex: /xlink:href=/g, replacement: 'xlinkHref=' },
    { regex: /fill-rule=/g, replacement: 'fillRule=' },
    { regex: /clip-rule=/g, replacement: 'clipRule=' },
    { regex: /fill-opacity=/g, replacement: 'fillOpacity=' },
    { regex: /xml:space="preserve"/g, replacement: 'xmlSpace="preserve"' },
    { regex: /id="([^"]+)"/g, replacement: `id="${uniqueIdPrefix}-$1"` },
    { regex: /url\(#([^)]+)\)/g, replacement: `url(#${uniqueIdPrefix}-$1)` },
    { regex: /xlinkHref="#([^"]+)"/g, replacement: `xlinkHref="#${uniqueIdPrefix}-$1"` }
  ];

  let cleaned = content;
  for (const rep of attributeReplacements) {
    cleaned = cleaned.replace(rep.regex, rep.replacement);
  }

  // Extract the inner nodes of <svg>... </svg>
  const svgOpenMatch = cleaned.match(/<svg[^>]*>/);
  if (!svgOpenMatch) {
    console.log(`No SVG tag found in ${filename}`);
    return;
  }
  const svgOpen = svgOpenMatch[0];
  
  // Find viewBox
  const viewBoxMatch = svgOpen.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '';
  const widthMatch = svgOpen.match(/width="([^"]+)"/);
  const heightMatch = svgOpen.match(/height="([^"]+)"/);
  const width = widthMatch ? widthMatch[1] : '';
  const height = heightMatch ? heightMatch[1] : '';

  // Get inner content
  const svgCloseIndex = cleaned.lastIndexOf('</svg>');
  const svgOpenIndex = cleaned.indexOf(svgOpen) + svgOpen.length;
  const innerContent = cleaned.substring(svgOpenIndex, svgCloseIndex).trim();

  results[uniqueIdPrefix] = {
    viewBox: viewBox || `0 0 ${width} ${height}`,
    innerContent: innerContent
  };
}

cleanSvg('wipro.svg', 'wipro');
cleanSvg('cognizant.svg', 'cognizant');
cleanSvg('capgemini.svg', 'capgemini');
cleanSvg('codeclouds.svg', 'codeclouds');

fs.writeFileSync('scratch/converted_svgs.json', JSON.stringify(results, null, 2), 'utf-8');
console.log('Conversion successful. Output written to scratch/converted_svgs.json');

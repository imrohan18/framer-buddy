import fs from 'node:fs';

// Letter matrices for Y, R, U, X (5x7 grid)
const letters = {
  Y: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ],
  R: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,1,0,0],
    [1,0,0,1,0],
    [1,0,0,0,1],
  ],
  U: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
  ],
  X: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,0,1,0],
    [0,0,1,0,0],
    [0,1,0,1,0],
    [1,0,0,0,1],
    [1,0,0,0,1],
  ],
};

/**
 * Calligraphic "ह" path matching the user's drawing:
 * Top horizontal bar (shirorekha), curved upper hook,
 * and the dramatic sweeping lower crescent flourish.
 */
function getCalligraphicHaPath(scale = 1, offsetX = 0, offsetY = 0) {
  // Base coordinates normalized to ~ 60x70 bounding box
  // Returns SVG path
  return `<g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
    <!-- Top shirorekha bar with calligraphic angle -->
    <path d="M 4,14 L 62,14 C 62,14 60,18.5 56,19.5 L 10,19.5 C 7,19.5 4,17 4,14 Z" />
    
    <!-- Short vertical stem -->
    <path d="M 31,18 L 37,18 L 36,26 L 30,26 Z" />
    
    <!-- Upper hook of ह (sweeps right and curls back inward) -->
    <path d="M 32,24 C 44,24 53,27 52,36 C 51,43 43,45 35,43 C 27,41 23,37 23,36 C 23,36 29,39 36,39 C 43,39 46,36 46,33 C 46,29 38,28 30,28 L 29,24 Z" />
    
    <!-- Sweeping grand crescent lower flourish -->
    <path d="M 35,42 C 22,43 14,48 10,56 C 5,66 9,79 22,85 C 33,90 44,87 49,82 C 50,81 48,80 46,81 C 37,87 23,86 16,78 C 10,70 12,59 23,52 C 30,47 40,49 46,55 C 47,56 48,54 47,53 C 43,47 37,42 35,42 Z" />
  </g>`;
}

function generateSvg({
  withBackground = false,
  bgColor = "#A4C6DE",
  textColor = "#080808",
  pixelSize = 8,
  letterSpacing = 1,
  paddingX = 26,
  paddingY = 24,
  domainText = ".in"
}) {
  const word = ["Y", "R", "U", "X"];
  const rects = [];
  
  // Calligraphic "ह" width is about 64px
  const haScale = (pixelSize * 7) / 72; // scale to match pixel text height
  const haWidth = 60 * haScale;
  const haHeight = 85 * haScale;
  
  // Baseline alignment: pixel text starts at paddingY + 6 (accounting for ha top bar)
  const pixelStartY = paddingY + 12;
  const haOffsetY = paddingY;

  let currentX = paddingX + haWidth + 14;

  for (const char of word) {
    const matrix = letters[char];
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c] === 1) {
          rects.push(
            `<rect x="${Math.round(currentX + c * pixelSize)}" y="${Math.round(pixelStartY + r * pixelSize)}" width="${pixelSize}" height="${pixelSize}" />`
          );
        }
      }
    }
    currentX += (5 + letterSpacing) * pixelSize;
  }

  // After X, place .in cursive script
  const textX = Math.round(currentX - (letterSpacing * pixelSize) + 5);
  const textY = Math.round(pixelStartY + 7 * pixelSize + 2);

  const totalWidth = Math.round(textX + 42 + paddingX);
  const totalHeight = Math.round(pixelStartY + 7 * pixelSize + paddingY + 10);

  const bgRect = withBackground
    ? `<rect width="100%" height="100%" rx="14" fill="${bgColor}" />`
    : "";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" width="${totalWidth}" height="${totalHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&amp;display=swap');
      .domain-script {
        font-family: 'Caveat', 'Playwrite', 'Brush Script MT', cursive;
        font-size: ${Math.round(pixelSize * 3.1)}px;
        font-weight: 700;
        font-style: italic;
        fill: ${textColor};
      }
    </style>
  </defs>
  ${bgRect}
  <g fill="${textColor}">
    ${getCalligraphicHaPath(haScale, paddingX, haOffsetY)}
    <g shape-rendering="crispEdges">
      ${rects.join("\n      ")}
    </g>
    <text x="${textX}" y="${textY}" class="domain-script">${domainText}</text>
  </g>
</svg>`;
}

// Generate the badge version matching the reference photo
const badgeSvg = generateSvg({
  withBackground: true,
  bgColor: "#A4C6DE",
  textColor: "#080808",
  pixelSize: 8,
  letterSpacing: 1,
  paddingX: 30,
  paddingY: 22,
  domainText: ".in"
});
fs.writeFileSync('E:/StartUp/framer-buddy/public/hyrux-logo-badge.svg', badgeSvg);

// Generate transparent version for navbar and dark/light UI
const transparentSvg = generateSvg({
  withBackground: false,
  textColor: "#080808",
  pixelSize: 6,
  letterSpacing: 1,
  paddingX: 4,
  paddingY: 6,
  domainText: ".in"
});
fs.writeFileSync('E:/StartUp/framer-buddy/public/hyrux-logo.svg', transparentSvg);

// Favicon with calligraphic ह
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="14" fill="#A4C6DE" />
  <g fill="#080808" transform="translate(6, 4) scale(0.68)">
    <path d="M 4,14 L 66,14 C 66,14 64,19 60,20 L 10,20 C 7,20 4,17 4,14 Z" />
    <path d="M 32,18 L 38,18 L 37,27 L 31,27 Z" />
    <path d="M 33,25 C 46,25 56,28 55,38 C 54,45 45,47 37,45 C 28,43 23,38 23,37 C 23,37 30,40 38,40 C 45,40 48,37 48,34 C 48,30 39,29 31,29 L 30,25 Z" />
    <path d="M 37,44 C 23,45 15,50 11,58 C 5,69 9,82 23,88 C 35,93 46,90 51,85 C 52,84 50,83 48,84 C 39,90 24,89 17,81 C 10,72 13,61 24,54 C 32,49 42,51 48,57 C 49,58 50,56 49,55 C 45,49 39,44 37,44 Z" />
  </g>
</svg>`;
fs.writeFileSync('E:/StartUp/framer-buddy/public/favicon.svg', faviconSvg);

console.log('Calligraphic ह logos generated successfully!');

import fs from 'node:fs';

const b64 = fs.readFileSync('E:/StartUp/framer-buddy/public/favicon.png').toString('base64');
const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" width="64" height="64">
  <defs>
    <clipPath id="squircle">
      <rect width="512" height="512" rx="120" />
    </clipPath>
  </defs>
  <image href="data:image/png;base64,${b64}" width="512" height="512" clip-path="url(#squircle)" preserveAspectRatio="xMidYMid slice" />
</svg>`;

fs.writeFileSync('E:/StartUp/framer-buddy/public/favicon.svg', svg);
console.log('favicon.svg built cleanly from high-res asset!');

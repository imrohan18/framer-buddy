import fs from 'node:fs';

const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <!-- Sleek premium black rounded tile -->
  <rect width="64" height="64" rx="16" fill="#0A0A0A" />
  
  <!-- Subtle inner border for premium depth -->
  <rect x="0.75" y="0.75" width="62.5" height="62.5" rx="15.25" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1.5" />
  
  <!-- Bold crisp white Sanskrit 'ह' mark -->
  <g fill="#FFFFFF">
    <!-- Top shirorekha bar -->
    <rect x="14" y="14" width="36" height="5.5" rx="1.5" />
    
    <!-- Vertical stem -->
    <rect x="29" y="18" width="6" height="7" rx="0.5" />
    
    <!-- Upper hook & lower curve of ह -->
    <path fill-rule="evenodd" d="
      M 31,24
      C 42,24 49,27 49,34
      C 49,39.5 44,42.5 37,42
      C 30,41.5 27,39 26,38
      C 27,40 31,43.5 37,44
      C 42,44.5 45.5,42.5 46.5,40.5
      C 45,46 38,49 32,49
      C 22,49 17,43 17,35
      C 17,28 23,24 31,24 Z
      M 31,43
      C 36,44 42,47 45,51.5
      C 46,53 45,54.5 43.5,54.5
      C 39,52 32,50 25,50
      C 18,50 13.5,54 13.5,58.5
      C 13.5,63.5 19,67 29,67
      C 39,67 47,62 49,56
      C 49.5,54.5 51,55 50.5,56.5
      C 48,64 39.5,71 28,71
      C 15,71 8,64 8,56.5
      C 8,49 14,44 23,43.5
      C 26,43.3 28.5,43.2 31,43 Z
    " transform="translate(4, -7) scale(0.88)" />
  </g>
</svg>`;

fs.writeFileSync('E:/StartUp/framer-buddy/public/favicon.svg', svgContent);
console.log('favicon.svg generated');

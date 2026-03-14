import puppeteer from 'puppeteer';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const juaLatinB64 = readFileSync(resolve(root, 'node_modules/@fontsource/jua/files/jua-latin-400-normal.woff2')).toString('base64');
const juaKoreanB64 = readFileSync(resolve(root, 'node_modules/@fontsource/jua/files/jua-korean-400-normal.woff2')).toString('base64');

const html = `
<!DOCTYPE html>
<html>
<head>
<style>
  @font-face {
    font-family: 'Jua';
    src: url('data:font/woff2;base64,${juaLatinB64}') format('woff2');
  }
  @font-face {
    font-family: 'Jua';
    src: url('data:font/woff2;base64,${juaKoreanB64}') format('woff2');
    unicode-range: U+AC00-D7AF;
  }
  * { margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
    background: linear-gradient(135deg, #8b5cf6, #a855f7);
    font-family: 'Jua', sans-serif;
  }
  .title {
    font-size: 140px;
    color: white;
    opacity: 0.95;
  }
  .desc {
    font-size: 56px;
    color: white;
    opacity: 0.8;
  }
</style>
</head>
<body>
  <div class="title">RPS</div>
  <div class="desc">친구와 실시간 가위바위보 대전</div>
</body>
</html>
`;

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630 });
await page.setContent(html, { waitUntil: 'networkidle0' });
await page.screenshot({ path: resolve(root, 'public/og-image.png'), type: 'png' });
await browser.close();
console.log('OG image generated!');

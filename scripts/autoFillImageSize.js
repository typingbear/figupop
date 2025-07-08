const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imageRoot = './assets/images';
const outputPath = './src/data/figures_from_images.json';

// 파일명: {id}-{mode}.png 인 것만 추출
const files = fs.readdirSync(imageRoot).filter(f => f.endsWith('.png'));

function parseName(filename) {
  // 예시: bear-base.png
  const match = filename.match(/^(.+?)-(.+?)\.png$/);
  if (match) {
    return { id: match[1], mode: match[2] };
  }
  return null;
}

async function buildFigures() {
  const figuresMap = {};

  // 1. 파일별로 id, mode를 분류
  for (const file of files) {
    const parsed = parseName(file);
    if (!parsed) continue;
    const { id, mode } = parsed;
    if (!figuresMap[id]) {
      figuresMap[id] = {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        kind: "prime",
        modes: {},
        reactions: []
      };
    }
    const imgPath = path.join(imageRoot, file);
    let width = null, height = null;
    try {
      const info = await sharp(imgPath).metadata();
      width = info.width;
      height = info.height;
    } catch (e) {
      console.warn(`이미지 분석 실패: ${imgPath}`, e);
    }
    figuresMap[id].modes[mode] = { width, height };
  }

  // 2. figures 배열 생성
  const figures = Object.values(figuresMap);

  // 3. 파일 저장
  fs.writeFileSync(outputPath, JSON.stringify({ figures }, null, 2));
  console.log('완료! 결과:', outputPath);
}

buildFigures();

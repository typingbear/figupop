const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 경로 설정
const imageRoot = path.join(__dirname, '../assets/images');
const oldFiguresPath = path.join(__dirname, 'data', 'figures.json');
const outputPath = path.join(__dirname, 'data', 'figures_merged.json');

// 파일명: {id}-{mode}.png 인 것만 추출
const files = fs.readdirSync(imageRoot).filter(f => f.endsWith('.png'));

function parseName(filename) {
  const match = filename.match(/^(.+?)-(.+?)\.png$/);
  if (match) return { id: match[1], mode: match[2] };
  return null;
}

async function buildAndMergeFigures() {
  // 1. 기존 figures.json 불러오기 (존재 안 하면 빈 배열)
  let oldFigures = [];
  if (fs.existsSync(oldFiguresPath)) {
    oldFigures = JSON.parse(fs.readFileSync(oldFiguresPath, 'utf8')).figures || [];
  }
  const oldMap = {};
  oldFigures.forEach(f => oldMap[f.id] = f);

  // 2. 이미지에서 id/mode/width/height 추출
  const figuresMap = {};
  for (const file of files) {
    const parsed = parseName(file);
    if (!parsed) continue;
    const { id, mode } = parsed;
    if (!figuresMap[id]) {
      figuresMap[id] = {
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        kind: "prime",
        modes: {}
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

  // 3. Merge (id/name/kind/modes의 width, height는 새 데이터 우선, 그 외는 기존꺼)
  const mergedFigures = Object.values(figuresMap).map(newFig => {
    const old = oldMap[newFig.id];
    if (old) {
      // modes: width, height는 새것, 그 외(desc 등)는 기존것
      const newModes = {};
      for (const modeName in newFig.modes) {
        newModes[modeName] = {
          width: newFig.modes[modeName].width,
          height: newFig.modes[modeName].height,
          ...(old.modes && old.modes[modeName]
            ? Object.fromEntries(
                Object.entries(old.modes[modeName])
                  .filter(([k]) => !['width', 'height'].includes(k))
              )
            : {})
        };
      }
      return {
        ...old,
        ...newFig, // id, name, kind(이미지 기준)
        kind: old.kind || newFig.kind,
        modes: newModes,
      };
    }
    return newFig; // 신규면 그대로
  });

  // 4. 기존에만 있고 이미지엔 없는 id는 유지(선택적)
  oldFigures.forEach(oldFig => {
    if (!mergedFigures.find(f => f.id === oldFig.id)) mergedFigures.push(oldFig);
  });

  // 5. 저장
  fs.writeFileSync(outputPath, JSON.stringify({ figures: mergedFigures }, null, 2));
  console.log('완료! 결과:', outputPath);
}

buildAndMergeFigures();

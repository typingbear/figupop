const fs = require("fs");
const path = require("path");

// 변환 목록 (json 파일, ts 파일, 타입명, 변수명)
const jobs = [
  {
    jsonPath: path.join(__dirname, "../src/data/figures.json"),
    tsPath: path.join(__dirname, "../src/data/figures.ts"),
    typeImport: "Figure",
    typePath: "../common/types",
    variable: "figures",
    accessor: "figures", // json 파일 내 실제 데이터 키
  },
  {
    jsonPath: path.join(__dirname, "../src/data/initialGameState.json"),
    tsPath: path.join(__dirname, "../src/data/initialGameState.ts"),
    typeImport: "GameState",
    typePath: "../common/types",
    variable: "gameStates",
    accessor: null, // json 파일이 곧 전체 상태면 null
  },  
  {
    jsonPath: path.join(__dirname, "../src/data/spritsEffects.json"),
    tsPath: path.join(__dirname, "../src/data/spritsEffects.ts"),
    typeImport: "SpritesEffect",
    typePath: "../common/types",
    variable: "spritesEffects",
    accessor: null, // json 파일이 곧 전체 상태면 null
  },
];

jobs.forEach(({ jsonPath, tsPath, typeImport, typePath, variable, accessor }) => {
  const json = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const value = accessor ? json[accessor] : json;
  const ts = `// 이 파일은 자동 생성됨. ${path.basename(jsonPath)} -> ${path.basename(tsPath)} 변환
import type { ${typeImport} } from "${typePath}";

export const ${variable}: ${typeImport}${accessor ? "[]" : ""} = ${JSON.stringify(value, null, 2)};
`;

  fs.writeFileSync(tsPath, ts, "utf8");
  console.log(`${path.basename(tsPath)} 생성 완료!`);
});

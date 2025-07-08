// src/services/figureLibrary.ts
import { figures } from "../data/figures.js";
import type { Figure, FigureModeEntry } from "../common/types.js";

// 전체 피규어 (불변 배열)
export const FIGURE_LIST: Figure[] = figures;

// 모든 피규어의 모든 모드 (한 번만 펼쳐서 상수로 만듦)
export const ALL_FIGURE_MODES: FigureModeEntry[] = (() => {
  const arr: FigureModeEntry[] = [];
  for (const fig of FIGURE_LIST) {
    for (const mode in fig.modes) {
      arr.push({
        id: `${fig.id}-${mode}`,
        figureId: fig.id,
        name: fig.name,
        mode,
        width: fig.modes[mode].width,
        height: fig.modes[mode].height,
        kind: fig.kind,
        desc: fig.desc,
      });
    }
  }
  return arr;
})();

// kind별로 묶은 맵 (최초 1회만 생성)
export const FIGURE_KIND_MAP: Map<string, Figure[]> = (() => {
  const map = new Map<string, Figure[]>();
  for (const fig of FIGURE_LIST) {
    if (!map.has(fig.kind)) map.set(fig.kind, []);
    map.get(fig.kind)!.push(fig);
  }
  return map;
})();

// 단일 피규어 조회(유틸)
export function getFigureById(id: string): Figure | undefined {
  return FIGURE_LIST.find(f => f.id === id);
}

// kind별 피규어 배열 조회(유틸)
export function getFiguresByKind(kind: string): Figure[] {
  return FIGURE_KIND_MAP.get(kind) ?? [];
}

// 이름으로 검색(유틸)
export function searchFigures(keyword: string): Figure[] {
  const kw = keyword.toLowerCase();
  return FIGURE_LIST.filter(f => f.name.toLowerCase().includes(kw));
}

// 모드별 이미지 크기 반환(유틸)
export function getFigureSize(id: string, mode: string): { width: number; height: number } {
  const fig = getFigureById(id);
  if (!fig) return { width: 120, height: 120 };
  const m = (mode && fig.modes[mode]) ? fig.modes[mode] : fig.modes["base"];
  return {
    width: typeof m.width === "number" ? m.width : 120,
    height: typeof m.height === "number" ? m.height : 120,
  };
}



export function getReactionResult(
  aId: string,
  aMode: string,
  bId: string,
  bMode: string
): { resultFigureId: string; resultMode: string; sound?: string } | null {
  const aFigure = getFigureById(aId);
  if (!aFigure || !Array.isArray(aFigure.reactions)) return null;

  for (const reaction of aFigure.reactions) {
    // aMode 매칭
    if (reaction.mode !== "*" && reaction.mode !== aMode) continue;
    // b 피규어/모드 매칭
    if (
      reaction.with !== bId &&
      reaction.with !== `${bId}.${bMode}` &&
      reaction.with !== "*"
    ) continue;

    let resultFigureId = aId;
    let resultMode = reaction.result;

    // result가 "id.mode" 형태면 파싱
    if (reaction.result.includes(".")) {
      const [otherId, otherMode] = reaction.result.split(".");
      resultFigureId = otherId;
      resultMode = otherMode;
    }

    return {
      resultFigureId,
      resultMode,
      sound: reaction.sound,
    };
  }
  return null;
}

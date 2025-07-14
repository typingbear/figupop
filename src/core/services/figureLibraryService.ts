// src/services/figureLibrary.ts
import { figures } from "../../data/figures.js";
import type { Figure, FigureModeEntry, FigureReactionResult } from "../../common/types.js";
import { FIGURE_MAX_SIZE } from "../../common/config.js";
import { getDeviceType } from "../../common/utils.js";

// 전체 피규어 (불변 배열)
export const FIGURE_LIST: Figure[] = figures;
// prime kind 피규어 개수(처음 1회만 계산, 변하지 않음)
export const PRIME_FIGURE_COUNT: number = FIGURE_LIST.filter(f => f.kind === 'prime').length;

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
        desc: fig.modes[mode].desc ?? '',
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
): FigureReactionResult | null {
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

    // reaction 모든 필드 + result id/mode 추가!
    return {
      ...reaction,
      resultFigureId,
      resultMode,
    };
  }
  return null;
}



export function getPrimeFigures() {
  return FIGURE_LIST.filter(f => f.kind === "prime");
}

/**
 * 반응형(PC/태블릿/모바일)에 따라 실제 img가 그려질 width, height(px) 계산
 * @param id      Figure의 id
 * @param mode    mode명
 * @returns       { width, height } 최종 그려질 크기(px)
 */
export function getResponsiveFigureSize(id: string, mode: string): { width: number, height: number } {
  const device = getDeviceType();
  const maxW = FIGURE_MAX_SIZE[device];
  const maxH = FIGURE_MAX_SIZE[device];

  const { width: origW, height: origH } = getFigureSize(id, mode);

  const ratio = origW / origH;
  let width = origW, height = origH;

  // 원본보다 크면 제한
  if (origW > maxW || origH > maxH) {
    if (ratio >= 1) {
      // 가로가 긴 경우
      width = maxW;
      height = Math.round(maxW / ratio);
      if (height > maxH) {
        height = maxH;
        width = Math.round(maxH * ratio);
      }
    } else {
      // 세로가 긴 경우
      height = maxH;
      width = Math.round(maxH * ratio);
      if (width > maxW) {
        width = maxW;
        height = Math.round(maxW / ratio);
      }
    }
  }
  return { width, height };
}

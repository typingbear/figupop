// figureTypes.ts

export type FigureModeMap = {
  [mode: string]: {
    width: number | null;
    height: number | null;
    desc?: string | null;
  };
};

export type FigureReaction = {
  mode: string;
  with: string;
  result: string;
  sound?: string;
  effect?: string;
  removeOther?: boolean; // true면 "상대방은 사라짐"

};
export type FigureReactionResult = FigureReaction & {
  resultFigureId: string;
  resultMode: string;
};
export type Figure = {
  id: string;
  name: string;
  kind: string;
  modes: FigureModeMap;
  reactions: FigureReaction[];
  sound?: string;
  effect?: string;
  desc?: string;
};

export type FigureModeEntry = {
  id: string;
  figureId: string;
  name: string;
  mode: string;
  width: number | null;
  height: number | null;
  kind: string;
  desc?: string;
};

export type FiguresData = {
  figures: Figure[];
};

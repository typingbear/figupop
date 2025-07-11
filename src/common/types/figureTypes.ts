// figureTypes.ts

export type FigureModeMap = {
  [mode: string]: {
    width: number | null;
    height: number | null;
  };
};

export type FigureReaction = {
  mode: string;
  with: string;
  result: string;
  sound?: string;
};

export type Figure = {
  id: string;
  name: string;
  kind: string;
  modes: FigureModeMap;
  reactions: FigureReaction[];
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

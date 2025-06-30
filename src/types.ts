export type FigureReaction = {
  with: string;         // 반응 대상 id
  resultState: string;  // 바뀔 상태
  sound?: string;       // 사운드 파일명 (옵션)
};

export type Figure = {
  id: string;
  name: string;
  states: string[];
  reactions: FigureReaction[];
};

export type FiguresData = {
  figures: Figure[];
};

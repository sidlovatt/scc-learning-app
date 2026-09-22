import { createContext, useContext } from 'react';

export const StageScaleContext = createContext(1);

export function useStageScale() {
  return useContext(StageScaleContext);
}

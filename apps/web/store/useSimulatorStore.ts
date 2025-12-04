import { create } from 'zustand';
import { SimulationStatus } from '@sdm/types';

interface SimulatorState {
  groomImage: File | null;
  brideImage: File | null;
  resultId: string | null;
  status: SimulationStatus;
  progress: number;
  outputImageUrl: string | null;

  setGroomImage: (file: File | null) => void;
  setBrideImage: (file: File | null) => void;
  setResultId: (id: string | null) => void;
  setStatus: (status: SimulationStatus) => void;
  setProgress: (progress: number) => void;
  setOutputImageUrl: (url: string | null) => void;
  reset: () => void;
}

export const useSimulatorStore = create<SimulatorState>(set => ({
  groomImage: null,
  brideImage: null,
  resultId: null,
  status: 'PENDING' as SimulationStatus,
  progress: 0,
  outputImageUrl: null,

  setGroomImage: file => set({ groomImage: file }),
  setBrideImage: file => set({ brideImage: file }),
  setResultId: id => set({ resultId: id }),
  setStatus: status => set({ status }),
  setProgress: progress => set({ progress }),
  setOutputImageUrl: url => set({ outputImageUrl: url }),

  reset: () =>
    set({
      groomImage: null,
      brideImage: null,
      resultId: null,
      status: 'PENDING' as SimulationStatus,
      progress: 0,
      outputImageUrl: null,
    }),
}));

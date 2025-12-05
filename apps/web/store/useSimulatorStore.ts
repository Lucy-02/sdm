import { create } from 'zustand';
import { SimulationStatus } from '@sdm/types';

interface SimulatorState {
  // Step management
  currentStep: number;
  brideName: string;
  groomName: string;

  // Images
  groomImage: File | null;
  brideImage: File | null;

  // Processing
  resultId: string | null;
  status: SimulationStatus;
  progress: number;
  outputImageUrl: string | null;

  // Step actions
  setCurrentStep: (step: number) => void;
  setBrideName: (name: string) => void;
  setGroomName: (name: string) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Image actions
  setGroomImage: (file: File | null) => void;
  setBrideImage: (file: File | null) => void;

  // Processing actions
  setResultId: (id: string | null) => void;
  setStatus: (status: SimulationStatus) => void;
  setProgress: (progress: number) => void;
  setOutputImageUrl: (url: string | null) => void;

  reset: () => void;
}

export const useSimulatorStore = create<SimulatorState>(set => ({
  // Initial state
  currentStep: 1,
  brideName: '',
  groomName: '',
  groomImage: null,
  brideImage: null,
  resultId: null,
  status: 'PENDING' as SimulationStatus,
  progress: 0,
  outputImageUrl: null,

  // Step actions
  setCurrentStep: step => set({ currentStep: step }),
  setBrideName: name => set({ brideName: name }),
  setGroomName: name => set({ groomName: name }),
  nextStep: () => set(state => ({ currentStep: Math.min(state.currentStep + 1, 4) })),
  prevStep: () => set(state => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

  // Image actions
  setGroomImage: file => set({ groomImage: file }),
  setBrideImage: file => set({ brideImage: file }),

  // Processing actions
  setResultId: id => set({ resultId: id }),
  setStatus: status => set({ status }),
  setProgress: progress => set({ progress }),
  setOutputImageUrl: url => set({ outputImageUrl: url }),

  // Reset
  reset: () =>
    set({
      currentStep: 1,
      brideName: '',
      groomName: '',
      groomImage: null,
      brideImage: null,
      resultId: null,
      status: 'PENDING' as SimulationStatus,
      progress: 0,
      outputImageUrl: null,
    }),
}));

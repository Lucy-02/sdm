'use client';

import Result from "./steps/result";
import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import { useSimulatorStore } from "@/store/useSimulatorStore";

export default function SimulatorPage() {
  const { currentStep } = useSimulatorStore();

  return (
    <div>
      {currentStep === 1 && <Step1 />}
      {currentStep === 2 && <Step2 />}
      {currentStep === 3 && <Step3 />}
      {currentStep === 4 && <Result />}
    </div>
  );
}

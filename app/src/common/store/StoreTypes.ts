import { InstructionsModeState } from '@/common/directives/InstructionsDirective';

export interface RootState {
  version: string;
  showContinueButton: boolean;
  showInstructionsExplainer: boolean;
  instructionsModeStore?: InstructionsModeState;
}

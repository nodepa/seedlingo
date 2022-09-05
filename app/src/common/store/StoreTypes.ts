import { InstructionsModeState } from '../directives/InstructionsDirective';

export interface RootState {
  version: string;
  showContinueButton: boolean;
  showInstructionsExplainer: boolean;
  instructionsModeStore?: InstructionsModeState;
}

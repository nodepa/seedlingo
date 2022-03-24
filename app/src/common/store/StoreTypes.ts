import { InstructionState } from '@/common/directives/InstructionDirective';

export interface RootState {
  version: string;
  showContinueButton: boolean;
  showInstructionExplainer: boolean;
  instructionStore?: InstructionState;
}

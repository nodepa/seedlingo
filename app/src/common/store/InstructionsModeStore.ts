import { ActionTree, Module, MutationTree } from 'vuex';
import type { RootState } from './StoreTypes';
import { InstructionsModeState } from '@/common/directives/InstructionsDirective';

const getDefaultState = (): InstructionsModeState => {
  return {
    isInstructionsMode: false,
  };
};

const actions: ActionTree<InstructionsModeState, RootState> = {
  toggleInstructionsMode({ commit }) {
    commit('TOGGLE_INSTRUCTIONS_MODE');
  },
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

const mutations: MutationTree<InstructionsModeState> = {
  TOGGLE_INSTRUCTIONS_MODE(state) {
    state.isInstructionsMode = !state.isInstructionsMode;
  },
  RESET_STATE(state) {
    Object.assign(state, getDefaultState());
  },
};

const InstructionsModeStore: Module<InstructionsModeState, RootState> = {
  namespaced: true,
  state: getDefaultState(),
  actions,
  mutations,
};

export default InstructionsModeStore;

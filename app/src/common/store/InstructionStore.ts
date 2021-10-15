import { ActionTree, Module, MutationTree } from 'vuex';
import { RootState } from './StoreTypes';
import { InstructionState } from '@/common/directives/InstructionDirective';

const getDefaultState = (): InstructionState => {
  return {
    isInstructionMode: false,
  };
};

const actions: ActionTree<InstructionState, RootState> = {
  toggleInstructionMode({ commit }) {
    commit('TOGGLE_INSTRUCTIONS_MODE');
  },
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

const mutations: MutationTree<InstructionState> = {
  TOGGLE_INSTRUCTIONS_MODE(state) {
    state.isInstructionMode = !state.isInstructionMode;
  },
  RESET_STATE(state) {
    Object.assign(state, getDefaultState());
  },
};

const InstructionStore: Module<InstructionState, RootState> = {
  namespaced: true,
  state: getDefaultState(),
  actions,
  mutations,
};

export default InstructionStore;

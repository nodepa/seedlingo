import { ActionTree, Module, MutationTree } from 'vuex';
import { InstructionsState, RootState } from './types';

const getDefaultState = (): InstructionsState => {
  return {
    isInstructionsMode: false,
  };
};

const state = getDefaultState();

const actions: ActionTree<InstructionsState, RootState> = {
  toggleInstructionsMode({ commit }) {
    commit('TOGGLE_INSTRUCTIONS_MODE');
  },
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

const mutations: MutationTree<InstructionsState> = {
  TOGGLE_INSTRUCTIONS_MODE() {
    state.isInstructionsMode = !state.isInstructionsMode;
  },
  // eslint-disable-next-line no-shadow
  RESET_STATE(state) {
    Object.assign(state, getDefaultState());
  },
};

const instructionsStore: Module<InstructionsState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
};

export default instructionsStore;

import { ActionTree, Module, MutationTree } from 'vuex';
import { InstructionsState, RootState } from './types';

const getDefaultState = (): InstructionsState => {
  return {
    isInstructionsMode: false,
    showGetInstructionsGraphic: true,
  };
};

const state = getDefaultState();

const actions: ActionTree<InstructionsState, RootState> = {
  toggleInstructionsMode({ commit }) {
    commit('TOGGLE_INSTRUCTIONS_MODE');
  },
  setShowGetInstructionsGraphic({ commit }, showGetInstructionsGraphic) {
    commit('SET_SHOW_GET_INSTRUCTIONS_GRAPHIC', showGetInstructionsGraphic);
  },
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

/* eslint-disable no-shadow */
const mutations: MutationTree<InstructionsState> = {
  TOGGLE_INSTRUCTIONS_MODE(state) {
    state.isInstructionsMode = !state.isInstructionsMode;
  },
  SET_SHOW_GET_INSTRUCTIONS_GRAPHIC(state, showGetInstructionsGraphic) {
    state.showGetInstructionsGraphic = showGetInstructionsGraphic;
  },
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

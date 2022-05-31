import { ActionTree, MutationTree, createStore, Store } from 'vuex';
import { RootState } from './StoreTypes';
import InstructionsModeStore from './InstructionsModeStore';

const getDefaultState = (): RootState => {
  return {
    version: '0.93.0',
    showContinueButton: false,
    showInstructionsExplainer: !(
      Number(localStorage.getItem('InstructionsExplainerShownCount')) > 0
    ),
  };
};

const actions: ActionTree<RootState, RootState> = {
  setShowContinueButton({ commit }, show) {
    commit('SHOW_CONTINUE_BUTTON', show);
  },
  hideInstructionsExplainer({ commit }) {
    commit('HIDE_INSTRUCTIONS_EXPLAINER');
  },
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

const mutations: MutationTree<RootState> = {
  SHOW_CONTINUE_BUTTON(state: RootState, show: boolean) {
    state.showContinueButton = show;
  },
  HIDE_INSTRUCTIONS_EXPLAINER(state: RootState) {
    const shownCount =
      Number(localStorage.getItem('InstructionsExplainerShownCount')) || 0;
    localStorage.setItem(
      'InstructionsExplainerShownCount',
      `${shownCount + 1}`,
    );
    state.showInstructionsExplainer = false;
  },
  RESET_STATE(state) {
    Object.assign(state, getDefaultState());
    RootStore.dispatch('instructionsModeStore/resetState');
  },
};

const RootStore: Store<RootState> = createStore({
  strict: process.env.NODE_ENV !== 'production',
  state: getDefaultState(),
  actions,
  mutations,
  modules: {
    instructionsModeStore: InstructionsModeStore,
  },
});

export default RootStore;

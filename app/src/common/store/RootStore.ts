import { ActionTree, MutationTree, createStore, Store } from 'vuex';
import { RootState } from './StoreTypes';
import InstructionsModeStore from './InstructionsModeStore';

const getDefaultState = (): RootState => {
  return {
    version: '1.0.0',
    showContinueButton: false,
    showInstructionsExplainer: !(
      Number(localStorage.getItem('InstructionsExplainerShownCount')) > 4
    ),
  };
};

const actions: ActionTree<RootState, RootState> = {
  setShowContinueButton({ commit }, show) {
    commit('SHOW_CONTINUE_BUTTON', show);
  },
  setShowInstructionsExplainer({ commit }, showInstructionsExplainer) {
    commit('SET_SHOW_INSTRUCTIONS_EXPLAINER', showInstructionsExplainer);
  },
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

const mutations: MutationTree<RootState> = {
  SHOW_CONTINUE_BUTTON(state: RootState, show: boolean) {
    state.showContinueButton = show;
  },
  SET_SHOW_INSTRUCTIONS_EXPLAINER(
    state: RootState,
    showInstructionsExplainer: boolean,
  ) {
    const shownCount =
      Number(localStorage.getItem('InstructionsExplainerShownCount')) || 0;
    localStorage.setItem(
      'InstructionsExplainerShownCount',
      `${shownCount + 1}`,
    );
    state.showInstructionsExplainer = showInstructionsExplainer;
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

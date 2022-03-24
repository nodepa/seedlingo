import { ActionTree, MutationTree, createStore, Store } from 'vuex';
import { RootState } from './StoreTypes';
import InstructionStore from './InstructionStore';

const getDefaultState = (): RootState => {
  return {
    version: '1.0.0',
    showContinueButton: false,
    showInstructionExplainer: !(
      Number(localStorage.getItem('InstructionExplainerShownCount')) > 4
    ),
  };
};

const actions: ActionTree<RootState, RootState> = {
  setShowContinueButton({ commit }, show) {
    commit('SHOW_CONTINUE_BUTTON', show);
  },
  setShowInstructionExplainer({ commit }, showInstructionExplainer) {
    commit('SET_SHOW_INSTRUCTION_EXPLAINER', showInstructionExplainer);
  },
  resetState({ commit }) {
    commit('RESET_STATE');
  },
};

const mutations: MutationTree<RootState> = {
  SHOW_CONTINUE_BUTTON(state: RootState, show: boolean) {
    state.showContinueButton = show;
  },
  SET_SHOW_INSTRUCTION_EXPLAINER(
    state: RootState,
    showInstructionExplainer: boolean,
  ) {
    const shownCount =
      Number(localStorage.getItem('InstructionExplainerShownCount')) || 0;
    localStorage.setItem('InstructionExplainerShownCount', `${shownCount + 1}`);
    state.showInstructionExplainer = showInstructionExplainer;
  },
  RESET_STATE(state) {
    Object.assign(state, getDefaultState());
    RootStore.dispatch('instructionStore/resetState');
  },
};

const RootStore: Store<RootState> = createStore({
  strict: process.env.NODE_ENV !== 'production',
  state: getDefaultState(),
  actions,
  mutations,
  modules: {
    instructionStore: InstructionStore,
  },
});

export default RootStore;

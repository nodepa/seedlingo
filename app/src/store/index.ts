import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import { RootState } from './types';
import instructionsStore from './InstructionsStore';

Vue.use(Vuex);

const rootStore: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  state: {
    version: '1.0.0',
    showContinueButton: false,
  },
  mutations: {
    showContinueButton(state, show: boolean) {
      state.showContinueButton = show;
    },
  },
  actions: {},
  modules: {
    instructionsStore,
  },
};

export default new Vuex.Store(rootStore);

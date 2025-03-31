<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  useIonRouter,
} from '@ionic/vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import Content from '@/Content/Content';
import AudioProvider from '@/Content/AudioProvider';

const route = useRoute();
const ionRouter = useIonRouter();
const store = useStore();

const unitIndex = +route.params.unitIndex;

const words = Content.UnitsMeta[unitIndex].newWords;
const lastWordIndex = words.length - 1;
let currentWordIndex = 0;
const word = ref(words[currentWordIndex]);
const audio = ref(
  AudioProvider.createAudioFromPath(word.value.audio as string),
);

watch(
  () => audio.value.playing,
  (playing) => {
    if (!playing) {
      store.dispatch('setShowContinueButton', true);
    }
  },
);
watch(word, () => {
  audio.value = AudioProvider.createAudioFromPath(word.value.audio as string);
  audio.value.play();
});
watch(
  () => store.state.showContinueButton,
  (show: boolean) => {
    if (!show) {
      if (currentWordIndex >= lastWordIndex) {
        ionRouter.navigate({ name: 'Home' }, 'root', 'replace');
      } else {
        currentWordIndex += 1;
        word.value = words[currentWordIndex];
      }
    }
  },
);
onMounted(() => {
  audio.value.play();
});
</script>

<template>
  <ion-page>
    <ion-grid fixed style="padding: 0rem">
      <ion-row
        class="ion-justify-content-center ion-align-items-center"
        style="height: 100%"
      >
        <ion-col size="10">
          <ion-card
            style="
              display: flex;
              flex: 1;
              flex-direction: column;
              justify-content: center;
              margin: 0rem;
            "
          >
            <ion-card-header v-if="word.picture && word.picture.length > 0">
              <img
                data-test="review-picture"
                :src="Content.getPicPath(word.picture)"
                style="
                  max-height: calc(
                    100vh - 6.625rem - 6rem - 1.25rem - 2.25rem - 1rem
                  );
                  object-fit: contain;
                "
              />
            </ion-card-header>
            <ion-card-header
              v-else-if="word.symbol && word.symbol.length > 0"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <span>
                <ion-icon
                  v-for="(icon, iconIndex) in word.symbol"
                  :key="iconIndex"
                  data-test="review-icon"
                  :icon="Content.getIcon(icon)"
                  style="font-size: 4rem"
                />
              </span>
            </ion-card-header>
            <ion-card-content style="display: flex; flex: 1">
              <ExerciseButton
                data-test="review-word"
                :playing="audio.playing"
                color="primary"
                :style="{
                  width: '100%',
                  height: 'auto',
                  minHeight: '6rem',
                  'font-size':
                    'clamp(1rem,' +
                    (4.15 - word.word.length * 0.15) +
                    'rem, 4rem)',
                  '--padding-top': '0.5rem',
                  '--padding-bottom': '0.5rem',
                  '--padding-start': '0.5rem',
                  '--padding-end': '0.5rem',
                }"
                @click="audio.play()"
              >
                <span style="white-space: break-spaces">
                  {{ word.word }}
                </span>
              </ExerciseButton>
            </ion-card-content>
          </ion-card>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-page>
</template>

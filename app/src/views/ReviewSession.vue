<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  useIonRouter,
} from '@ionic/vue';
import ExerciseButton from '../common/components/ExerciseButton.vue';
import Content from '../Lessons/Content';
import ExerciseProvider from '../Lessons/ExerciseProvider';
// import { earOutline } from 'ionicons/icons';

const route = useRoute();
const ionRouter = useIonRouter();
const store = useStore();

const lessonIndex = +route.params.lessonIndex;

const words = Content.LessonsMeta[lessonIndex].newWords;
const lastWordIndex = words.length - 1;
let currentWordIndex = 0;
const word = ref(words[currentWordIndex]);
const audio = ref(
  ExerciseProvider.createAudio(Content.getAudioData(word.value.audio || '')),
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
  audio.value = ExerciseProvider.createAudio(
    Content.getAudioData(word.value.audio || ''),
  );
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
    <ion-grid
      fixed
      style="
        height: 100%;
        padding: 0rem;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <ion-card
        style="
          display: flex;
          flex: 1;
          flex-direction: column;
          justify-content: center;
          margin: 0rem 0.8rem;
          max-height: calc(100% - 1.6rem);
        "
      >
        <ion-card-header
          v-if="word.picture && word.picture.length > 0"
          style="
            min-height: 0%;
            min-width: 0%;
            display: flex;
            justify-content: center;
          "
        >
          <img
            :src="Content.getPicPath(word.picture)"
            style="object-fit: contain; max-height: 100%"
          />
        </ion-card-header>
        <ion-card-header
          v-else-if="word.symbol && word.symbol.length > 0"
          style="display: flex; justify-content: center; align-items: center"
        >
          <ion-icon
            v-for="(icon, iconIndex) in word.symbol"
            :key="iconIndex"
            data-test="review-icon"
            :icon="Content.getIcon(icon)"
            style="font-size: 4rem"
          />
        </ion-card-header>
        <ion-card-content style="display: flex; flex: 1">
          <ExerciseButton
            data-test="review-word"
            :playing="audio.playing"
            color="primary"
            style="
              width: 100%;
              height: auto;
              min-height: 6rem;
              font-size: 3rem;
              --padding-top: 0.5rem;
              --padding-bottom: 0.5rem;
              --padding-start: 0.5rem;
              --padding-end: 0.5rem;
            "
            @click="audio.play()"
          >
            <span style="white-space: break-spaces">
              {{ word.word }}
            </span>
          </ExerciseButton>
        </ion-card-content>
      </ion-card>
    </ion-grid>
  </ion-page>
</template>

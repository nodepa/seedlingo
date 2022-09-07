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
  ExerciseProvider.createAudio(Content.getAudioPath(word.value.audio || '')),
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
    Content.getAudioPath(word.value.audio || ''),
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
    <ion-grid fixed>
      <ion-row
        class="ion-justify-content-center ion-align-items-center"
        style="height: 100%"
      >
        <ion-col size="10">
          <ion-card color="card">
            <ion-card-header>
              <ion-card-title
                data-test="review-icon"
                class="center-content align-vertical"
              >
                <img
                  v-if="word.picture && word.picture.length > 0"
                  :src="Content.getPicPath(word.picture)"
                />
                <template v-else-if="word.symbol && word.symbol.length > 0">
                  <ion-icon
                    v-for="(icon, iconIndex) in word.symbol"
                    :key="iconIndex"
                    :icon="Content.getIcon(icon)"
                  />
                </template>
                <!-- <ion-icon v-else :icon="earOutline" /> -->
              </ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ExerciseButton
                data-test="review-word"
                :playing="audio.playing"
                color="primary"
                style="width: 100%; height: 10rem; font-size: 3rem"
                @click="audio.play()"
              >
                <span>
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

<style scoped>
.center-content {
  display: flex;
  justify-content: center;
}
.align-vertical {
  align-items: center;
}
ion-icon {
  font-size: 4rem;
}
img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>

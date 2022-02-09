<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ContentSpec from '../ContentSpec';
import { LessonMenuItems } from '../LessonMenuTypes';

const lessons = ref<LessonMenuItems | null>(null);
onMounted(() => {
  lessons.value = ContentSpec.getLessonsMenu();
});
</script>

<template>
  <v-list flat rounded data-test="lessons-list">
    <v-list-item v-for="(lesson, order) in lessons" :key="order">
      <v-col cols="6" offset="3">
        <v-btn
          v-instruction="lesson.audio"
          class="pa-5 text-h4 text-sm-h2 rounded-xl"
          :data-test="`lesson-button-${String(order).padStart(2, '0')}`"
          block
          elevation="5"
          height="100%"
          color="primary"
          :to="{ path: `/lesson/${order}` }"
        >
          <span class="text-secondary">{{ order }}</span>
          <v-icon size="large" class="pl-1 pl-sm-6" :icon="lesson.icon" />
        </v-btn>
      </v-col>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
interface Props {
  currentStage: number;
  stages: { [key: string]: number };
}
defineProps<Props>();
</script>
<template>
  <div
    style="
      position: absolute;
      z-index: 1;
      top: 0px;
      left: 0px;
      right: 0px;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      margin: 10px;
      padding: 5px;
      padding-inline: 6px;
      border-radius: 25px;
      background-color: var(--ion-color-step-250);
    "
  >
    <span
      style="
        width: 15px;
        height: 15px;

        border-radius: 100%;
        background-color: var(--ion-color-primary);
      "
    ></span>

    <template v-for="(stage, index) in stages" :key="index">
      <span
        :style="`
          flex-grow: 1;
          height: 3px;
          background-color: var(--ion-color-primary${
            currentStage <= stages[index] ? '-contrast' : ''
          });
        `"
      ></span>
      <span
        :style="`
            width: 15px;
            height: 15px;
            border-radius: 100%;
            background-color: var(--ion-color-primary${
              currentStage <= stages[index] ? '-contrast' : ''
            });
          `"
      ></span>
    </template>
  </div>
</template>

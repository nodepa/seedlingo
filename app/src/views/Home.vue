<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <Lessons />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Lessons from '@/Lessons/components/Lessons.vue';

@Component({
  // eslint-disable-next-line no-undef
  components: {
    Lessons,
  },
})
export default class Home extends Vue {}
</script>

<style lang="stylus" scoped></style>

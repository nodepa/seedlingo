<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <Lessons />
        <Footer />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Lessons from '@/Lessons/components/Lessons.vue';
import Footer from '@/Footer/components/Footer.vue';

@Component({
  components: {
    Lessons,
    Footer,
  },
})
export default class Home extends Vue {}
</script>

<style lang="stylus" scoped></style>

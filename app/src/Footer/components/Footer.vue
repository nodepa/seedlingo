<template>
  <v-footer color="transparent" class="mt-12">
    <v-row justify="center">
      <v-btn text outlined color="primary" to="/privacy">Privacy policy</v-btn>
      <v-col cols="12">
        &copy; 2019-21<br />
        <a target="_blank" href="https://liaieducation.com">
          Li Ai Education
        </a>
        <br />
        <a target="_blank" href="https://nodepa.org">
          Norwegian Development Partners
        </a>
        <br />
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Footer extends Vue {}
</script>

<template>
  <component :is="$route.params.id === '1' ? 'MultipleChoice' : 'Matching'" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MultipleChoice from '@/MultipleChoice/components/MultipleChoice.vue';
import Matching from '@/Matching/components/Matching.vue';

@Component({
  components: {
    MultipleChoice,
    Matching,
  },
})
export default class Session extends Vue {
  // eslint-disable-next-line class-methods-use-this
  mounted() {
    console.log('mounted the session wrapper');
  }
}
</script>

<style lang="stylus" scoped></style>

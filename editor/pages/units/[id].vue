<template>
  <UCard>
    <template #header>
      <UInput v-if="unit != undefined" type="text" variant="ghost"
        class="-mx-2 rounded-md *:focus:outline-solid *:focus:outline-(--ui-primary)"
        @blur="() => commit('name')"
        @keydown="($event: KeyboardEvent) => $event.key === 'Enter' && commit('name')"
        :loading="unit.waitsOn?.name" trailing v-model="unit.name" />
    </template>
    <UTextarea v-if="unit" type="text" variant="ghost"
      class="w-full text-start rounded-md -mx-2 *:focus:outline-solid *:focus:outline-(--ui-primary)"
      autoresize :rows="1" :maxrows="8" @blur="() => commit('description')"
      @keydown="($event: KeyboardEvent) => $event.ctrlKey && $event.key === 'Enter' && commit('description')"
      :loading="unit.waitsOn?.description" trailing
      v-model="unit.description" />
    <UIcon :name="unit?.icon || 'noto-unknown-flag'"
      class="p-0 m-0 w-[10rem] h-[10rem] block" />
    <template #footer>
      <p>Unit id: {{ id }}</p>
      <p>Created at: {{ unit?.createdAt ? new
        Date(unit.createdAt).toLocaleString() : 'missing' }}</p>
      <p>Updated at: {{ unit?.updatedAt ? new
        Date(unit.updatedAt).toLocaleString() : 'missing' }}</p>
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { DynamicUnit, UnitWritable } from '~/types/UnitTypes';

const route = useRoute();
const id = route.params.id;

const units = useState<Array<DynamicUnit>>('units');
const unit = computed(() => units.value.find((unit) => unit.id === id));

const commit = (property: UnitWritable) => {
  if (!unit.value) return;
  unit.value.waitsOn = { ...unit.value.waitsOn, [property]: true };
  setTimeout(() => {
    if (unit.value) {
      unit.value.waitsOn = { ...unit.value.waitsOn, [property]: false };
    }
  }, 1000);
};
</script>
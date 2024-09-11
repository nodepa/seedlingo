<template>
  <UModal title='Add new unit' description="Describe the unit"
    v-model:open="showUnitForm">
    <UButton :icon="isAddMode ? 'lucide:plus' : 'lucide:edit'"
      :color="isAddMode ? 'primary' : 'neutral'" class="self-center">
      {{ isAddMode ? 'Add new unit' : 'Edit' }}
    </UButton>
    <template #body>
      <UForm :schema="UnitSchema" :state="state" @submit="emitUpdateUnit">
        <UFormField label="Name" required name="name" hint="required">
          <UInput v-model="state.name" />
        </UFormField>
        <UFormField label="Description" name="description" hint="optional">
          <UTextarea v-model="state.description" :autoresize="true" :maxrows="8"
            class="mb-4 w-full" />
        </UFormField>

        <div class="flex justify-end space-x-2">
          <UButton type="submit"
            :icon="isAddMode ? 'lucide:plus' : 'lucide:save'" color="primary">
            {{ isAddMode ? 'Add unit' : 'Update' }}
          </UButton>
          <UButton icon="lucide:rotate-ccw" color="neutral"
            @click="showUnitForm = false">
            Cancel
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import * as v from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = withDefaults(defineProps<{
  isAddMode?: boolean;
  unitData?: { id: string, name: string, description?: string, icon?: string };
}>(), {
  isAddMode: false,
  unitData: () => ({ id: '', name: '' })
});

// const showUnitForm = defineModel('showUnitForm', { default: false });
const showUnitForm = ref(false);
const emit = defineEmits(['updateUnit']);

const UnitSchema = v.object({
  id: v.optional(v.string()),
  name: v.pipe(v.string(), v.nonEmpty('Please enter a name for the unit')),
  description: v.optional(v.string()),
  icon: v.optional(v.string()),
});
type UnitType = v.InferOutput<typeof UnitSchema>;

const state = reactive<Partial<UnitType>>(props.unitData || {});

const emitUpdateUnit = async (event: FormSubmitEvent<UnitType>) => {
  emit('updateUnit', event.data);
  showUnitForm.value = false;
};

</script>
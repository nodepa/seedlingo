<template>
  <UModal title='Add new module' description="Describe the module"
    v-model:open="showModuleForm">
    <UButton :icon="isAddMode ? 'lucide:plus' : 'lucide:edit'"
      :color="isAddMode ? 'primary' : 'neutral'" class="self-center">
      {{ isAddMode ? 'Add new module' : 'Edit' }}
    </UButton>
    <template #body>
      <UForm :schema="ModuleSchema" :state="state" @submit="emitUpdateModule">
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
            {{ isAddMode ? 'Add module' : 'Update' }}
          </UButton>
          <UButton icon="lucide:rotate-ccw" color="neutral"
            @click="showModuleForm = false">
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
  moduleData?: { id?: string, name?: string, description?: string, icon?: string };
}>(), {
  isAddMode: false,
  moduleData: () => ({ name: '' })
});

// const showModuleForm = defineModel('showModuleForm', { default: false });
const showModuleForm = ref(false);
const emit = defineEmits(['updateModule']);

const ModuleSchema = v.object({
  id: v.optional(v.string()),
  name: v.pipe(v.string(), v.nonEmpty('Please enter a name for the module')),
  description: v.optional(v.string()),
  icon: v.optional(v.string()),
});
type ModuleType = v.InferOutput<typeof ModuleSchema>;

const state = reactive<Partial<ModuleType>>(props.moduleData || {});

const emitUpdateModule = async (event: FormSubmitEvent<ModuleType>) => {
  emit('updateModule', event.data);
  showModuleForm.value = false;
};

</script>
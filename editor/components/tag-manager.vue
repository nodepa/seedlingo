<template>
  <div class="px-4 py-3 border-b border-default">
    <div class="flex items-center gap-2 mb-2">
      <UButton
        :icon="isExpanded ? 'lucide:chevron-down' : 'lucide:chevron-right'"
        color="neutral"
        variant="ghost"
        size="xs"
        @click="isExpanded = !isExpanded"
      />
      <span class="text-sm font-semibold text-muted">Manage Tags</span>
      <UBadge
        v-if="tagsState.length > 0"
        :label="String(tagsState.length)"
        color="neutral"
        variant="subtle"
        size="xs"
      />
    </div>

    <div v-if="isExpanded" class="space-y-2">
      <p v-if="!tagModelAvailable" class="text-sm text-muted italic">
        Tag features require a backend deployment. Run
        <code class="font-mono bg-elevated px-1 rounded">npx ampx sandbox</code>
        to enable.
      </p>
      <template v-else>
        <ul class="flex flex-wrap gap-2">
          <li
            v-for="tag in tagsState"
            :key="tag.id"
            class="flex items-center gap-1 bg-elevated rounded-full px-3 py-1"
          >
            <UInput
              v-if="tag.inEditMode"
              v-model="tag.name"
              size="xs"
              variant="ghost"
              class="w-28 -mx-1"
              @blur="() => saveTagName(tag)"
              @keydown.enter="() => saveTagName(tag)"
              @keydown.escape="() => cancelEdit(tag)"
            />
            <span v-else class="text-sm">{{ tag.name }}</span>
            <UButton
              v-if="!tag.inEditMode"
              icon="lucide:pencil"
              color="neutral"
              variant="ghost"
              size="xs"
              class="opacity-60 hover:opacity-100"
              @click="() => startEdit(tag)"
            />
            <UButton
              icon="lucide:x"
              color="neutral"
              variant="ghost"
              size="xs"
              class="opacity-60 hover:opacity-100 hover:text-error"
              :loading="tag.isWaiting"
              @click="() => deleteTag(tag)"
            />
          </li>
        </ul>

        <div class="flex gap-2 items-center">
          <UInput
            v-model="newTagName"
            placeholder="New tag…"
            size="sm"
            class="w-48"
            @keydown.enter="addTag"
          />
          <UButton
            icon="lucide:plus"
            color="primary"
            size="sm"
            :disabled="!newTagName.trim()"
            :loading="isCreating"
            @click="addTag"
          >
            Add tag
          </UButton>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import type { DynamicTag } from '~/types/WordTypes';

const toast = useToast();
const client = generateClient<Schema>({ authMode: 'userPool' });

const isExpanded = ref(false);
const newTagName = ref('');
const isCreating = ref(false);
const tagsState = ref<DynamicTag[]>([]);
const tagModelAvailable = ref(false);

watchEffect(() => {
  try {
    client.models.Tag.observeQuery().subscribe({
      next: ({ items }) => {
        tagModelAvailable.value = true;
        tagsState.value = items.map((item) => ({
          ...item,
          inEditMode:
            tagsState.value.find((t: DynamicTag) => t.id === item.id)
              ?.inEditMode ?? false,
          isWaiting: false,
        })) as DynamicTag[];
      },
      error: (err) => console.error('Error observing tags:', err),
    });
  } catch {
    console.warn(
      'Tag model unavailable. Redeploy the Amplify backend (`npx ampx sandbox`) to enable tagging.',
    );
  }
});

const startEdit = (tag: DynamicTag) => {
  tag.inEditMode = true;
  nextTick(() => {
    const input = document.querySelector<HTMLInputElement>(`li input`);
    input?.focus();
  });
};

const cancelEdit = (tag: DynamicTag) => {
  tag.inEditMode = false;
};

const saveTagName = async (tag: DynamicTag) => {
  tag.inEditMode = false;
  if (!tagModelAvailable.value) return;
  const name = tag.name.trim();
  if (!name) return;
  tag.isWaiting = true;
  const { errors } = await client.models.Tag.update({ id: tag.id, name });
  tag.isWaiting = false;
  if (errors) {
    toast.add({
      title: 'Error',
      description: 'Failed to update tag',
      color: 'error',
    });
  } else {
    toast.add({
      title: 'Success',
      description: 'Tag updated',
      color: 'success',
    });
  }
};

const deleteTag = async (tag: DynamicTag) => {
  if (!tagModelAvailable.value) return;
  tag.isWaiting = true;
  const { errors } = await client.models.Tag.delete({ id: tag.id });
  tag.isWaiting = false;
  if (errors) {
    toast.add({
      title: 'Error',
      description: 'Failed to delete tag',
      color: 'error',
    });
  } else {
    toast.add({
      title: 'Success',
      description: 'Tag deleted',
      color: 'success',
    });
  }
};

const addTag = async () => {
  if (!tagModelAvailable.value) return;
  const name = newTagName.value.trim();
  if (!name) return;
  isCreating.value = true;
  const { errors } = await client.models.Tag.create({ name });
  isCreating.value = false;
  if (errors) {
    toast.add({
      title: 'Error',
      description: 'Failed to create tag',
      color: 'error',
    });
  } else {
    toast.add({
      title: 'Success',
      description: `Tag "${name}" created`,
      color: 'success',
    });
    newTagName.value = '';
  }
};
</script>

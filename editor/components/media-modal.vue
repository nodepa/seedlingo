<template>
  <UModal :title="props.title" :description="props.description" close
    v-model:open="showMediaModal" :ui="{ content: '!max-w-4xl' }">

    <slot />
    <template #body>

      <FilePicker @files-added="filesAdded" v-slot="{ handleClick }">
        <UButton @click="handleClick" icon="lucide:plus" color="primary"
          class="w-40">
          Upload picture
        </UButton>
      </FilePicker>

      <div class="flex justify-items-start flex-wrap gap-2">
        <div>
          <p class="block">Text search</p>
          <UInput type="search" icon="lucide:search" placeholder="Search..."
            v-model="mediaFilter" />
        </div>
        <div>
          <p class="block">Modules</p>
          <USelectMenu placeholder="Select module(s)" v-model="moduleFilter"
            :items="moduleNames" multiple :search-input="{
              placeholder: 'Filter...',
              icon: 'lucide:search',
            }" class="w-48" />
        </div>
        <div>
          <p class="block">Units</p>
          <USelectMenu placeholder="Select unit(s)" v-model="unitFilter"
            :items="unitNames" multiple :search-input="{
              placeholder: 'Filter...',
              icon: 'lucide:search',
            }" class="w-48" />
        </div>
      </div>

      <div
        class="my-6 flex flex-wrap justify-center gap-3  overflow-scroll min-h-80 h-[40vh]">
        <div v-for="file in mediaFiles"
          class="relative flex justify-center items-center">
          <UDropdownMenu
            :items="[{ label: 'Edit', icon: 'i-lucide-edit' }, { label: 'Delete', icon: 'i-lucide-delete' },]"
            class="absolute z-12 top-2 right-2">
            <UButton icon="i-lucide-menu" />
          </UDropdownMenu>
          <figure>
            <NuxtImg src="stairs.jpg" alt="Three students walking up stairs"
              class="w-40 h-28 rounded-md object-cover" />
            <figcaption class="w-40">
              <div class="">
                <p class="font-bold">
                  PicName {{ file }} {{ file.state?.progress || 100 }}%
                </p>
              </div>
              <p class="text-sm text-(--ui-text-muted)">
                A full text description. Some tags: #nature, #landscape,
                #mountain
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <UButton type="submit" color="primary">
          <UIcon v-if="isAddMode" name="material-symbols-add" />
          {{ isAddMode ? 'Add module' : 'Update' }}
        </UButton>
        <UButton color="neutral" @click="showMediaModal = false">
          Cancel
        </UButton>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { downloadData, uploadData } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import { resizeImage } from '~/helper/resize-image';

const session = await fetchAuthSession();

// List from 1 to 40
const mediaFiles = reactive([...Array(40).keys()].map(i => i + 1));


const mediaFilter = ref('');
const moduleNames = ref(['Intro 1', 'Intro 2', 'Intermediary 1', 'Intermediary 2', 'Advanced']);
const moduleFilter = ref([]);
const unitNames = ref(['Numbers 1-10', 'Numbers 11-100', 'Family relations 1', 'Family relations 2', 'Employment']);
const unitFilter = ref([]);

const props = withDefaults(defineProps<{
  isAddMode?: boolean;
  title?: string;
  description?: string;
}>(), { isAddMode: false });

const showMediaModal = ref(false);

const filesAdded = ({ files: uploadFiles }: { files: Array<File> }) => {
  console.log('Files available for upload', uploadFiles);

  uploadFiles.forEach(async (file) => {
    try {
      // Resize the image before uploading
      const resizedFile = await resizeImage(file, 0.5); // Max 0.5MB

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        console.log('File read completed', fileReader.result);
        console.log('Original size:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
        console.log('Resized size:', (resizedFile.size / 1024 / 1024).toFixed(2) + 'MB');

        if (fileReader.result) {
          const fileMeta = {
            name: file.name,
            state: { fileReader, progress: 0 },
            originalSize: file.size,
            resizedSize: resizedFile.size
          };
          mediaFiles.push(fileMeta);

          try {
            const result = await uploadData({
              path: `word-pictures/${session.identityId}/${file.name}`,
              data: fileReader.result,
              options: {
                onProgress: ({ transferredBytes, totalBytes }) => {
                  if (totalBytes) {
                    console.log('Progress:', transferredBytes, totalBytes);
                    fileMeta.state.progress = Math.round(transferredBytes / totalBytes * 100);
                  }
                },
              }
            }).result;
            console.log('result', result);
          } catch (e) {
            console.error('error', e);
          }
        }
      };

      fileReader.onerror = (e) => {
        console.error('File read error', e);
      };

      fileReader.readAsArrayBuffer(resizedFile); // Read the resized file
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  });
};

</script>
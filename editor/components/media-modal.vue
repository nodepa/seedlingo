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
        class="my-6 flex flex-wrap justify-center gap-3 overflow-scroll min-h-60 h-[40vh]">
        <figure v-for="(file, index) in mediaFiles" :key="index"
          class="relative flex flex-col justify-start bg-(--ui-bg-elevated) rounded-md">
          <UDropdownMenu
            :items="[{ label: 'Edit', icon: 'i-lucide-edit' }, { label: 'Delete', icon: 'i-lucide-delete' },]"
            class="absolute z-12 top-2 right-2">
            <UButton icon="i-lucide-menu" />
          </UDropdownMenu>

          <!-- Image container with progress overlay -->
          <div class="relative w-40 h-28">
            <!-- Progress overlay -->
            <div v-if="file.state.isLoading"
              class="absolute inset-0 flex items-center justify-center bg-(--ui-bg-inverted) opacity-30 rounded-md z-10">
              <UProgress v-model="file.state.progress" :max="100" status
                color="primary" class="w-[80%]" />
            </div>

            <!-- Error overlay -->
            <div v-if="file.state.error"
              class="absolute inset-0 flex items-center justify-center bg-(--ui-error) opacity-50 rounded-md z-10">
              <UIcon name="i-lucide-alert-triangle"
                class="text-white text-xl" />
            </div>

            <!-- Placeholder or Image -->
            <div v-if="!file.data"
              class="w-40 h-28 rounded-md bg-gray-500 animate-pulse"></div>
            <NuxtImg v-else :src="file.data" :alt="file.name"
              class="w-40 h-28 rounded-md object-cover" />
          </div>

          <figcaption class="w-40 px-2 pb-2">
            <div class="">
              <p class="font-bold">
                {{ file.name }}
              </p>
              <p class="text-sm">
                {{ Math.round(file.size / 1024) }} kb
              </p>
            </div>
            <p class="text-sm text-(--ui-text-muted)">
              {{ file.state.isLoading ? 'Loading...' :
                (file.state.error ? "Error loading image" : "")
              }}
            </p>
          </figcaption>
        </figure>
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
import { downloadData, list, uploadData } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import { resizeImage } from '~/helper/resize-image';

const blobToBase64 = async (blob: Blob) => {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
}
const session = await fetchAuthSession();

type MediaFile = {
  name: string;
  data: Base64URLString | null;
  state: {
    progress: number;
    isLoading: boolean;
    error: boolean;
  };
  size: number;
  lastModified: number;
  path?: string;
};

const mediaFiles = reactive([] as MediaFile[]);

const fetchMediaFiles = async () => {
  try {
    const pictureList = (await list({
      path: `word-pictures/${session.identityId}/`,
      options: {
        subpathStrategy: { strategy: 'exclude' }
      }
    })).items;

    // Reset mediaFiles with reactivity
    mediaFiles.splice(0, mediaFiles.length);

    // First create placeholder objects for each file
    pictureList.forEach(picture => {
      mediaFiles.push({
        name: picture.path.split('/').pop() || '',
        data: null, // No data yet
        state: {
          progress: 0,
          isLoading: true,
          error: false
        },
        size: picture.size || 0,
        lastModified: picture.lastModified ? picture.lastModified.getTime() : 0,
        path: picture.path
      });
    });

    // Now start downloading each file
    pictureList.forEach(async (picture, index) => {
      try {
        const pictureFile = await downloadData({
          path: picture.path,
          options: {
            onProgress: (progress) => {
              if (progress.totalBytes) {
                const percentage = Math.round(progress.transferredBytes / progress.totalBytes * 100);
                console.log(mediaFiles[index].name, percentage); //assume lists in sync
                // Update the progress for this specific file
                mediaFiles[index].state.progress = percentage;
              }
            }
          }
        }).result;

        const blob = await blobToBase64(await (await pictureFile.body).blob());

        // Update the file with the actual data
        mediaFiles[index].data = blob as Base64URLString;
        mediaFiles[index].state.isLoading = false;
        mediaFiles[index].state.progress = 100;
      } catch (error) {
        console.error('Error fetching picture:', error);
        mediaFiles[index].state.isLoading = false;
        mediaFiles[index].state.error = true;
      }
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
  }
};

fetchMediaFiles();

watch(mediaFiles, (newFiles) => {
  console.log('mediaFiles updated:', newFiles.length);
}, { deep: true });

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

      // Create a placeholder in the mediaFiles array
      const newIndex = mediaFiles.length;
      mediaFiles.push({
        name: file.name,
        data: null, // No data yet
        state: {
          progress: 0,
          isLoading: true,
          error: false
        },
        size: resizedFile.size,
        lastModified: Date.now(),
      });

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        if (fileReader.result) {
          try {
            // Show upload progress
            const result = await uploadData({
              path: `word-pictures/${session.identityId}/${file.name}`,
              data: fileReader.result,
              options: {
                onProgress: ({ transferredBytes, totalBytes }) => {
                  if (totalBytes) {
                    const percentage = Math.round(transferredBytes / totalBytes * 100);
                    console.log(mediaFiles[newIndex].name, percentage); //assume lists in sync
                    mediaFiles[newIndex].state.progress = percentage;
                  }
                },
              }
            }).result;

            console.log('Upload result', result);

            // Now we need to get the file data for display
            const pictureFile = await downloadData({
              path: `word-pictures/${session.identityId}/${file.name}`
            }).result;

            const blob = await blobToBase64(await (await pictureFile.body).blob());

            // Update with the actual data
            mediaFiles[newIndex].data = blob as Base64URLString;
            mediaFiles[newIndex].state.isLoading = false;
            mediaFiles[newIndex].state.progress = 100;

          } catch (e) {
            console.error('error', e);
            mediaFiles[newIndex].state.isLoading = false;
            mediaFiles[newIndex].state.error = true;
          }
        }
      };

      fileReader.onerror = (e) => {
        console.error('File read error', e);
        mediaFiles[newIndex].state.isLoading = false;
        mediaFiles[newIndex].state.error = true;
      };

      fileReader.readAsArrayBuffer(resizedFile);
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  });
};
</script>
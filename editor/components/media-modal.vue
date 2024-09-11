<template>
  <UModal :title="props.title" :description="props.description"
    v-model:open="showMediaModal" close :ui="{ content: '!max-w-4xl' }">

    <slot />
    <template #body>
      <FilePicker :media-type="mediaType" @files-added="filesAdded"
        v-slot="{ handleClick }" class="mt-0 mb-4">
        <UButton @click="handleClick" icon="lucide:plus" color="primary"
          class="w-40">
          Upload {{ mediaType === 'pictures' ? 'picture' : 'audio' }}
        </UButton>
      </FilePicker>

      <!-- <div class="flex justify-items-start flex-wrap gap-2">
        <div>
          <p class="block">Filter by</p>
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
      </div> -->

      <div
        class="my-6 p-2 flex flex-wrap justify-start items-start gap-2 overflow-scroll min-h-60 h-[40vh] bg-(--ui-bg-elevated) rounded-md">

        <!-- Media items -->
        <div v-for="(file, index) in library[mediaType]" :key="index"
          class="relative flex flex-col justify-start bg-(--ui-bg) rounded-md hover:outline-4 hover:outline-(--ui-border-accented) hover:cursor-pointer"
          :class="{ 'outline-4 hover:outline-4 outline-(--ui-primary) hover:outline-(--ui-primary)': (locallySelected === file.name) }"
          @click="updateSelection(file.name)">
          <UDropdownMenu
            :items="[{ label: 'Edit', icon: 'lucide:edit' }, { label: 'Delete', icon: 'lucide:trash-2' },]"
            class="absolute z-12 top-19.5 right-0.5">
            <UButton icon="lucide:menu" color="neutral"
              class="rounded-full opacity-60 hover:opacity-100 hover:bg-(--ui-primary)" />
          </UDropdownMenu>

          <!-- Image container with progress overlay -->
          <div class="relative w-40">
            <!-- Progress overlay -->
            <div v-if="file.state.isLoading"
              class="absolute inset-0 flex items-center justify-center bg-(--ui-bg-inverted) opacity-30 rounded-md z-10">
              <UProgress v-model="file.state.progress" :max="100" status
                color="primary" class="w-[80%]" />
            </div>

            <!-- Error overlay -->
            <div v-if="file.state.error"
              class="absolute inset-0 flex items-center justify-center bg-(--ui-error) opacity-50 rounded-md z-10">
              <UIcon name="lucide:alert-triangle" class="text-white text-xl" />
            </div>

            <!-- Placeholder or media -->
            <div v-if="!file.data"
              class="w-40 h-28 rounded-md bg-gray-500 animate-pulse"></div>
            <NuxtImg v-else-if="mediaType === 'pictures'" :src="file.data"
              :alt="file.name" class="w-40 h-28 rounded-md object-cover" />
            <template v-else>
              <UIcon name="lucide:audio-lines" color="primary"
                class="w-40 h-26.5 text-(--ui-primary)" />
              <audio controls preload="auto" class="w-40 h-10 inline rounded-md"
                :alt="file.name" :src="file.data">
                Your browser does not support the audio element.
              </audio>
            </template>
          </div>

          <div class="w-40 px-2 pb-2">
            <div>
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
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <UButton type="submit" icon="lucide:save" color="primary"
          @click="commitSelection()">
          Save selection
        </UButton>
        <UButton color="neutral" icon="lucide:rotate-ccw"
          @click="cancelSelection()">
          Cancel selection
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { downloadData, list, uploadData } from 'aws-amplify/storage';
import { fetchAuthSession } from 'aws-amplify/auth';
import type { MediaFile } from '~/types/MediaFile';
import { resizeImage } from '~/helpers/resize-image';
import { blobToBase64 } from '~/helpers/blob-to-base64';

const props = withDefaults(defineProps<{
  mediaType?: 'pictures' | 'audio';
  title?: string;
  description?: string;
  selected?: string;
}>(), { mediaType: 'pictures' });

const emit = defineEmits(['update:selected', 'change']);

const showMediaModal = ref(false);

const locallySelected = ref(props.selected || '');
watch(showMediaModal, (isOpen) => {
  if (isOpen) {
    locallySelected.value = props.selected || '';
  }
});
const updateSelection = (value: string) => {
  locallySelected.value = value;
};
const cancelSelection = () => {
  locallySelected.value = props.selected || '';
  showMediaModal.value = false;
}
const commitSelection = () => {
  showMediaModal.value = false;
  emit('update:selected', locallySelected.value);
  emit('change');
}
const session = await fetchAuthSession();
const library = useState<{
  pictures: Record<string, MediaFile>,
  audio: Record<string, MediaFile>
}>('library', () => ({
  pictures: {},
  audio: {}
}));
// const library = useState<{ pictures: MediaFile[], audio: MediaFile[] }>('library', () => ({ pictures: [], audio: [] }));

const fetchStoredMedia = async () => {
  // TODO Add storage subscription so that updates are fetched from S3 only when needed
  // TODO Cache media in local storage?
  try {
    const pictureList = (await list({
      path: `word-pictures/${session.identityId}/`,
      options: {
        subpathStrategy: { strategy: 'exclude' }
      }
    })).items;

    const audioList = (await list({
      path: `word-audio/${session.identityId}/`,
      options: {
        subpathStrategy: { strategy: 'exclude' }
      }
    })).items;

    // Reset library while maintaining reactivity
    library.value.pictures = {};
    library.value.audio = {};

    // Create placeholder objects for each file
    [...pictureList, ...audioList].forEach(file => {
      const mediaType = file.path.startsWith('word-audio/') ? 'audio' : 'pictures';
      // const mediaType = file.contentType?.startsWith('audio/') ? 'audio' : 'pictures';
      const name = file.path.split('/').pop() || '';
      library.value[mediaType][name] = reactive<MediaFile>({
        name,
        data: null,
        state: {
          progress: 0,
          isLoading: true,
          error: false
        },
        size: file.size || 0,
        lastModified: file.lastModified ? file.lastModified.getTime() : 0,
        path: file.path
      });
    });

    // Initiate download of each file
    pictureList.forEach(async (picture) => {
      const name = picture.path.split('/').pop() || '';
      try {
        const pictureFile = await downloadData({
          path: picture.path,
          options: {
            onProgress: (progress) => {
              if (progress.totalBytes) {
                const percentage = Math.round(progress.transferredBytes / progress.totalBytes * 100);
                library.value.pictures[name].state.progress = percentage;
              }
            }
          }
        }).result;
        const blob = await blobToBase64(await (pictureFile.body).blob());
        library.value.pictures[name].data = blob as Base64URLString;
        library.value.pictures[name].state.isLoading = false;
        library.value.pictures[name].state.progress = 100;
      } catch (error) {
        console.error('Error fetching picture:', error);
        library.value.pictures[name].state.isLoading = false;
        library.value.pictures[name].state.error = true;
      }
    });
    audioList.forEach(async (audio) => {
      const name = audio.path.split('/').pop() || '';
      try {
        const audioFile = await downloadData({
          path: audio.path,
          options: {
            onProgress: (progress) => {
              if (progress.totalBytes) {
                const percentage = Math.round(progress.transferredBytes / progress.totalBytes * 100);
                library.value.audio[name].state.progress = percentage;
              }
            }
          }
        }).result;
        const blob = await blobToBase64(await (audioFile.body).blob());
        library.value.audio[name].data = blob as Base64URLString;
        library.value.audio[name].state.isLoading = false;
        library.value.audio[name].state.progress = 100;
      } catch (error) {
        console.error('Error fetching audio:', error);
        library.value.audio[name].state.isLoading = false;
        library.value.audio[name].state.error = true;
      }
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
  }
};

fetchStoredMedia();

// const mediaFilter = ref('');
// const moduleNames = ref(['Intro 1', 'Intro 2', 'Intermediary 1', 'Intermediary 2', 'Advanced']);
// const moduleFilter = ref([]);
// const unitNames = ref(['Numbers 1-10', 'Numbers 11-100', 'Family relations 1', 'Family relations 2', 'Employment']);
// const unitFilter = ref([]);


const filesAdded = ({ files: uploadFiles }: { files: Array<File> }) => {
  uploadFiles.forEach(async (file) => {
    try {
      const resizedFile = await resizeImage(file, 0.5); // Max 0.5MB

      const name = file.name;
      library.value[props.mediaType][name] = reactive<MediaFile>({
        name: file.name,
        data: null,
        state: {
          progress: 0,
          isLoading: true,
          error: false
        },
        size: resizedFile.size,
        lastModified: Date.now(),
      });

      const basePath = `word-${props.mediaType}/${session.identityId}/`;
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        if (fileReader.result) {
          try {
            // Show upload progress
            const uploadResult = await uploadData({
              path: `${basePath}${file.name}`,
              data: fileReader.result,
              options: {
                onProgress: ({ transferredBytes, totalBytes }) => {
                  if (totalBytes) {
                    const percentage = Math.round(transferredBytes / totalBytes * 100);
                    library.value[props.mediaType][name].state.progress = percentage;
                  }
                },
              }
            }).result;

            fileReader.result

            // Get file data for display
            // const pictureFile = await downloadData({
            //   path: `${basePath}/${file.name}`
            // }).result;

            // const blob = await blobToBase64(await (pictureFile.body).blob());
            const blob = await blobToBase64(new Blob([fileReader.result]));

            // Update with actual data
            library.value[props.mediaType][name].data = blob as Base64URLString;
            library.value[props.mediaType][name].state.isLoading = false;
            library.value[props.mediaType][name].state.progress = 100;

          } catch (e) {
            console.error('error', e);
            library.value[props.mediaType][name].state.isLoading = false;
            library.value[props.mediaType][name].state.error = true;
          }
        }
      };

      fileReader.onerror = (e) => {
        console.error('File read error', e);
        library.value[props.mediaType][name].state.isLoading = false;
        library.value[props.mediaType][name].state.error = true;
      };

      fileReader.readAsArrayBuffer(resizedFile);
    } catch (error) {
      console.error('Error resizing image:', error);
    }
  });
};
</script>
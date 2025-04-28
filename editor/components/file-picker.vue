<template>
  <UForm :schema="FileSchema" :state="state">
    <UFormField name="state.files">
      <UInput type="file" @change="onFileChange" multiple
        :accept="`${mimePref}${mimeTypes.join(`, ${mimePref}`)}`"
        class="sr-only" ref="fileInput" />
      <slot :handleClick="() => fileInput?.$el.children[0].click()" />
    </UFormField>
  </UForm>
</template>
<script setup lang="ts">
import * as v from 'valibot';
const props = withDefaults(defineProps<{
  mediaType?: 'pictures' | 'audio';
}>(), { mediaType: 'pictures' });

const toast = useToast();

const mimePref = props.mediaType === 'pictures' ? 'image/' : 'audio/';
const mimeTypes = props.mediaType === 'pictures' ? ['jpeg', 'png', 'webp'] : ['aac', 'mp4', 'mpeg', 'webm'];
// const mimeTypes = props.mediaType === 'pictures' ? ['jpeg', 'png', 'webp'] : ['aac', 'mp4', 'mpeg', 'ogg', 'wav', 'webm'];

const FileSchema = v.object({
  files: v.array(
    v.pipe(
      v.file(`Please select an image file (${mimeTypes.join(', ')}).`),
      v.mimeType(mimeTypes.map((type) => `${mimePref}${type}`) as Array<`${string}/${string}`>, `Please select valid image files only (${mimeTypes.join(', ')}).`),
      v.maxSize(10 * 1024 * 1024, 'Please select a file smaller than 10 MB.'),
    ),
  ),
});

type FileArrayType = v.InferOutput<typeof FileSchema>;

const state = reactive<FileArrayType>({ files: [] });

const fileInput = useTemplateRef('fileInput')

const onFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    const validation = v.safeParse(FileSchema, { files: Array.from(files) });
    if (!validation.success) {
      validation.issues.forEach((issue, index) => {
        setTimeout(
          () => toast.add({ title: `Unable to upload ${(issue.input as File)?.name}`, description: issue.message, color: 'error', duration: 5000 }),
          index * 2000,
        );
      });
    } else {
      state.files = (validation.output as FileArrayType).files;
    }
  }
};

// const emit = defineEmits(['filesAdded']);
const emit = defineEmits<{
  (e: 'filesAdded', { files }: { files: FileArrayType['files'] }): void;
}>();

watch(() => state.files, (files) => {
  if (files && files.length > 0) {
    emit('filesAdded', { files });
  }
});

</script>
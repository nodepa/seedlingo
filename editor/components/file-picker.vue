<template>
  <UForm :schema="v.safeParser(FileSchema)" :state="state" class="space-y-4">
    <UFormField name="state.files">
      <UInput type="file" @change="onFileChange" multiple
        :accept="`${mimeImgPref}${imageTypes.join(`, ${mimeImgPref}`)}`"
        class="sr-only" ref="fileInput" />
      <slot :handleClick="() => fileInput?.$el.children[0].click()" />
    </UFormField>
  </UForm>
</template>
<script setup lang="ts">
import * as v from 'valibot';

const toast = useToast();

const mimeImgPref = 'image/';
const imageTypes = ['jpg', 'jpeg', 'png', 'webp'];

const FileSchema = v.object({
  files: v.array(
    v.pipe(
      v.file(`Please select an image file (${imageTypes.join(', ')}).`),
      v.mimeType(imageTypes.map((type) => `${mimeImgPref}${type}`) as Array<`${string}/${string}`>, `Please select valid image files only (${imageTypes.join(', ')}).`),
      v.maxSize(10 * 1024 * 1024, 'Please select a file smaller than 10 MB.'),
    ),
  ),
});

type FileArrayType = v.InferOutput<typeof FileSchema>;

// const state = reactive<FileArrayType>({ files: [] as FileArrayType['files'] });
const state = reactive<FileArrayType>({ files: [] });

const fileInput = useTemplateRef('fileInput')

const onFileChange = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    const validation = v.safeParse(FileSchema, { files: Array.from(files) });
    console.log(validation.output);
    if (!validation.success) {
      validation.issues.forEach((issue, index) => {
        setTimeout(
          () => toast.add({ title: `Unable to upload ${(issue.input as File)?.name}`, description: issue.message, color: 'error', duration: 5000 }),
          index * 2000,
        );
      });
    }
    console.log('update state.files to', validation.output);
    state.files = (validation.output as FileArrayType)['files'];
  }
};

// const emit = defineEmits(['filesAdded']);
const emit = defineEmits<{
  (e: 'filesAdded', { files }: { files: FileArrayType['files'] }): void;
}>();

watch(() => state.files, (files) => {
  console.log('emitting', files);
  if (files && files.length > 0) {
    emit('filesAdded', files);
  }
});

</script>
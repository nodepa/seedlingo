<template>
  <UContainer>
    <UCard>
      <template #header>
        <h1 class="text-2xl text-(--ui-primary)">Units</h1>
      </template>

      <ul class="flex flex-wrap gap-4">
        <li v-if="!units || units.length === 0" class="flex w-xs">
          <UCard class="w-full">
            <div>
              <USkeleton class="mb-4 w-[10rem] h-8" />
            </div>
            <div>
              <USkeleton class="mb-4 w-[8rem] h-[8rem]" />
            </div>
            <div>
              <USkeleton class="mb-2 w-[10rem] h-6" />
              <USkeleton class="mb-2 w-[14rem] h-6" />
              <USkeleton class="mb-2 w-[12rem] h-6" />
            </div>
          </UCard>
        </li>
        <li v-for="unit in units" :key="'unit-id-' + unit.id" class="flex w-xs">
          <UCard class="w-full grid">
            <div v-if="!unit.inEditMode" class="h-full flex flex-col">
              <p class="text-xl">{{ unit.name }}</p>
              <UIcon :name="unit.icon || 'noto-unknown-flag'"
                class="w-[10rem] h-[10rem] block" />
              <p class="mb-4">{{ unit.description }}</p>
              <p class="text-sm text-gray-500 mb-2">
                {{ wordCountsByUnitId[unit.id] ?? 0 }} word(s)
              </p>
              <div class="flex-1"></div>
              <div class="flex justify-center gap-2">
                <UButton v-if="!unit.inEditMode" color="primary"
                  icon="lucide:eye" :to="'units/' + unit.id">
                  View
                </UButton>
                <UButton v-if="!unit.inEditMode" color="neutral"
                  icon="lucide:edit" @click="unit.inEditMode = true">
                  Edit
                </UButton>
              </div>
            </div>
            <div v-else class="h-full">
              <UForm :schema="UnitValidationSchema" :state="unit"
                @submit="save(unit)" class="h-full flex flex-col">
                <UFormField label="Name" name="name" hint="required">
                  <UInput v-model="unit.name as string"
                    :disabled="unit.isWaiting"
                    class="text-xl :invalid:border-blue" />
                </UFormField>
                <UFormField label="Icon" name="icon" hint='optional'
                  class="my-4">
                  <UInput v-model="unit.icon as string"
                    :disabled="unit.isWaiting" />
                </UFormField>
                <UFormField label="Description" name="description"
                  hint='optional'>
                  <UTextarea v-model="unit.description as string"
                    :autoresize="true" :maxrows="8" :disabled="unit.isWaiting"
                    class="mb-4 w-full resize-none" />
                </UFormField>
                <div class="flex-1"></div>
                <div class="flex justify-center gap-2">
                  <UButton type='submit' color="primary" icon="lucide:save"
                    :disabled="unit.isWaiting">
                    Save
                  </UButton>
                  <UButton color="neutral" @click="cancelEditing(unit)"
                    icon="lucide:rotate-ccw" :disabled="unit.isWaiting">
                    Cancel
                  </UButton>
                  <UButton color="warning" @click="deleteUnit(unit)"
                    icon="lucide:trash-2" :disabled="unit.isWaiting">
                    Delete
                  </UButton>
                </div>
              </UForm>
            </div>
          </UCard>
        </li>
        <li class="flex w-xs">
          <UCard class="w-full grid items-center">
            <div class="min-h-40 flex flex-col justify-center">
              <!-- <div>
                <USkeleton class="mb-4 w-[8rem] h-8" />
              </div>
              <div>
                <USkeleton class="mb-4 w-[11rem] h-[8rem]" />
              </div>
              <div>
                <USkeleton class="mb-2 w-[17rem] h-5" />
                <USkeleton class="mb-4 w-[13rem] h-5" />
              </div> -->
              <UnitForm isAddMode @updateUnit="createUnit" />
            </div>
          </UCard>
        </li>
      </ul>

      <template #footer>
        <p class="text-center">Currently showing {{ units.length }}
          units</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { generateClient } from 'aws-amplify/data';
import * as v from 'valibot';
import type { Subscription } from 'rxjs';
import type { Schema } from '~/amplify/data/resource';
import type { DynamicUnit } from '~/types/UnitTypes';

const toast = useToast();

const UnitValidationSchema = v.object({
  id: v.optional(v.string()),
  name: v.pipe(v.string(), v.nonEmpty('Please enter a name for the unit')),
  description: v.optional(v.string()),
  icon: v.optional(v.string()),
});
type UnitValidType = v.InferOutput<typeof UnitValidationSchema>;

const isSynced = ref(false);

const units = useState<Array<DynamicUnit>>('units', () => []);
const wordCountsByUnitId = ref<Record<string, number>>({});
const client = generateClient<Schema>({ authMode: 'userPool' });

let unitsSub: Subscription;
let wordsSub: Subscription;

onMounted(() => {
  unitsSub = client.models.Unit.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      units.value = items;
    },
    error: (error) => {
      console.error('Error observing units:', error);
    },
  });
  wordsSub = client.models.Word.observeQuery().subscribe({
    next: ({ items }) => {
      const counts: Record<string, number> = {};
      items.forEach((word) => {
        if (word.unitId) {
          counts[word.unitId] = (counts[word.unitId] ?? 0) + 1;
        }
      });
      wordCountsByUnitId.value = counts;
    },
    error: (error) => {
      console.error('Error observing words for unit count:', error);
    },
  });
});

onBeforeUnmount(() => {
  unitsSub?.unsubscribe();
  wordsSub?.unsubscribe();
});

const save = async (unit: DynamicUnit) => {
  unit.isWaiting = true;
  if (unit.id) {
    const { data: existingUnit, errors } = await client.models.Unit.get({ id: unit.id });
    if (errors || !existingUnit) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to get unit', color: 'error' });
      return;
    } else {
      const { data: updatedUnit, errors } = await client.models.Unit.update({ id: unit.id, name: unit.name, icon: unit.icon, description: unit.description });
      if (errors) {
        console.error(errors);
        toast.add({ title: 'Error', description: 'Failed to update unit', color: 'error' });
        return;
      } else {
        toast.add({ title: 'Success', description: 'Unit updated successfully', color: 'success' });
        unit.isWaiting = false;
      }
    }
  } else {
    const newUnit = {
      name: unit.name,
      description: unit.description
    } as DynamicUnit;
    if (unit.icon) {
      newUnit.icon = unit.icon;
    }
    const { data: updatedUnit, errors } = await client.models.Unit.create(newUnit);
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add unit', color: 'error' });
      return;
    } else {
      toast.add({ title: 'Success', description: 'Unit added successfully', color: 'success' });
      unit.isWaiting = false;
      // unit = updatedUnit as DynamicUnit;
    }
  }
};

const cancelEditing = async (unit: DynamicUnit) => {
  unit.isWaiting = true;
  if (unit.id) {
    const { data: existingUnit, errors } = await client.models.Unit.get({ id: unit.id });
    if (existingUnit) {
      unit.name = existingUnit.name as string;
      unit.icon = existingUnit.icon as string;
      unit.description = existingUnit.description as string;
    }
  }
  unit.inEditMode = false;
  unit.isWaiting = false;
};

const deleteUnit = async (unit: DynamicUnit) => {
  unit.isWaiting = true;
  if (unit.id) {
    const { errors } = await client.models.Unit.delete({ id: unit.id });
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to delete unit', color: 'error' });
    } else {
      toast.add({ title: 'Success', description: 'Unit deleted successfully', color: 'success' });
    }
  }
};

const createUnit = async (unitData: DynamicUnit) => {
  let existingUnitIndex = -1;
  if (unitData.id) {
    console.log('unitData.id exists:', unitData.id);
    existingUnitIndex = units.value.findIndex((unit) => unit.id === unitData.id);
  }
  if (unitData.id && existingUnitIndex !== -1) {
    console.log('existingUnitIndex exists:', existingUnitIndex);
    units.value[existingUnitIndex] = unitData;
    // units.value.push(unitData);
  } else {
    console.log('unitData.id and existingUnitIndex does not exist, creating temp unit');
    const newUnit = {
      name: unitData.name,
      description: unitData.description
    };
    let tempUnit = ref({
      ...newUnit,
      id: crypto.randomUUID(),
      isWaiting: true,
      waitsOn: {
        name: true,
        description: true
      }
    } as DynamicUnit);
    units.value.push(tempUnit.value);
    console.log('units before create:', JSON.stringify(units.value));
    const { data: updatedUnit, errors } = await client.models.Unit.create(newUnit);
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add unit', color: 'error' });
      return;
    } else {
      toast.add({ title: 'Success', description: 'Unit added successfully', color: 'success' });
      tempUnit.value = updatedUnit as DynamicUnit;
      console.log('units after create:', JSON.stringify(units.value));
    }
  }
};
</script>

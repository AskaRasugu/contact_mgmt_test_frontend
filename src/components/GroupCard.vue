<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';

const props = defineProps({
  group: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click', 'edit', 'delete']);

const router = useRouter();
const isDeleting = ref(false);

const handleClick = () => {
  emit('click');
};

const handleEdit = (event) => {
  event.stopPropagation();
  emit('edit', props.group.id);
};

const handleDelete = async (event) => {
  event.stopPropagation();
  
  if (confirm(`Are you sure you want to delete the group "${props.group.name}"? This will remove it from all contacts.`)) {
    isDeleting.value = true;
    try {
      await store.deleteGroup(props.group.id);
      emit('delete', props.group.id);
    } catch (error) {
      console.error('Failed to delete group:', error);
      alert('Failed to delete group. Please try again.');
    } finally {
      isDeleting.value = false;
    }
  }
};
</script>

<template>
  <div 
    class="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md h-full group" 
    @click="handleClick"
  >
    <div class="p-6 text-white" :style="{ backgroundColor: group.color }">
      <h3 class="text-lg font-semibold">{{ group.name }}</h3>
    </div>
    <div class="p-6">
      <p v-if="group.description" class="text-gray-500 text-sm mb-4">{{ group.description }}</p>
      
      <!-- Action Buttons -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex gap-2">
          <button
            @click="handleEdit"
            class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-all"
            title="Edit Group"
          >
            <font-awesome-icon icon="edit" class="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            @click="handleDelete"
            :disabled="isDeleting"
            class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Group"
          >
            <font-awesome-icon icon="trash" class="w-3 h-3" />
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
        <span class="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
          {{ group.contacts_count || 0 }} contacts
        </span>
      </div>
    </div>
  </div>
</template>

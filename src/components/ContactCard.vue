<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';

const props = defineProps({
  contact: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['click', 'edit', 'delete']);

const router = useRouter();
const isDeleting = ref(false);

const contactGroups = computed(() => {
  return props.contact.groups || [];
});

const handleClick = () => {
  emit('click');
};

const handleEdit = (event) => {
  event.stopPropagation();
  emit('edit', props.contact.id);
};

const handleDelete = async (event) => {
  event.stopPropagation();
  
  if (confirm(`Are you sure you want to delete ${props.contact.first_name} ${props.contact.last_name}?`)) {
    isDeleting.value = true;
    try {
      await store.deleteContact(props.contact.id);
      emit('delete', props.contact.id);
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact. Please try again.');
    } finally {
      isDeleting.value = false;
    }
  }
};

const getAvatarUrl = computed(() => {
  return props.contact.avatar || null;
});
</script>

<template>
  <div 
    class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-md group" 
    @click="handleClick"
  >
    <!-- Card Header with Avatar and Name -->
    <div class="p-6 pb-4">
      <div class="flex items-center gap-4 mb-4">
        <!-- Avatar or Initials -->
        <div class="relative">
          <img 
            v-if="getAvatarUrl" 
            :src="getAvatarUrl" 
            alt="Avatar" 
            class="w-16 h-16 rounded-full object-cover shadow-sm border-2 border-white ring-2 ring-primary-100" 
          />
          <div 
            v-else 
            class="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center text-xl font-bold shadow-sm"
          >
            {{ (contact.first_name?.[0] || '') + (contact.last_name?.[0] || '') }}
          </div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
            <font-awesome-icon icon="user" class="text-xs text-primary" />
          </div>
        </div>
        
        <!-- Name and Title -->
        <div class="min-w-0 flex-1">
          <h3 class="text-lg font-semibold text-gray-900 truncate">{{ contact.first_name }} {{ contact.last_name }}</h3>
          <p class="text-xs text-gray-500">Contact</p>
        </div>
      </div>
      
      <!-- Contact Info -->
      <div class="space-y-2 mb-4">
        <div v-if="contact.email" class="flex items-center gap-2 text-sm text-gray-600">
          <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
            <font-awesome-icon icon="envelope" class="text-sm" />
          </div>
          <span class="truncate">{{ contact.email }}</span>
        </div>
        <div v-if="contact.phone" class="flex items-center gap-2 text-sm text-gray-600">
          <div class="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
            <font-awesome-icon icon="phone" class="text-sm" />
          </div>
          <span>{{ contact.phone }}</span>
        </div>
      </div>
    </div>
    
    <!-- Groups Tags -->
    <div v-if="contactGroups.length > 0" class="px-6 pb-4 flex flex-wrap gap-2 mt-auto">
      <div 
        v-for="group in contactGroups" 
        :key="group.id" 
        class="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all"
        :style="{ backgroundColor: group.color + '15', color: group.color, borderColor: group.color + '30' }"
      >
        <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: group.color }"></span>
        {{ group.name }}
      </div>
    </div>
    
    <!-- Action Buttons -->
    <div class="px-6 py-3 border-t border-gray-100 bg-gray-50 group-hover:bg-primary-50 transition-colors">
      <div class="flex justify-between items-center gap-2">
        <div class="flex gap-2">
          <button
            @click="handleEdit"
            class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-primary hover:bg-white rounded-md transition-all"
            title="Edit Contact"
          >
            <font-awesome-icon icon="edit" class="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            @click="handleDelete"
            :disabled="isDeleting"
            class="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-white rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Contact"
          >
            <font-awesome-icon icon="trash" class="w-3 h-3" />
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
        <div class="flex items-center gap-1 text-xs font-medium text-primary">
          <span>View Details</span>
          <font-awesome-icon icon="chevron-right" class="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </div>
    
    <!-- Card Footer -->
    <div class="px-6 py-2 bg-gray-50 group-hover:bg-primary-50 transition-colors">
      <span class="text-xs font-medium text-gray-500">Last updated: {{ new Date(contact.updated_at).toLocaleDateString() }}</span>
    </div>
  </div>
</template>


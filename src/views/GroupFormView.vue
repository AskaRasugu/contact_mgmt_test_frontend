<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import { groupApi } from '../services/api';

const props = defineProps({
  id: {
    type: String,
    default: null
  }
});

const router = useRouter();
const isEditMode = computed(() => !!props.id);
const formTitle = computed(() => isEditMode.value ? 'Edit Group' : 'New Group');

const group = ref({
  name: '',
  color: '#3498db',
  description: ''
});

const errors = ref({});
const isSaving = ref(false);

// Predefined colors for the color picker
const colorOptions = [
  '#3498db', // Blue
  '#2ecc71', // Green
  '#e74c3c', // Red
  '#f39c12', // Orange
  '#9b59b6', // Purple
  '#1abc9c', // Teal
  '#34495e', // Dark Blue
  '#e67e22', // Dark Orange
  '#d35400', // Pumpkin
  '#c0392b', // Dark Red
  '#16a085', // Green Sea
  '#8e44ad', // Wisteria
  '#2c3e50', // Midnight Blue
  '#f1c40f', // Sunflower
  '#27ae60'  // Nephritis
];

onMounted(async () => {
  if (isEditMode.value) {
    try {
      // First try to get from store
      let existingGroup = store.getGroupById(props.id);
      
      // If not in store, fetch from API
      if (!existingGroup) {
        const response = await groupApi.getById(props.id);
        existingGroup = response.data;
      }
      
      if (existingGroup) {
        group.value = {
          name: existingGroup.name || '',
          color: existingGroup.color || '#3498db',
          description: existingGroup.description || ''
        };
      } else {
        router.push({ name: 'groups' });
      }
    } catch (error) {
      console.error('Failed to load group for editing:', error);
      router.push({ name: 'groups' });
    }
  }
});

const validateForm = () => {
  const newErrors = {};
  
  if (!group.value.name.trim()) {
    newErrors.name = 'Group name is required';
  }
  
  if (!group.value.color) {
    newErrors.color = 'Please select a color';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const saveGroup = async () => {
  if (!validateForm()) return;
  
  isSaving.value = true;
  
  try {
    if (isEditMode.value) {
      await store.updateGroup(props.id, group.value);
      // After editing, go back to groups list to see all groups
      router.push({ name: 'groups' });
    } else {
      const newGroup = await store.addGroup(group.value);
      // After creating, go back to groups list to see all groups
      router.push({ name: 'groups' });
    }
  } catch (error) {
    console.error('Error saving group:', error);
    // Handle validation errors from the API
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      alert('Failed to save group. Please try again.');
    }
  } finally {
    isSaving.value = false;
  }
};

const navigateBack = () => {
  if (isEditMode.value) {
    router.push({ name: 'group-details', params: { id: props.id } });
  } else {
    router.push({ name: 'groups' });
  }
};

const selectColor = (color) => {
  group.value.color = color;
};
</script>

<template>
  <div class="w-full max-w-3xl mx-auto px-4 py-6">
    <!-- Header with Back and Action Buttons -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 pb-6 mb-8">
      <button 
        class="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-full text-neutral-700 hover:bg-white hover:shadow-md transition-all duration-300 ease-in-out"
        @click="navigateBack"
      >
        <font-awesome-icon icon="arrow-left" class="text-primary" />
        <span class="font-medium">Back</span>
      </button>
      
      <h1 class="text-2xl sm:text-3xl font-bold text-neutral-800">{{ formTitle }}</h1>
      
      <button 
        class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-full hover:shadow-lg shadow-primary/20 transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed"
        @click="saveGroup" 
        :disabled="isSaving"
      >
        <font-awesome-icon v-if="!isSaving" icon="check" class="h-5 w-5" />
        <font-awesome-icon v-else icon="sync" class="animate-spin h-5 w-5" />
        <span v-if="isSaving">Saving...</span>
        <span v-else>Save Group</span>
      </button>
    </div>
    
    <!-- Form Container -->
    <div class="bg-white rounded-3xl shadow-card overflow-hidden mb-10 transition-all duration-300 hover:shadow-card-hover">
      <form @submit.prevent="saveGroup" class="p-8 sm:p-10">
        <!-- Group Name Field -->
        <div class="mb-8">
          <label for="name" class="block text-sm font-semibold text-neutral-700 mb-2">Group Name<span class="text-accent">*</span></label>
          <div class="relative">
            <input 
              type="text" 
              id="name" 
              v-model="group.name"
              class="w-full px-4 py-3.5 bg-neutral-50 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none"
              :class="{ 'border-accent focus:ring-accent focus:border-accent': errors.name, 'border-neutral-200': !errors.name }"
              placeholder="e.g., Family, Work, Friends"
            />
            <div v-if="errors.name" class="mt-2 text-sm text-accent flex items-center gap-1.5">
              <font-awesome-icon icon="exclamation-triangle" class="h-4 w-4" />
              {{ errors.name }}
            </div>
          </div>
        </div>
        
        <!-- Group Color Field -->
        <div class="mb-8">
          <label class="block text-sm font-semibold text-neutral-700 mb-2">Group Color<span class="text-accent">*</span></label>
          <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3 mb-2">
            <div 
              v-for="color in colorOptions" 
              :key="color" 
              class="w-10 h-10 rounded-full cursor-pointer transition-all duration-200 flex items-center justify-center border-2"
              :class="{ 'border-white shadow-lg scale-110': group.color === color, 'border-transparent hover:scale-105': group.color !== color }"
              :style="{ backgroundColor: color }"
              @click="selectColor(color)"
            >
              <font-awesome-icon v-if="group.color === color" icon="check" class="h-5 w-5 text-white" />
            </div>
          </div>
          <div v-if="errors.color" class="mt-2 text-sm text-accent flex items-center gap-1.5">
            <font-awesome-icon icon="exclamation-triangle" class="h-4 w-4" />
            {{ errors.color }}
          </div>
        </div>
        
        <!-- Description Field -->
        <div class="mb-10">
          <label for="description" class="block text-sm font-semibold text-neutral-700 mb-2">Description</label>
          <textarea 
            id="description" 
            v-model="group.description" 
            rows="4"
            class="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 outline-none"
            placeholder="Add a description for this group..."
          ></textarea>
        </div>
        
        <!-- Preview Section -->
        <div class="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
          <h3 class="text-lg font-semibold text-neutral-700 mb-4 flex items-center gap-2">
            <font-awesome-icon icon="eye" class="h-5 w-5 text-primary" />
            Preview
          </h3>
          
          <!-- Preview Card -->
          <div class="bg-white rounded-xl shadow-sm border border-neutral-100 transition-all duration-300 hover:shadow-md overflow-hidden">
            <div class="p-4 text-white font-medium flex items-center justify-between" :style="{ backgroundColor: group.color }">
              <h4 class="text-lg font-semibold truncate">{{ group.name || 'Group Name' }}</h4>
              <div class="flex items-center gap-1">
                <span class="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">0 contacts</span>
              </div>
            </div>
            <div class="p-4">
              <p class="text-neutral-600 text-sm line-clamp-2 overflow-hidden">{{ group.description || 'Group description will appear here' }}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<!-- No custom styles needed - using Tailwind's built-in utilities -->

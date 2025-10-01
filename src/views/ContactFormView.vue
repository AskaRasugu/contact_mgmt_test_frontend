<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import { contactApi } from '../services/api';

const props = defineProps({
  id: {
    type: String,
    default: null
  }
});

const router = useRouter();
const isEditMode = computed(() => !!props.id);
const formTitle = computed(() => isEditMode.value ? 'Edit Contact' : 'New Contact');

const contact = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  group_ids: [],
  avatar: '',
  notes: ''
});

const groups = computed(() => store.state.groups);
const errors = ref({});
const isSaving = ref(false);

onMounted(async () => {
  if (isEditMode.value) {
    try {
      // First try to get from store
      let existingContact = store.getContactById(props.id);
      
      // If not in store, fetch from API
      if (!existingContact) {
        const response = await contactApi.getById(props.id);
        existingContact = response.data;
      }
      
      if (existingContact) {
        // Map the contact data to form fields
        contact.value = {
          first_name: existingContact.first_name || '',
          last_name: existingContact.last_name || '',
          email: existingContact.email || '',
          phone: existingContact.phone || '',
          address: existingContact.address || '',
          group_ids: existingContact.groups ? existingContact.groups.map(g => g.id) : [],
          avatar: existingContact.avatar || '',
          notes: existingContact.notes || ''
        };
      } else {
        router.push({ name: 'contacts' });
      }
    } catch (error) {
      console.error('Failed to load contact for editing:', error);
      router.push({ name: 'contacts' });
    }
  }
});

const validateForm = () => {
  const newErrors = {};
  
  if (!contact.value.first_name.trim()) {
    newErrors.first_name = 'First name is required';
  }
  
  if (!contact.value.last_name.trim()) {
    newErrors.last_name = 'Last name is required';
  }
  
  if (contact.value.email && !isValidEmail(contact.value.email)) {
    newErrors.email = 'Please enter a valid email address';
  }
  
  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const saveContact = async () => {
  if (!validateForm()) return;
  
  isSaving.value = true;
  
  try {
    if (isEditMode.value) {
      await store.updateContact(props.id, contact.value);
      // After editing, go back to contacts list to see all contacts
      router.push({ name: 'contacts' });
    } else {
      const newContact = await store.addContact(contact.value);
      // After creating, go back to contacts list to see all contacts
      router.push({ name: 'contacts' });
    }
  } catch (error) {
    console.error('Error saving contact:', error);
    // Handle validation errors from the API
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      alert('Failed to save contact. Please try again.');
    }
  } finally {
    isSaving.value = false;
  }
};

const navigateBack = () => {
  if (isEditMode.value) {
    router.push({ name: 'contact-details', params: { id: props.id } });
  } else {
    router.push({ name: 'contacts' });
  }
};

const toggleGroup = (groupId) => {
  const index = contact.value.group_ids.indexOf(groupId);
  if (index === -1) {
    contact.value.group_ids.push(groupId);
  } else {
    contact.value.group_ids.splice(index, 1);
  }
};

const isGroupSelected = (groupId) => {
  return contact.value.group_ids.includes(groupId);
};
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
      <button 
        class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
        @click="navigateBack"
      >
        <span>←</span> Back
      </button>
      <h1 class="text-xl font-semibold text-gray-900">{{ formTitle }}</h1>
      <button 
        class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        @click="saveContact" 
        :disabled="isSaving"
      >
        <span v-if="isSaving">Saving...</span>
        <span v-else>Save Contact</span>
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form @submit.prevent="saveContact">
        <div class="mb-8 pb-8 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
              <input 
                type="text" 
                id="first_name" 
                v-model="contact.first_name"
                class="w-full px-3 py-2 border rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                :class="{ 'border-accent focus:ring-accent focus:border-accent': errors.first_name, 'border-gray-300': !errors.first_name }"
              />
              <p v-if="errors.first_name" class="mt-1 text-xs text-accent">{{ errors.first_name }}</p>
            </div>
            
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
              <input 
                type="text" 
                id="last_name" 
                v-model="contact.last_name"
                class="w-full px-3 py-2 border rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                :class="{ 'border-accent focus:ring-accent focus:border-accent': errors.last_name, 'border-gray-300': !errors.last_name }"
              />
              <p v-if="errors.last_name" class="mt-1 text-xs text-accent">{{ errors.last_name }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="contact.email"
                class="w-full px-3 py-2 border rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                :class="{ 'border-accent focus:ring-accent focus:border-accent': errors.email, 'border-gray-300': !errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-xs text-accent">{{ errors.email }}</p>
            </div>
            
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="tel" 
                id="phone" 
                v-model="contact.phone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          
          <div class="mb-6">
            <label for="address" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea 
              id="address" 
              v-model="contact.address" 
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
          
          <div>
            <label for="avatar" class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input 
              type="url" 
              id="avatar" 
              v-model="contact.avatar" 
              placeholder="https://example.com/avatar.jpg"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
        
        <div class="mb-8 pb-8 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Groups</h2>
          <div class="flex flex-wrap gap-3">
            <div 
              v-for="group in groups" 
              :key="group.id" 
              class="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer transition-colors"
              :class="isGroupSelected(group.id) ? 
                'bg-primary bg-opacity-10 border-primary' : 
                'border-gray-200 hover:bg-gray-50'"
              @click="toggleGroup(group.id)"
            >
              <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: group.color }"></div>
              <span class="text-sm">{{ group.name }}</span>
              <span v-if="isGroupSelected(group.id)" class="text-primary font-bold">✓</span>
            </div>
          </div>
        </div>
        
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-6">Additional Information</h2>
          <div>
            <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea 
              id="notes" 
              v-model="contact.notes" 
              rows="5"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
            ></textarea>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


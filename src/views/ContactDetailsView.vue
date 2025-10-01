<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import ContactCard from '../components/ContactCard.vue';
import { contactApi } from '../services/api';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const contact = ref(null);
const confirmDelete = ref(false);

const contactGroups = computed(() => {
  return contact.value?.groups || [];
});

onMounted(() => {
  loadContact();
});

// Watch for changes in the store and update contact if it changes
watch(() => store.getContactById(props.id), (newContact) => {
  if (newContact) {
    contact.value = newContact;
  }
}, { deep: true });

const loadContact = async () => {
  try {
    // First try to get from store
    let foundContact = store.getContactById(props.id);
    
    // If not in store, fetch from API
    if (!foundContact) {
      const response = await contactApi.getById(props.id);
      foundContact = response.data;
    }
    
    if (foundContact) {
      contact.value = foundContact;
    } else {
      router.push({ name: 'contacts' });
    }
  } catch (error) {
    console.error('Failed to load contact:', error);
    router.push({ name: 'contacts' });
  }
};

const navigateToEdit = () => {
  router.push({ name: 'contact-edit', params: { id: props.id } });
};

const navigateBack = () => {
  router.push({ name: 'contacts' });
};

const deleteContact = async () => {
  if (confirmDelete.value) {
    try {
      await store.deleteContact(props.id);
      router.push({ name: 'contacts' });
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact. Please try again.');
    }
  } else {
    confirmDelete.value = true;
    setTimeout(() => {
      confirmDelete.value = false;
    }, 3000);
  }
};

const getAvatarUrl = computed(() => {
  return contact.value?.avatar || null;
});
</script>

<template>
  <div v-if="contact" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Header with Back and Action Buttons -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 pb-6 mb-8">
      <button
        class="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-full text-neutral-700 hover:bg-white hover:shadow-md transition-all duration-300 ease-in-out"
        @click="navigateBack">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span class="font-medium">Back to Contacts</span>
      </button>
      <div class="flex gap-3 w-full sm:w-auto justify-end">
        <button
          class="flex items-center gap-2 px-5 py-2.5 bg-white border border-primary/20 text-primary rounded-full hover:bg-primary-50 hover:shadow-md transition-all duration-300 ease-in-out"
          @click="navigateToEdit">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>Edit</span>
        </button>
        <button class="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ease-in-out"
          :class="confirmDelete ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white border border-accent/20 text-accent hover:bg-accent-50 hover:shadow-md'"
          @click="deleteContact">
          <svg v-if="!confirmDelete" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span v-if="!confirmDelete">Delete</span>
          <span v-else class="font-medium">Confirm Delete?</span>
        </button>
      </div>
    </div>

    <!-- Contact Profile Card -->
    <div
      class="bg-white rounded-3xl shadow-card overflow-hidden mb-10 transition-all duration-300 hover:shadow-card-hover">
      <!-- Profile Header -->
      <div class="relative bg-gradient-to-br from-primary-600 via-primary to-secondary-600 text-white overflow-hidden">
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-10">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="8" height="8" patternUnits="userSpaceOnUse">
                <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" stroke-width="0.5" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        <div class="relative max-w-4xl mx-auto p-8 sm:p-10 lg:p-12">
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <!-- Avatar -->
            <div class="relative flex-shrink-0 group">
              <div class="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                <img v-if="getAvatarUrl" :src="getAvatarUrl" alt="Avatar"
                  class="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-white/50 shadow-lg transition-transform duration-300 group-hover:scale-105" />
                <div v-else
                  class="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/90 text-primary-600 flex items-center justify-center text-4xl font-bold shadow-lg transition-transform duration-300 group-hover:scale-105">
                  {{ (contact.first_name?.[0] || '') + (contact.last_name?.[0] || '') }}
                </div>
              </div>
              <div
                class="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300 group-hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="text-center sm:text-left">
              <h1 class="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
                {{ contact.first_name }} {{ contact.last_name }}
              </h1>

              <!-- Groups Tags -->
              <div v-if="contactGroups.length > 0" class="flex flex-wrap gap-2 justify-center sm:justify-start">
                <div v-for="group in contactGroups" :key="group.id"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm shadow-sm border border-white/10 transition-all duration-300 hover:bg-white/30">
                  <span class="w-2 h-2 rounded-full bg-white"></span>
                  {{ group.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Details -->
      <div class="p-8 sm:p-10">
        <!-- Contact Info Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <!-- Email Card -->
          <div v-if="contact.email"
            class="group relative flex gap-5 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-primary-200 hover:bg-gradient-to-br hover:from-white hover:to-primary-50/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
            <!-- Decorative corner -->
            <div
              class="absolute -top-1 -right-1 w-12 h-12 bg-primary-100/20 rounded-full blur-xl group-hover:bg-primary-200/30 transition-all duration-300">
            </div>


            <div class="relative">
              <h3 class="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">Email</h3>
              <a :href="'mailto:' + contact.email"
                class="text-primary-700 hover:text-primary-600 font-medium text-base block transition-colors duration-300 group-hover:underline">{{
                  contact.email }}</a>
            </div>
          </div>

          <!-- Phone Card -->
          <div v-if="contact.phone"
            class="group relative flex gap-5 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-secondary-200 hover:bg-gradient-to-br hover:from-white hover:to-secondary-50/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
            <!-- Decorative corner -->
            <div
              class="absolute -top-1 -right-1 w-12 h-12 bg-secondary-100/20 rounded-full blur-xl group-hover:bg-secondary-200/30 transition-all duration-300">
            </div>


            <div class="relative">
              <h3 class="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">Phone</h3>
              <a :href="'tel:' + contact.phone"
                class="text-secondary-700 hover:text-secondary-600 font-medium text-base block transition-colors duration-300 group-hover:underline">{{
                  contact.phone }}</a>
            </div>
          </div>

          <!-- Address Card -->
          <div v-if="contact.address"
            class="group relative flex gap-5 p-6 bg-neutral-50 rounded-2xl border border-neutral-100 hover:border-neutral-200 hover:bg-gradient-to-br hover:from-white hover:to-neutral-50/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden">
            <!-- Decorative corner -->
            <div
              class="absolute -top-1 -right-1 w-12 h-12 bg-neutral-200/20 rounded-full blur-xl group-hover:bg-neutral-200/30 transition-all duration-300">
            </div>

            <div class="relative">
              <h3 class="text-xs font-semibold text-neutral-500 mb-2 uppercase tracking-wider">Address</h3>
              <p class="text-neutral-700 font-medium text-base">{{ contact.address }}</p>
            </div>
          </div>
        </div>

        <!-- Notes Section -->
        <div v-if="contact.notes" class="mb-10">
          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-10 h-10 bg-gradient-to-br from-secondary-100 to-secondary-50 text-secondary-600 rounded-xl flex items-center justify-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="text-base font-semibold text-neutral-700">Notes</h3>
          </div>
          <div
            class="group bg-neutral-50 p-6 rounded-2xl border border-neutral-100 hover:border-secondary-100 hover:bg-gradient-to-br hover:from-white hover:to-secondary-50/10 transition-all duration-300 hover:shadow-md relative overflow-hidden">
            <!-- Decorative elements -->
            <div
              class="absolute -top-6 -right-6 w-24 h-24 bg-secondary-100/10 rounded-full blur-xl group-hover:bg-secondary-100/20 transition-all duration-300">
            </div>
            <div
              class="absolute -bottom-8 -left-8 w-32 h-32 bg-secondary-50/10 rounded-full blur-xl group-hover:bg-secondary-50/20 transition-all duration-300">
            </div>

            <!-- Content -->
            <div class="relative">
              <p class="text-neutral-700 whitespace-pre-line leading-relaxed">{{ contact.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Metadata Footer -->
        <div
          class="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row justify-between text-xs text-neutral-500 gap-4">
          <div class="flex items-center gap-2">
            <div
              class="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="font-medium">Created:</span>
            <span>{{ new Date(contact.created_at).toLocaleDateString() }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div
              class="w-6 h-6 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <span class="font-medium">Last Updated:</span>
            <span>{{ new Date(contact.updated_at).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center py-24 px-4">
    <div class="relative">
      <div class="absolute -top-10 -left-10 w-40 h-40 bg-primary-100/30 rounded-full blur-xl animate-pulse"></div>
      <div
        class="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-100/30 rounded-full blur-xl animate-pulse delay-300">
      </div>
      <div class="relative w-20 h-20 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin mb-6">
      </div>
    </div>
    <p class="relative text-neutral-600 font-medium text-lg">Loading contact details...</p>
  </div>
</template>

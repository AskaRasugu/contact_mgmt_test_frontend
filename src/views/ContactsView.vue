<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import ContactCard from '../components/ContactCard.vue';

const router = useRouter();
const searchQuery = ref('');
const selectedGroupId = ref('');

const contacts = computed(() => {
  return store.state.contacts;
});

const groups = computed(() => {
  return store.state.groups;
});

const filteredContacts = computed(() => {
  let result = contacts.value;

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(contact =>
      contact.first_name.toLowerCase().includes(query) ||
      contact.last_name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      (contact.phone && contact.phone.toLowerCase().includes(query))
    );
  }

  // Filter by group
  if (selectedGroupId.value) {
    result = result.filter(contact =>
      contact.groups && contact.groups.some(group => group.id == selectedGroupId.value)
    );
  }

  return result;
});

const navigateToNewContact = () => {
  router.push({ name: 'contact-new' });
};

const handleContactClick = (contactId) => {
  router.push({ name: 'contact-details', params: { id: contactId } });
};

const handleEditContact = (contactId) => {
  router.push({ name: 'contact-edit', params: { id: contactId } });
};

const handleDeleteContact = (contactId) => {
  // Contact is already deleted by the ContactCard component
  // This is just for any additional cleanup if needed
  console.log('Contact deleted:', contactId);
};

const handleGroupChange = (event) => {
  selectedGroupId.value = event.target.value;
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedGroupId.value = '';
};

// Watch for changes in contacts and reload if needed
watch(() => store.state.contacts, (newContacts) => {
  // Contacts are already reactive through computed properties
}, { deep: true });
</script>

<template>
  <div class="w-full max-w-7xl mx-auto">
    <!-- Header Section with Title and Action Button -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
      <div class="flex flex-col">
        <div class="flex items-center gap-4">

          <h1 class="text-3xl font-extrabold text-gray-900 tracking-tight">Contacts</h1>
        </div>
        <p class="text-sm text-gray-500 mt-3">Manage your contacts and organize them into groups</p>
      </div>

      <button
        class="bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        @click="navigateToNewContact">
        <span class="text-lg font-bold">+</span>
        <span class="font-medium">New Contact</span>
      </button>
    </div>

    <!-- Search and Filter Section -->
    <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-10">
      <div class="flex flex-col md:flex-row gap-5">
        <!-- Search Input -->
        <div class="relative flex-1">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <font-awesome-icon icon="search" class="text-primary" />
          </div>
          <input type="text" v-model="searchQuery" placeholder="Search by name, email or phone..."
            class="block w-full pl-11 pr-10 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-sm shadow-sm" />
          <button v-if="searchQuery" @click="searchQuery = ''"
            class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-accent"
            aria-label="Clear search">
            <font-awesome-icon icon="times" class="text-xs" />
          </button>
        </div>

        <!-- Group Filter -->
        <div class="flex gap-3">
          <div class="relative">
            <select v-model="selectedGroupId" @change="handleGroupChange"
              class="appearance-none block w-full md:w-64 py-3.5 pl-4 pr-10 border border-gray-200 bg-white rounded-xl shadow-sm focus:ring-2 focus:ring-primary focus:border-primary text-sm">
              <option value="">All Groups</option>
              <option v-for="group in groups" :key="group.id" :value="group.id">
                {{ group.name }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <font-awesome-icon icon="chevron-down" class="w-5 h-5 text-primary" />
            </div>
          </div>

          <!-- Reset Button -->
          <button v-if="searchQuery || selectedGroupId" @click="clearFilters"
            class="flex items-center gap-2 px-5 py-3.5 border border-gray-200 rounded-xl bg-white text-gray-700 hover:bg-gray-50 text-sm transition-colors shadow-sm">
            <font-awesome-icon icon="sync" class="text-primary" /> Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <!-- Total Contacts Card -->
      <div
        class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-primary shadow-sm">
            <font-awesome-icon icon="folder" class="text-2xl" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Total Contacts</p>
            <p class="text-3xl font-extrabold text-gray-900">{{ contacts.length }}</p>
          </div>
        </div>
      </div>

      <!-- Groups Card -->
      <div
        class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-primary shadow-sm">
            <font-awesome-icon icon="tags" class="text-2xl" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Groups</p>
            <p class="text-3xl font-extrabold text-gray-900">{{ groups.length }}</p>
          </div>
        </div>
      </div>

      <!-- Filtered Results Card -->
      <div
        class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-0.5">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-primary shadow-sm">
            <font-awesome-icon icon="search" class="text-2xl" />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Filtered Results</p>
            <p class="text-3xl font-extrabold text-gray-900">{{ filteredContacts.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredContacts.length === 0"
      class="bg-white border border-gray-100 rounded-2xl shadow-md p-16 text-center">
      <div class="text-7xl opacity-50 mb-8"><font-awesome-icon icon="folder" /></div>
      <h2 class="text-3xl font-bold text-gray-900 mb-4" v-if="searchQuery || selectedGroupId">No matching contacts</h2>
      <h2 class="text-3xl font-bold text-gray-900 mb-4" v-else>No contacts yet</h2>
      <p class="text-gray-500 mb-10 max-w-lg mx-auto text-lg" v-if="searchQuery || selectedGroupId">Try changing your
        search or filter criteria to find what you're looking for.</p>
      <p class="text-gray-500 mb-10 max-w-lg mx-auto text-lg" v-else>Get started by adding your first contact to begin
        building your network.</p>
      <button v-if="!searchQuery && !selectedGroupId"
        class="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-xl inline-flex items-center gap-3 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium text-lg"
        @click="navigateToNewContact">
        <font-awesome-icon icon="plus" class="font-bold" /> Add Your First Contact
      </button>
    </div>

    <!-- Contact Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ContactCard 
        v-for="contact in filteredContacts" 
        :key="contact.id" 
        :contact="contact"
        @click="handleContactClick(contact.id)"
        @edit="handleEditContact"
        @delete="handleDeleteContact"
      />
    </div>
  </div>
</template>

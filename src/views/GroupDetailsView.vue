<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import ContactCard from '../components/ContactCard.vue';
import { groupApi } from '../services/api';

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

const router = useRouter();
const group = ref(null);
const confirmDelete = ref(false);

const contactsInGroup = computed(() => {
  if (!group.value) return [];
  return store.getContactsByGroupId(props.id);
});

onMounted(() => {
  loadGroup();
});

// Watch for changes in the store and update group if it changes
watch(() => store.getGroupById(props.id), (newGroup) => {
  if (newGroup) {
    group.value = newGroup;
  }
}, { deep: true });

const loadGroup = async () => {
  try {
    // First try to get from store
    let foundGroup = store.getGroupById(props.id);
    
    // If not in store, fetch from API
    if (!foundGroup) {
      const response = await groupApi.getById(props.id);
      foundGroup = response.data;
    }
    
    if (foundGroup) {
      group.value = foundGroup;
    } else {
      router.push({ name: 'groups' });
    }
  } catch (error) {
    console.error('Failed to load group:', error);
    router.push({ name: 'groups' });
  }
};

const navigateToEdit = () => {
  router.push({ name: 'group-edit', params: { id: props.id } });
};

const navigateBack = () => {
  router.push({ name: 'groups' });
};

const deleteGroup = async () => {
  if (confirmDelete.value) {
    try {
      await store.deleteGroup(props.id);
      router.push({ name: 'groups' });
    } catch (error) {
      console.error('Failed to delete group:', error);
      alert('Failed to delete group. Please try again.');
    }
  } else {
    confirmDelete.value = true;
    setTimeout(() => {
      confirmDelete.value = false;
    }, 3000);
  }
};

const handleContactClick = (contactId) => {
  router.push({ name: 'contact-details', params: { id: contactId } });
};
</script>

<template>
  <div v-if="group" class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <!-- Header with Back and Action Buttons -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 pb-6 mb-8 border-b border-gray-200">
      <button 
        class="flex items-center gap-2 px-4 py-2.5 bg-white/90 backdrop-blur-sm border border-neutral-200 rounded-full text-neutral-700 hover:bg-white hover:shadow-md transition-all duration-300 ease-in-out"
        @click="navigateBack"
      >
        <font-awesome-icon icon="arrow-left" class="h-5 w-5 text-primary" />
        <span class="font-medium">Back to Groups</span>
      </button>
      
      <div class="flex gap-3 w-full sm:w-auto justify-end">
        <button 
          class="flex items-center gap-2 px-5 py-2.5 bg-white border border-primary/20 text-primary rounded-full hover:bg-primary-50 hover:shadow-md transition-all duration-300 ease-in-out"
          @click="navigateToEdit"
        >
          <font-awesome-icon icon="edit" class="h-5 w-5" />
          <span>Edit</span>
        </button>
        <button 
          class="flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300 ease-in-out"
          :class="confirmDelete ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'bg-white border border-accent/20 text-accent hover:bg-accent-50 hover:shadow-md'"
          @click="deleteGroup"
        >
          <font-awesome-icon v-if="!confirmDelete" icon="trash" class="h-5 w-5" />
          <span v-if="!confirmDelete">Delete</span>
          <span v-else class="font-medium">Confirm Delete?</span>
        </button>
      </div>
    </div>
    
    <!-- Group Header Card -->
    <div class="bg-gradient-to-br rounded-3xl shadow-md overflow-hidden mb-10" :style="{ background: `linear-gradient(to bottom right, ${group.color}, ${group.color}CC)` }">
      <div class="p-8 sm:p-10 text-white max-w-4xl mx-auto">
        <h1 class="text-3xl sm:text-4xl font-extrabold mb-4 tracking-tight">{{ group.name }}</h1>
        <p v-if="group.description" class="text-white/90 text-lg mb-6 leading-relaxed">{{ group.description }}</p>
        <div class="flex items-center">
          <span class="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
            {{ contactsInGroup.length }} contacts
          </span>
        </div>
      </div>
    </div>
      
    <!-- Group Content -->
    <div class="mb-10">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <font-awesome-icon icon="users" class="text-primary" />
        Contacts in this group
      </h2>
      
      <!-- Empty State -->
      <div v-if="contactsInGroup.length === 0" class="bg-white border border-gray-100 rounded-2xl shadow-md p-16 text-center">
        <div class="text-7xl opacity-50 mb-8">
          <font-awesome-icon icon="folder" />
        </div>
        <h3 class="text-3xl font-bold text-gray-900 mb-4">No contacts in this group yet</h3>
        <p class="text-gray-500 mb-10 max-w-lg mx-auto text-lg">
          Add contacts to this group by editing a contact and selecting this group
        </p>
      </div>
      
      <!-- Contact Cards Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ContactCard 
          v-for="contact in contactsInGroup" 
          :key="contact.id" 
          :contact="contact"
          @click="handleContactClick(contact.id)"
        />
      </div>
    </div>
  </div>
  
  <!-- Loading State -->
  <div v-else class="flex flex-col items-center justify-center py-24 px-4">
    <div class="relative">
      <div class="absolute -top-10 -left-10 w-40 h-40 bg-primary-100/30 rounded-full blur-xl animate-pulse"></div>
      <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-100/30 rounded-full blur-xl animate-pulse delay-300"></div>
      <div class="relative w-20 h-20 border-4 border-neutral-200 border-t-primary-500 rounded-full animate-spin mb-6"></div>
    </div>
    <p class="relative text-neutral-600 font-medium text-lg">Loading group details...</p>
  </div>
</template>

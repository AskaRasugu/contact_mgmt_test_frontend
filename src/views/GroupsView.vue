<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store';
import GroupCard from '../components/GroupCard.vue';

const router = useRouter();
const searchQuery = ref('');

const groups = computed(() => {
  return store.state.groups;
});

const filteredGroups = computed(() => {
  if (!searchQuery.value) return groups.value;
  
  const query = searchQuery.value.toLowerCase();
  return groups.value.filter(group => 
    group.name.toLowerCase().includes(query) || 
    group.description.toLowerCase().includes(query)
  );
});

const getContactCountInGroup = (groupId) => {
  return store.getContactsByGroupId(groupId).length;
};

const navigateToNewGroup = () => {
  router.push({ name: 'group-new' });
};

const navigateToGroupDetails = (groupId) => {
  router.push({ name: 'group-details', params: { id: groupId } });
};

const handleEditGroup = (groupId) => {
  router.push({ name: 'group-edit', params: { id: groupId } });
};

const handleDeleteGroup = (groupId) => {
  // Group is already deleted by the GroupCard component
  // This is just for any additional cleanup if needed
  console.log('Group deleted:', groupId);
};

// Watch for changes in groups and reload if needed
watch(() => store.state.groups, (newGroups) => {
  // Groups are already reactive through computed properties
}, { deep: true });
</script>

<template>
  <div class="w-full">
    <div class="flex justify-between items-center border-b border-gray-200 pb-6 mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">Groups</h1>
        <p class="text-sm text-gray-500 mt-1">{{ filteredGroups.length }} groups</p>
      </div>
      
      <button 
        class="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary-dark transition-colors" 
        @click="navigateToNewGroup"
      >
        <span class="text-lg font-medium">+</span> New Group
      </button>
    </div>
    
    <div class="mb-6">
      <div class="relative max-w-md">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="text-gray-500 sm:text-sm">🔍</span>
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search groups..."
          class="block w-full pl-10 pr-10 py-2 border border-gray-200 rounded-md focus:ring-primary focus:border-primary text-sm"
        />
        <button 
          v-if="searchQuery" 
          @click="searchQuery = ''" 
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-accent"
          aria-label="Clear search"
        >
          <span class="text-xs">✕</span>
        </button>
      </div>
    </div>
    
    <div v-if="filteredGroups.length === 0" class="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
      <div class="text-5xl opacity-50 mb-4">📁</div>
      <h2 class="text-xl font-semibold text-gray-900 mb-2" v-if="searchQuery">No matching groups</h2>
      <h2 class="text-xl font-semibold text-gray-900 mb-2" v-else>No groups yet</h2>
      <p class="text-gray-500 mb-6" v-if="searchQuery">Try changing your search criteria</p>
      <p class="text-gray-500 mb-6" v-else>Get started by adding your first group</p>
      <button 
        v-if="!searchQuery" 
        class="bg-primary text-white px-4 py-2 rounded-md inline-flex items-center gap-2 hover:bg-primary-dark transition-colors mt-4" 
        @click="navigateToNewGroup"
      >
        <span>+</span> Add Group
      </button>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <GroupCard 
        v-for="group in filteredGroups" 
        :key="group.id" 
        :group="group"
        @click="navigateToGroupDetails(group.id)"
        @edit="handleEditGroup"
        @delete="handleDeleteGroup"
      />
    </div>
  </div>
</template>


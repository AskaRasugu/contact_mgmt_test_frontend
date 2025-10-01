<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import store from './store'

onMounted(async () => {
  try {
    await store.initStore()
  } catch (error) {
    console.error('Failed to initialize store:', error)
  }
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <header class="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div class="flex items-center gap-3">

          <h1 class="text-xl font-bold text-gray-800 tracking-tight">Contact<span class="text-primary">Manager</span>
          </h1>
        </div>

        <nav class="flex gap-3">
          <RouterLink to="/contacts"
            class="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:text-primary hover:bg-gray-100 transition-all"
            :class="{ 'text-primary font-medium bg-primary bg-opacity-10': $route.path.includes('/contacts') }">
            <font-awesome-icon icon="users" class="text-lg" />
            <span class="text-sm font-medium">Contacts</span>
          </RouterLink>
          <RouterLink to="/groups"
            class="flex items-center gap-2 px-4 py-2 rounded-full text-gray-600 hover:text-primary hover:bg-gray-100 transition-all"
            :class="{ 'text-primary font-medium bg-primary bg-opacity-10': $route.path.includes('/groups') }">
            <font-awesome-icon icon="tags" class="text-lg" />
            <span class="text-sm font-medium">Groups</span>
          </RouterLink>

        </nav>
      </div>
    </header>

    <main class="flex-1 container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <footer class="bg-white border-t border-gray-100 py-6 text-center">
      <div class="container mx-auto">
        <p class="text-sm text-gray-500">&copy; {{ new Date().getFullYear() }} <span
            class="text-primary font-medium">Contact Manager</span></p>
      </div>
    </footer>
  </div>
</template>

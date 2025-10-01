import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ContactsView.vue'),
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: () => import('../views/ContactsView.vue'),
    },
    {
      path: '/contacts/new',
      name: 'contact-new',
      component: () => import('../views/ContactFormView.vue'),
    },
    {
      path: '/contacts/:id',
      name: 'contact-details',
      component: () => import('../views/ContactDetailsView.vue'),
      props: true,
    },
    {
      path: '/contacts/:id/edit',
      name: 'contact-edit',
      component: () => import('../views/ContactFormView.vue'),
      props: true,
    },
    {
      path: '/groups',
      name: 'groups',
      component: () => import('../views/GroupsView.vue'),
    },
    {
      path: '/groups/new',
      name: 'group-new',
      component: () => import('../views/GroupFormView.vue'),
    },
    {
      path: '/groups/:id',
      name: 'group-details',
      component: () => import('../views/GroupDetailsView.vue'),
      props: true,
    },
    {
      path: '/groups/:id/edit',
      name: 'group-edit',
      component: () => import('../views/GroupFormView.vue'),
      props: true,
    },
  ],
})

export default router

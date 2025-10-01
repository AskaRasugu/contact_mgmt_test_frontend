import { reactive, readonly } from 'vue'
import { contactApi, groupApi } from '../services/api'

// Initial state
const state = reactive({
  contacts: [],
  groups: [],
  selectedContactId: null,
  selectedGroupId: null,
  isLoading: false,
  error: null,
  pagination: null,
})

// Load data from API
const loadContacts = async (params = {}) => {
  try {
    state.isLoading = true
    state.error = null
    const response = await contactApi.getAll(params)
    state.contacts = response.data.data || response.data
    state.pagination = response.data.meta || null
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to load contacts'
    console.error('Failed to load contacts:', error)
  } finally {
    state.isLoading = false
  }
}

const loadGroups = async () => {
  try {
    state.isLoading = true
    state.error = null
    const response = await groupApi.getAll()
    state.groups = response.data
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to load groups'
    console.error('Failed to load groups:', error)
  } finally {
    state.isLoading = false
  }
}

const addContact = async (contactData) => {
  try {
    state.isLoading = true
    state.error = null
    const response = await contactApi.create(contactData)
    const newContact = response.data.contact
    state.contacts.push(newContact)
    return newContact
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to create contact'
    console.error('Failed to create contact:', error)
    throw error
  } finally {
    state.isLoading = false
  }
}

const updateContact = async (id, contactData) => {
  try {
    state.isLoading = true
    state.error = null
    const response = await contactApi.update(id, contactData)
    const updatedContact = response.data.contact
    const index = state.contacts.findIndex((contact) => contact.id == id)
    if (index !== -1) {
      state.contacts[index] = updatedContact
    } else {
      // If contact not found in store, add it
      state.contacts.push(updatedContact)
    }
    return updatedContact
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to update contact'
    console.error('Failed to update contact:', error)
    throw error
  } finally {
    state.isLoading = false
  }
}

const deleteContact = async (id) => {
  try {
    state.isLoading = true
    state.error = null
    await contactApi.delete(id)
    const index = state.contacts.findIndex((contact) => contact.id == id)
    if (index !== -1) {
      state.contacts.splice(index, 1)
    }
    if (state.selectedContactId == id) {
      state.selectedContactId = null
    }
    return true
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to delete contact'
    console.error('Failed to delete contact:', error)
    throw error
  } finally {
    state.isLoading = false
  }
}

const getContactById = (id) => {
  return state.contacts.find((contact) => contact.id == id) || null
}

const selectContact = (id) => {
  state.selectedContactId = id
}

const addGroup = async (groupData) => {
  try {
    state.isLoading = true
    state.error = null
    const response = await groupApi.create(groupData)
    const newGroup = response.data.group
    state.groups.push(newGroup)
    return newGroup
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to create group'
    console.error('Failed to create group:', error)
    throw error
  } finally {
    state.isLoading = false
  }
}

const updateGroup = async (id, groupData) => {
  try {
    state.isLoading = true
    state.error = null
    const response = await groupApi.update(id, groupData)
    const updatedGroup = response.data.group
    const index = state.groups.findIndex((group) => group.id == id)
    if (index !== -1) {
      state.groups[index] = updatedGroup
    } else {
      // If group not found in store, add it
      state.groups.push(updatedGroup)
    }
    return updatedGroup
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to update group'
    console.error('Failed to update group:', error)
    throw error
  } finally {
    state.isLoading = false
  }
}

const deleteGroup = async (id) => {
  try {
    state.isLoading = true
    state.error = null
    await groupApi.delete(id)
    const index = state.groups.findIndex((group) => group.id == id)
    if (index !== -1) {
      state.groups.splice(index, 1)
    }
    if (state.selectedGroupId == id) {
      state.selectedGroupId = null
    }
    return true
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to delete group'
    console.error('Failed to delete group:', error)
    throw error
  } finally {
    state.isLoading = false
  }
}

const getGroupById = (id) => {
  return state.groups.find((group) => group.id == id) || null
}

const selectGroup = (id) => {
  state.selectedGroupId = id
}

const getContactsByGroupId = (groupId) => {
  return state.contacts.filter((contact) => 
    contact.groups && contact.groups.some(group => group.id === groupId)
  )
}

const addContactToGroup = async (contactId, groupId) => {
  try {
    const contact = getContactById(contactId)
    if (contact) {
      const currentGroupIds = contact.groups ? contact.groups.map(g => g.id) : []
      if (!currentGroupIds.includes(groupId)) {
        const updatedGroupIds = [...currentGroupIds, groupId]
        await updateContact(contactId, { group_ids: updatedGroupIds })
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Failed to add contact to group:', error)
    return false
  }
}

const removeContactFromGroup = async (contactId, groupId) => {
  try {
    const contact = getContactById(contactId)
    if (contact && contact.groups) {
      const updatedGroupIds = contact.groups
        .filter(group => group.id !== groupId)
        .map(group => group.id)
      await updateContact(contactId, { group_ids: updatedGroupIds })
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to remove contact from group:', error)
    return false
  }
}

const initStore = async () => {
  await Promise.all([
    loadContacts(),
    loadGroups()
  ])
}

export default {
  state: readonly(state),
  // Contact methods
  loadContacts,
  addContact,
  updateContact,
  deleteContact,
  getContactById,
  selectContact,
  // Group methods
  loadGroups,
  addGroup,
  updateGroup,
  deleteGroup,
  getGroupById,
  selectGroup,
  getContactsByGroupId,
  addContactToGroup,
  removeContactFromGroup,
  // Initialization
  initStore,
}


import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Contact API methods
export const contactApi = {
  // Get all contacts with optional search and group filter
  getAll: (params = {}) => api.get('/contacts', { params }),
  
  // Get single contact by ID
  getById: (id) => api.get(`/contacts/${id}`),
  
  // Create new contact
  create: (contactData) => api.post('/contacts', contactData),
  
  // Update contact
  update: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  
  // Delete contact
  delete: (id) => api.delete(`/contacts/${id}`),
}

// Group API methods
export const groupApi = {
  // Get all groups
  getAll: () => api.get('/groups'),
  
  // Get single group by ID with contacts
  getById: (id) => api.get(`/groups/${id}`),
  
  // Create new group
  create: (groupData) => api.post('/groups', groupData),
  
  // Update group
  update: (id, groupData) => api.put(`/groups/${id}`, groupData),
  
  // Delete group
  delete: (id) => api.delete(`/groups/${id}`),
}

export default api

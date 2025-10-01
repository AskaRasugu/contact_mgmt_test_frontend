# Vue.js Frontend Setup Guide

## 🎯 Frontend Repository
**Repository**: [https://github.com/AskaRasugu/contact_mgmt_test_frontend.git](https://github.com/AskaRasugu/contact_mgmt_test_frontend.git)

## 📋 Prerequisites

Before setting up the frontend, ensure you have:

- **Node.js** >= 18.x ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn**
- **Git** for cloning the repository
- **Backend API** running on `http://localhost:8000`

## 🚀 Installation Steps

### 1. Clone the Frontend Repository

```bash
git clone https://github.com/AskaRasugu/contact_mgmt_test_frontend.git
cd contact_mgmt_test_frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

The frontend is configured to connect to the Laravel backend API. Ensure your backend is running on `http://localhost:8000`.

If your backend runs on a different port or domain, update the API base URL in:
```
src/services/api.js
```

Change the `baseURL` to match your backend:
```javascript
const api = axios.create({
  baseURL: 'http://your-backend-url:port/api',
  // ... other config
});
```

### 4. Start Development Server

```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

The frontend will be available at: **http://localhost:5173**

## 🏗️ Project Structure

```
contact_mgmt_test_frontend/
├── public/
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── assets/              # Static assets (CSS, images)
│   ├── components/          # Reusable Vue components
│   │   ├── ContactCard.vue  # Contact display component
│   │   └── GroupCard.vue    # Group display component
│   ├── views/               # Page components
│   │   ├── ContactsView.vue      # Contacts listing
│   │   ├── ContactFormView.vue   # Contact create/edit
│   │   ├── ContactDetailsView.vue # Contact details
│   │   ├── GroupsView.vue        # Groups listing
│   │   ├── GroupFormView.vue     # Group create/edit
│   │   └── GroupDetailsView.vue  # Group details
│   ├── services/            # API service layer
│   │   └── api.js          # Axios configuration & API calls
│   ├── store/              # State management
│   │   └── index.js        # Vue reactive store
│   ├── router/             # Vue Router configuration
│   │   └── index.js        # Route definitions
│   ├── plugins/            # Vue plugins
│   │   └── fontawesome.js  # FontAwesome icons
│   ├── App.vue             # Root component
│   └── main.js             # Application entry point
├── .gitignore
├── .prettierrc.json        # Code formatting rules
├── index.html              # HTML template
├── jsconfig.json           # JavaScript configuration
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite build configuration
```

## 🎨 Technologies Used

### Core Technologies
- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Vue Router** - Official router for Vue.js
- **Axios** - HTTP client for API requests

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **FontAwesome** - Icon library
- **PostCSS** - CSS processing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vite DevTools** - Development debugging

## 📱 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload

# Building
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run format       # Format code with Prettier
```

## 🔧 Configuration Files

### Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true
  }
})
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        accent: '#EF4444'
      }
    },
  },
  plugins: [],
}
```

## 🌐 API Integration

### API Service Layer (`src/services/api.js`)

The frontend communicates with the Laravel backend through a centralized API service:

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export const contactApi = {
  getAll: (params = {}) => api.get('/contacts', { params }),
  create: (contactData) => api.post('/contacts', contactData),
  update: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  delete: (id) => api.delete(`/contacts/${id}`),
}

export const groupApi = {
  getAll: () => api.get('/groups'),
  create: (groupData) => api.post('/groups', groupData),
  update: (id, groupData) => api.put(`/groups/${id}`, groupData),
  delete: (id) => api.delete(`/groups/${id}`),
}
```

## 🗂️ State Management

### Custom Vue Store (`src/store/index.js`)

The application uses a custom reactive store for state management:

```javascript
import { reactive, readonly } from 'vue'
import { contactApi, groupApi } from '../services/api'

const state = reactive({
  contacts: [],
  groups: [],
  isLoading: false,
  error: null,
})

// CRUD operations
const addContact = async (contactData) => {
  try {
    state.isLoading = true
    const response = await contactApi.create(contactData)
    state.contacts.push(response.data.contact)
    return response.data.contact
  } catch (error) {
    state.error = error.response?.data?.message || 'Failed to create contact'
    throw error
  } finally {
    state.isLoading = false
  }
}

export default {
  state: readonly(state),
  addContact,
  // ... other methods
}
```

## 🎯 Key Features

### 1. Responsive Design
- Mobile-first approach
- Tailwind CSS for styling
- Responsive grid layouts
- Touch-friendly interface

### 2. Real-time Updates
- Reactive state management
- Automatic UI updates
- No page reload required
- Optimistic updates

### 3. Form Handling
- Client-side validation
- Server-side error handling
- Loading states
- Success/error feedback

### 4. Search & Filtering
- Real-time search
- Group filtering
- Advanced filtering options
- Clear filters functionality

## 🚀 Development Workflow

### 1. Start Development
```bash
npm run dev
```

### 2. Make Changes
- Edit Vue components in `src/`
- Changes auto-reload in browser
- Hot module replacement enabled

### 3. Code Formatting
```bash
npm run format
```

### 4. Build for Production
```bash
npm run build
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

#### 2. API Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check CORS configuration in Laravel
- Verify API endpoints are accessible

#### 3. Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Build Issues
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Rebuild
npm run build
```

## 📦 Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy the `dist` Folder
- Upload `dist` folder contents to your web server
- Configure web server to serve `index.html` for all routes
- Set up proper caching headers

### 3. Environment Configuration
Update API base URL for production:
```javascript
// In src/services/api.js
const api = axios.create({
  baseURL: 'https://your-production-api.com/api',
  // ... other config
});
```

## 🎨 Customization

### Adding New Components
1. Create component in `src/components/`
2. Import and use in views
3. Follow Vue 3 Composition API patterns

### Styling Customization
- Modify `tailwind.config.js` for theme changes
- Add custom CSS in `src/assets/`
- Use Tailwind utility classes

### Adding New Routes
1. Update `src/router/index.js`
2. Create corresponding view component
3. Add navigation links

## 📚 Learning Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)

---

**The frontend is now ready for development! Start the dev server and begin building your contacts management interface.**

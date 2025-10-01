import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { 
  faUsers, 
  faTags, 
  faSearch, 
  faArrowLeft, 
  faPlus, 
  faCheck, 
  faTrash, 
  faEnvelope, 
  faPhone, 
  faLocationDot,
  faEye,
  faEdit,
  faExclamationTriangle,
  faSync,
  faFilter,
  faTimes,
  faChevronDown,
  faFolder,
  faChevronRight,
  faUser
} from '@fortawesome/free-solid-svg-icons';

// Add icons to the library
library.add(
  faUsers,
  faTags,
  faSearch,
  faArrowLeft,
  faPlus,
  faCheck,
  faTrash,
  faEnvelope,
  faPhone,
  faLocationDot,
  faEye,
  faEdit,
  faExclamationTriangle,
  faSync,
  faFilter,
  faTimes,
  faChevronDown,
  faFolder,
  faChevronRight,
  faUser
);

export default {
  install: (app) => {
    app.component('font-awesome-icon', FontAwesomeIcon);
  }
};

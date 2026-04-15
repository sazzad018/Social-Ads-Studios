import axios from 'axios';

// Configure axios to use the PHP API directly if .htaccess fails
// This is a workaround for shared hosting environments
const api = axios.create({
  baseURL: import.meta.env.PROD ? '/api/api.php' : '/api'
});

export default api;

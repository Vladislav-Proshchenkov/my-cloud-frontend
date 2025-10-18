import api from './api';

export const authAPI = {
  login: (username, password) => 
    api.post('/users/login/', { username, password }),
  
  register: (userData) => 
    api.post('/users/register/', userData),
  
  logout: () => 
    api.post('/users/logout/'),
};

export const storageAPI = {
  getFiles: () => 
    api.get('/storage/files/'),
  
  uploadFile: (file, comment = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);
    return api.post('/storage/files/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  deleteFile: (fileId) => 
    api.delete(`/storage/files/${fileId}/`),
  
  downloadFile: (fileId) => 
    api.get(`/storage/files/${fileId}/download/`, { 
      responseType: 'blob' 
    }),
  
  generateLink: (fileId) => 
    api.post(`/storage/files/${fileId}/generate_link/`),

  getUserFiles: (userId) => 
    api.get(`/storage/files/?user_id=${userId}`),
};

export const usersAPI = {
  getUsers: () => api.get('/users/'),
  deleteUser: (userId) => api.delete(`/users/${userId}/`),
  toggleAdmin: (userId) => api.post(`/users/${userId}/toggle-admin/`),
};
import api from './api';

export const authAPI = {
  login: (username, password) => 
    api.post('/api/users/login/', { username, password }),
  
  register: (userData) => 
    api.post('/api/users/register/', userData),
  
  logout: () => 
    api.post('/api/users/logout/'),
};

export const storageAPI = {
  getFiles: () => api.get('/api/storage/files/'),
  
  uploadFile: (file, comment = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (comment) {
      formData.append('comment', comment);
    }
    return api.post('/api/storage/files/', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      }
    });
  },
  
  deleteFile: (fileId) => 
    api.delete(`/api/storage/files/${fileId}/`),
  
  downloadFile: (fileId) => 
    api.get(`/api/storage/files/${fileId}/download/`, { 
      responseType: 'blob' 
    }),
  
  createShare: (fileId) => 
    api.post(`/api/storage/files/${fileId}/share/`),
  
  updateFile: (fileId, data) => 
    api.patch(`/api/storage/files/${fileId}/`, data),
  
  getFileByUniqueId: (uniqueIdentifier) => 
    api.get(`/api/storage/files/public/${uniqueIdentifier}/info/`),
  
  downloadFileByUniqueId: (uniqueIdentifier) => 
    api.get(`/api/storage/files/public/${uniqueIdentifier}/download/`, { 
      responseType: 'blob' 
    }),

  updateFileInfo: (fileId, data) => 
    api.patch(`/api/storage/files/${fileId}/`, data),

  previewFile: (fileId) => 
    api.get(`/api/storage/files/${fileId}/preview/`, { 
      responseType: 'blob' 
    }),
  
  previewFileByUniqueId: (uniqueIdentifier) => 
    api.get(`/api/storage/files/public/${uniqueIdentifier}/preview/`, { 
      responseType: 'blob' 
    }),
};

export const usersAPI = {
  getUsers: () => api.get('/api/users/'),
  deleteUser: (userId) => api.delete(`/api/users/${userId}/`),
  updateAdminStatus: (userId, isAdmin) => 
    api.patch(`/api/users/${userId}/admin_status/`, { is_admin: isAdmin }),
  getStats: () => api.get('/api/stats/'),
  getUserFiles: (userId) => api.get(`/api/storage/admin/users/${userId}/files/`),
  toggleAdmin: (userId) => 
    api.patch(`/api/users/${userId}/admin_status/`),
  
  getAllFiles: () => api.get('/api/storage/admin/files/'),
  getUserFiles: (userId) => api.get(`/api/storage/admin/files/?user_id=${userId}`),
  getAllFiles: () => api.get('/api/storage/admin/files/'),
  getUserFiles: (userId) => api.get(`/api/storage/admin/files/?user_id=${userId}`),
  
  adminDownloadFile: (fileId) => 
    api.get(`/api/storage/files/${fileId}/download/`, { 
      responseType: 'blob' 
    }),
  adminPreviewFile: (fileId) => 
    api.get(`/api/storage/files/${fileId}/preview/`, { 
      responseType: 'blob' 
    }),
  adminUpdateFile: (fileId, data) => 
    api.patch(`/api/storage/files/${fileId}/`, data),
  adminDeleteFile: (fileId) => 
    api.delete(`/api/storage/files/${fileId}/`),
};
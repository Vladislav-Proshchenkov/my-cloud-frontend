import React, { useState, useEffect } from 'react';
import { usersAPI, storageAPI } from '../../services/auth';
import EditFileModal from '../EditFileModal/EditFileModal';
import styles from './UserFiles.module.css';

const UserFiles = ({ user, onClose }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const isAdminView = true; 

  useEffect(() => {
    console.log("UserFiles mounted for user:", user.id, user.username);
    loadUserFiles();
  }, [user]);

  const loadUserFiles = async () => {
    setLoading(true);
    try {
        console.log("=== DEBUG UserFiles loadUserFiles ===");
        console.log("User prop:", user);
        
        const response = await usersAPI.getUserFiles(user.id);
        console.log("API Response data:", response.data);
        
        setFiles(response.data);
    } catch (error) {
        console.error('Ошибка загрузки файлов:', error);
        alert('Ошибка загрузки файлов пользователя');
    } finally {
        setLoading(false);
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await usersAPI.adminDownloadFile(fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка скачивания:', error);
      alert('Ошибка скачивания файла');
    }
  };

  const handleDelete = async (fileId, fileName) => {
    if (!window.confirm(`Удалить файл "${fileName}" пользователя ${user.username}?`)) {
      return;
    }

    try {
      await usersAPI.adminDeleteFile(fileId);
      await loadUserFiles();
      alert('Файл удален');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления файла');
    }
  };

  const handleEdit = (file) => {
    setEditingFile(file);
  };

  const handleSaveEdit = async (updatedData) => {
    try {
      await usersAPI.adminUpdateFile(editingFile.id, updatedData);
      await loadUserFiles();
      alert('Файл успешно обновлен!');
    } catch (error) {
      console.error('Ошибка обновления файла:', error);
      alert('Ошибка обновления файла');
      throw error;
    }
  };

  const handlePreview = async (fileId) => {
    try {
      const response = await usersAPI.adminPreviewFile(fileId);
      const url = URL.createObjectURL(response.data);
      setPreviewUrl(url);
      setPreviewFile(fileId);
    } catch (error) {
      console.error('Ошибка загрузки preview:', error);
      alert('Не удалось загрузить preview файла');
    }
  };

  const closePreview = () => {
    setPreviewFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  return (
    <div className={styles.userFiles}>
      <div className={styles.header}>
        <h3>Файлы пользователя: {user.username}</h3>
        <button onClick={onClose} className={styles.closeBtn}>×</button>
      </div>
      
      <div className={styles.filesInfo}>
        <p>Всего файлов: {files.length}</p>
        <p>Общий размер: {formatFileSize(files.reduce((total, file) => total + file.size, 0))}</p>
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка файлов...</div>
      ) : files.length === 0 ? (
        <div className={styles.empty}>У пользователя нет файлов</div>
      ) : (
        <div className={styles.filesList}>
          {files.map(file => (
            <div key={file.id} className={styles.fileItem}>
              <div className={styles.fileInfo}>
                <div className={styles.fileName}>{file.original_name}</div>
                <div className={styles.fileDetails}>
                  <span>Размер: {formatFileSize(file.size)}</span>
                  <span>Загружен: {formatDate(file.upload_date)}</span>
                  {file.last_download && (
                    <span>Скачан: {formatDate(file.last_download)}</span>
                  )}
                  {file.comment && (
                    <span>Комментарий: {file.comment}</span>
                  )}
                </div>
              </div>
              <div className={styles.fileActions}>
                <button
                  onClick={() => handlePreview(file.id)}
                  className={styles.previewButton}
                >
                  Просмотр
                </button>  
                
                <button
                  onClick={() => handleDownload(file.id, file.original_name)}
                  className={styles.downloadButton}
                >
                  Скачать
                </button>
                <button
                  onClick={() => handleEdit(file)}
                  className={styles.editButton}
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(file.id, file.original_name)}
                  className={styles.deleteButton}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingFile && (
        <EditFileModal
          file={editingFile}
          onSave={handleSaveEdit}
          onClose={() => setEditingFile(null)}
        />
      )}

      {previewFile && previewUrl && (
        <div className={styles.previewModal}>
          <div className={styles.previewModalContent}>
            <div className={styles.previewModalHeader}>
              <h3>Просмотр файла</h3>
              <button onClick={closePreview} className={styles.closeButton}>×</button>
            </div>
            <div className={styles.previewModalBody}>
              <iframe 
                src={previewUrl} 
                className={styles.previewIframe}
                title="File Preview"
              />
              <div className={styles.previewActions}>
                <button 
                  onClick={() => handleDownload(previewFile)}
                  className={styles.downloadButton}
                >
                  Скачать файл
                </button>
                <button 
                  onClick={closePreview}
                  className={styles.closeButton}
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserFiles;
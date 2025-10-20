import React, { useState, useEffect } from 'react';
import { storageAPI } from '../../services/auth';
import EditFileModal from '../EditFileModal/EditFileModal';
import styles from './UserFiles.module.css';

const UserFiles = ({ user, onClose }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingFile, setEditingFile] = useState(null);

  useEffect(() => {
    loadUserFiles();
  }, [user]);

  const loadUserFiles = async () => {
    setLoading(true);
    try {
      const response = await storageAPI.getFiles(`?user_id=${user.id}`);
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
      const response = await storageAPI.downloadFile(fileId);
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
      await storageAPI.deleteFile(fileId);
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
      await storageAPI.updateFileInfo(editingFile.id, updatedData);
      await loadUserFiles();
      alert('Файл успешно обновлен!');
    } catch (error) {
      console.error('Ошибка обновления файла:', error);
      alert('Ошибка обновления файла');
      throw error;
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
    </div>
  );
};

export default UserFiles;
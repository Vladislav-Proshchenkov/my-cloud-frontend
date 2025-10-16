import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { storageAPI } from '../services/auth';
import styles from './Storage.module.css';

const Storage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [comment, setComment] = useState('');
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const response = await storageAPI.getFiles();
      setFiles(response.data);
    } catch (error) {
      console.error('Ошибка загрузки файлов:', error);
      alert('Ошибка загрузки файлов');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Выберите файл для загрузки');
      return;
    }

    setUploading(true);
    try {
      await storageAPI.uploadFile(selectedFile, comment);
      setSelectedFile(null);
      setComment('');
      document.getElementById('file-input').value = '';
      await loadFiles();
      alert('Файл успешно загружен!');
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      alert('Ошибка загрузки файла');
    } finally {
      setUploading(false);
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
      
      await loadFiles();
    } catch (error) {
      console.error('Ошибка скачивания:', error);
      alert('Ошибка скачивания файла');
    }
  };

  const handleDelete = async (fileId, fileName) => {
    if (!window.confirm(`Удалить файл "${fileName}"?`)) {
      return;
    }

    try {
      await storageAPI.deleteFile(fileId);
      await loadFiles();
      alert('Файл удален');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления файла');
    }
  };

  const handleGenerateLink = async (fileId) => {
    try {
      const response = await storageAPI.generateLink(fileId);
      const publicUrl = `${window.location.origin}${response.data.public_url}`;
      navigator.clipboard.writeText(publicUrl);
      alert('Публичная ссылка скопирована в буфер обмена!');
    } catch (error) {
      console.error('Ошибка генерации ссылки:', error);
      alert('Ошибка генерации ссылки');
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
    <div className={styles.storageContainer}>
      <h1 className={styles.title}>Мое файловое хранилище</h1>
      
      {}
      <div className={styles.uploadSection}>
        <h2>Загрузить новый файл</h2>
        <form onSubmit={handleUpload} className={styles.uploadForm}>
          <div className={styles.formGroup}>
            <input
              id="file-input"
              type="file"
              onChange={handleFileSelect}
              className={styles.fileInput}
              disabled={uploading}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="text"
              placeholder="Комментарий к файлу (необязательно)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={styles.commentInput}
              disabled={uploading}
            />
          </div>
          <button 
            type="submit" 
            className={styles.uploadButton}
            disabled={uploading || !selectedFile}
          >
            {uploading ? 'Загрузка...' : 'Загрузить файл'}
          </button>
        </form>
      </div>

      {}
      <div className={styles.filesSection}>
        <h2>Мои файлы ({files.length})</h2>
        
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : files.length === 0 ? (
          <div className={styles.empty}>Файлы не найдены</div>
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
                    onClick={() => handleGenerateLink(file.id)}
                    className={styles.linkButton}
                  >
                    Получить ссылку
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
      </div>
    </div>
  );
};

export default Storage;
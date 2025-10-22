import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storageAPI } from '../services/auth';
import styles from './PublicFilePage.module.css';

const PublicFilePage = () => {
  const { uniqueIdentifier } = useParams();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFileInfo();
  }, [uniqueIdentifier]);

  const loadFileInfo = async () => {
    try {
      const response = await storageAPI.getFileByUniqueId(uniqueIdentifier);
      setFile(response.data);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      setError('Файл не найден или ссылка недействительна');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await storageAPI.downloadFileByUniqueId(uniqueIdentifier);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.original_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      await loadFileInfo();
    } catch (error) {
      console.error('Ошибка скачивания:', error);
      alert('Ошибка скачивания файла');
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

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Загрузка информации о файле...</div>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Файл не найден</h2>
          <p>{error || 'Ссылка на файл недействительна или файл был удален'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.fileCard}>
        <div className={styles.fileIcon}>📄</div>
        <h1 className={styles.fileName}>{file.original_name}</h1>
        
        <div className={styles.fileInfo}>
          <div className={styles.infoItem}>
            <strong>Размер:</strong> {formatFileSize(file.size)}
          </div>
          <div className={styles.infoItem}>
            <strong>Загружен:</strong> {formatDate(file.upload_date)}
          </div>
          {file.last_download && (
            <div className={styles.infoItem}>
              <strong>Последнее скачивание:</strong> {formatDate(file.last_download)}
            </div>
          )}
        </div>

        {file.comment && (
          <div className={styles.comment}>
            <strong>Комментарий:</strong> {file.comment}
          </div>
        )}

        <button 
          onClick={handleDownload}
          className={styles.downloadButton}
        >
          Скачать файл
        </button>

        <div className={styles.note}>
          Этот файл доступен по публичной ссылке из облачного хранилища My Cloud
        </div>
      </div>
    </div>
  );
};

export default PublicFilePage;
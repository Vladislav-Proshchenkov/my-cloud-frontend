import React, { useState } from 'react';
import styles from './EditFileModal.module.css';

const EditFileModal = ({ file, onSave, onClose }) => {
  const [originalName, setOriginalName] = useState(file.original_name);
  const [comment, setComment] = useState(file.comment || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave({
        original_name: originalName,
        comment: comment
      });
      onClose();
    } catch (error) {
      console.error('Ошибка сохранения:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOriginalName(file.original_name);
    setComment(file.comment || '');
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Редактирование файла</h3>
          <button onClick={handleClose} className={styles.closeButton}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Имя файла</label>
            <input
              type="text"
              value={originalName}
              onChange={(e) => setOriginalName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Комментарий</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className={styles.textarea}
              rows="3"
              placeholder="Введите комментарий к файлу..."
            />
          </div>
          
          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={loading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFileModal;
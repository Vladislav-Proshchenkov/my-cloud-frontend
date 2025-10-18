import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { usersAPI } from '../services/auth';
import styles from './Admin.module.css';
import UserFiles from '../components/UserFiles/UserFiles';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { user: currentUser } = useSelector(state => state.auth);

  useEffect(() => {
    if (currentUser?.is_admin) {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
      alert('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId, currentStatus) => {
    try {
      await usersAPI.toggleAdmin(userId);
      await loadUsers();
      alert(`Статус администратора ${currentStatus ? 'снят' : 'установлен'}`);
    } catch (error) {
      console.error('Ошибка изменения статуса:', error);
      alert('Ошибка изменения статуса администратора');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Удалить пользователя "${username}"?`)) {
      return;
    }

    try {
      await usersAPI.deleteUser(userId);
      await loadUsers();
      alert('Пользователь удален');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка удаления пользователя');
    }
  };

  const handleViewFiles = (user) => {
    setSelectedUser(user);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  if (!currentUser?.is_admin) {
    return (
      <div className={styles.adminContainer}>
        <div className={styles.accessDenied}>
          <h2>Доступ запрещен</h2>
          <p>Только администраторы могут просматривать эту страницу</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminContainer}>
      <h1 className={styles.title}>Панель администратора</h1>
      
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <h3>Всего пользователей</h3>
          <p>{users.length}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Администраторов</h3>
          <p>{users.filter(u => u.is_admin).length}</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Загрузка пользователей...</div>
      ) : (
        <div className={styles.usersTable}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Логин</th>
                <th>Имя</th>
                <th>Email</th>
                <th>Дата регистрации</th>
                <th>Администратор</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.first_name || '-'} {user.last_name || '-'}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.date_joined)}</td>
                  <td>
                    <span className={user.is_admin ? styles.adminBadge : styles.userBadge}>
                      {user.is_admin ? 'Да' : 'Нет'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                        className={styles.toggleButton}
                        disabled={user.id === currentUser.id}
                      >
                        {user.is_admin ? 'Снять права администратора' : 'Сделать администратором'}
                      </button>
                      <button
                        onClick={() => handleViewFiles(user)}
                        className={styles.filesButton}
                      >
                        Файлы
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className={styles.deleteButton}
                        disabled={user.id === currentUser.id}
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {}
      {selectedUser && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>Файлы пользователя: {selectedUser.username}</h2>
              <button 
                onClick={() => setSelectedUser(null)}
                className={styles.closeButton}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <UserFiles user={selectedUser} onClose={() => setSelectedUser(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
import React from 'react';
import styles from './Stats.module.css';

const Stats = ({ stats }) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={styles.statsContainer}>
      <h3 className={styles.title}>Статистика системы</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.total_stats.total_users}</div>
            <div className={styles.statLabel}>Всего пользователей</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.total_stats.admin_count}</div>
            <div className={styles.statLabel}>Администраторов</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📁</div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>{stats.total_stats.total_files}</div>
            <div className={styles.statLabel}>Всего файлов</div>
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💾</div>
          <div className={styles.statInfo}>
            <div className={styles.statNumber}>
              {formatFileSize(stats.total_stats.total_storage_used)}
            </div>
            <div className={styles.statLabel}>Объем хранилища</div>
          </div>
        </div>
      </div>

      <div className={styles.detailedStats}>
        <h4>Статистика по пользователям</h4>
        <div className={styles.usersTable}>
          <table>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Файлов</th>
                <th>Размер</th>
                <th>Средний размер</th>
              </tr>
            </thead>
            <tbody>
              {stats.users_stats.map(userStat => (
                <tr key={userStat.id}>
                  <td>{userStat.username}</td>
                  <td>{userStat.file_count}</td>
                  <td>{formatFileSize(userStat.total_size)}</td>
                  <td>
                    {userStat.file_count > 0 
                      ? formatFileSize(userStat.total_size / userStat.file_count)
                      : '0 Bytes'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Stats;
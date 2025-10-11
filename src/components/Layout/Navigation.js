import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import styles from './Navigation.module.css';

const Navigation = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          My Cloud
        </Link>
        
        <div className={styles.navLinks}>
          {isAuthenticated ? (
            <>
              <span className={styles.userInfo}>Привет, {user?.username}!</span>
              <Link to="/storage" className={styles.link}>Мои файлы</Link>
              {user?.is_admin && (
                <Link to="/admin" className={styles.link}>Администратор</Link>
              )}
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>Вход</Link>
              <Link to="/register" className={styles.link}>Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
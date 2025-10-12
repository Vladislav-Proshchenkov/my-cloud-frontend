import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Добро пожаловать в My Cloud!</h1>
      <p className={styles.subtitle}>Храните Ваши файлы на облачном диске</p>
      
      <div className={styles.buttonContainer}>
        <Link to="/login" className={`${styles.button} ${styles.primaryButton}`}>
          Войти
        </Link>
        <Link to="/register" className={`${styles.button} ${styles.secondaryButton}`}>
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
};

export default Home;
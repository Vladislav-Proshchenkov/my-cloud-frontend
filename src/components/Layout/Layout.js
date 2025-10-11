import React from 'react';
import Navigation from './Navigation';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div>
      <Navigation />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
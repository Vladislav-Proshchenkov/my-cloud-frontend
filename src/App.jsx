import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<div>Страница входа (Сделать)</div>} />
            <Route path="/register" element={<div>Страница регистрации (Сделать)</div>} />
            <Route path="/storage" element={<div>Мои файлы (Сделать)</div>} />
            <Route path="/admin" element={<div>Админка (Сделать)</div>} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
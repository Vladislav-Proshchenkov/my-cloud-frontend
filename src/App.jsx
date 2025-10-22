import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import store from './store';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Storage from './pages/Storage';
import Admin from './pages/Admin';
import { checkAuth } from './store/authSlice';
import PublicFilePage from './pages/PublicFilePage';

const AppWrapper = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/file/:uniqueIdentifier" element={<PublicFilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  );
}

export default App;
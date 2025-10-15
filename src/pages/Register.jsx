import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../store/authSlice';
import styles from './Register.module.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirm: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'Введите логин';
        if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(value)) {
          return 'Логин должен начинаться с буквы, содержать только латинские буквы и цифры, длиной от 4 до 20 символов';
        }
        return '';
      
      case 'email':
        if (!value) return 'Введите email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Некорректный email';
        }
        return '';
      
      case 'password':
        if (!value) return 'Введите пароль';
        if (value.length < 6) return 'Пароль должен содержать не менее 6 символов';
        if (!/[A-Z]/.test(value)) return 'Пароль должен содержать хотя бы одну заглавную букву';
        if (!/\d/.test(value)) return 'Пароль должен содержать хотя бы одну цифру';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Пароль должен содержать хотя бы один специальный символ';
        return '';
      
      case 'password_confirm':
        if (!value) return 'Подтвердите пароль';
        if (value !== formData.password) return 'Пароли не совпадают';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    if (error) {
      dispatch(clearError());
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) errors[key] = error;
    });

    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }

    const result = await dispatch(registerUser(formData));
    
    if (result.type === 'auth/register/fulfilled') {
      navigate('/login');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerForm}>
        <h2 className={styles.title}>Регистрация в My Cloud</h2>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Логин *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${validationErrors.username ? styles.inputError : ''}`}
              required
              disabled={loading}
            />
            {validationErrors.username && (
              <div className={styles.fieldError}>{validationErrors.username}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="first_name" className={styles.label}>
              Имя
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="last_name" className={styles.label}>
              Фамилия
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              className={styles.input}
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${validationErrors.email ? styles.inputError : ''}`}
              required
              disabled={loading}
            />
            {validationErrors.email && (
              <div className={styles.fieldError}>{validationErrors.email}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Пароль *
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${validationErrors.password ? styles.inputError : ''}`}
              required
              disabled={loading}
            />
            {validationErrors.password && (
              <div className={styles.fieldError}>{validationErrors.password}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password_confirm" className={styles.label}>
              Подтверждение пароля *
            </label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${validationErrors.password_confirm ? styles.inputError : ''}`}
              required
              disabled={loading}
            />
            {validationErrors.password_confirm && (
              <div className={styles.fieldError}>{validationErrors.password_confirm}</div>
            )}
          </div>

          {error && (
            <div className={styles.error}>
              {typeof error === 'object' 
                ? Object.values(error).flat().join(', ') 
                : error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <div className={styles.loginLink}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
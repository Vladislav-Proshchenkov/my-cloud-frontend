import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';

const mockStore = {
  getState: () => ({
    auth: {
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null
    }
  }),
  subscribe: () => () => {},
  dispatch: () => ({ type: 'TEST' })
};

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    }
  })),
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('./services/auth', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
  storageAPI: {
    getFiles: jest.fn(),
  },
  usersAPI: {
    getUsers: jest.fn(),
    deleteUser: jest.fn(),
    toggleAdmin: jest.fn(),
    getStats: jest.fn(),
  },
}));

jest.mock('./components/Layout/Layout', () => ({ children }) => (
  <div>
    <header>My Cloud</header>
    <nav>
      <a href="/login">Вход</a>
      <a href="/register">Регистрация</a>
    </nav>
    <main>{children}</main>
  </div>
));

jest.mock('./pages/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/Login', () => () => <div>Login Page</div>);
jest.mock('./pages/Register', () => () => <div>Register Page</div>);
jest.mock('./pages/Storage', () => () => <div>Storage Page</div>);
jest.mock('./pages/Admin', () => () => <div>Admin Page</div>);
jest.mock('./pages/PublicFilePage', () => () => <div>Public File Page</div>);

jest.mock('./store/authSlice', () => ({
  checkAuth: jest.fn(() => ({ type: 'CHECK_AUTH' })),
  loginUser: jest.fn(),
  registerUser: jest.fn(),
  logout: jest.fn(),
  clearError: jest.fn(),
  __esModule: true,
  default: (state = {}, action) => state
}));

jest.mock('./store', () => ({
  __esModule: true,
  default: {
    getState: () => ({
      auth: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    }),
    subscribe: () => () => {},
    dispatch: () => ({ type: 'TEST' })
  }
}));

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      {component}
    </Provider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders My Cloud header', () => {
    renderWithProviders(<App />);
    const logoElement = screen.getByText(/My Cloud/i);
    expect(logoElement).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderWithProviders(<App />);
    const loginLink = screen.getByText(/Вход/i);
    const registerLink = screen.getByText(/Регистрация/i);
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });
});
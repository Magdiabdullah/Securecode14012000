import { User } from '../types/authTypes';

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  }
];

export const mockLogin = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (user) {
        // Don't return the password in the user object
        const { password, ...userWithoutPassword } = user;
        resolve(userWithoutPassword as User);
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
};

export const mockRegister = (name: string, email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers.some(u => u.email === email)) {
        reject(new Error('Email already in use'));
      } else {
        const newUser = {
          id: (mockUsers.length + 1).toString(),
          name,
          email,
          role: 'user' // New users are always regular users
        };
        mockUsers.push({ ...newUser, password });
        resolve(newUser);
      }
    }, 800);
  });
};

export const mockLogout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};
/**
 * ========================================
 * VITEST SETUP - TESTING CONFIGURATION
 * ========================================
 * Configuración global para todos los tests del proyecto
 */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';

// ========================================
// CLEANUP AFTER EACH TEST
// ========================================
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// ========================================
// MOCK FIREBASE
// ========================================
vi.mock('@/lib/firebase', () => ({
  auth: {
    currentUser: null,
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
  },
  db: {
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn(),
    limit: vi.fn(),
  },
  storage: {
    ref: vi.fn(),
    uploadBytes: vi.fn(),
    getDownloadURL: vi.fn(),
    deleteObject: vi.fn(),
  },
}));

// ========================================
// MOCK WINDOW OBJECTS
// ========================================
global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  };

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// ========================================
// MOCK IMPORT.META
// ========================================
global.import = {
  meta: {
    env: {
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
      VITE_FIREBASE_APP_ID: 'test-app-id',
      MODE: 'test',
      DEV: false,
      PROD: false,
      SSR: false,
    },
  },
};

// ========================================
// CONSOLE MOCKS (SUPPRESS WARNINGS)
// ========================================
beforeAll(() => {
  global.console = {
    ...console,
    error: vi.fn(),
    warn: vi.fn(),
  };
});

afterAll(() => {
  vi.restoreAllMocks();
});

// ========================================
// CUSTOM MATCHERS
// ========================================
expect.extend({
  toBeInRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});

// ========================================
// TEST UTILITIES
// ========================================
export const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  emailVerified: true,
};

export const mockFirestoreDoc = (data = {}) => ({
  id: 'test-doc-id',
  exists: () => true,
  data: () => data,
});

export const mockFirestoreCollection = (docs = []) => ({
  docs: docs.map((data) => mockFirestoreDoc(data)),
  size: docs.length,
  empty: docs.length === 0,
});

export const waitForAsync = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

// ========================================
// GLOBAL TEST HELPERS
// ========================================
global.testHelpers = {
  mockUser,
  mockFirestoreDoc,
  mockFirestoreCollection,
  waitForAsync,
};

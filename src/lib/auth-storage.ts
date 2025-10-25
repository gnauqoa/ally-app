export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const AUTH_STORAGE_KEY = "auth_state";
const USERS_STORAGE_KEY = "users";

export function getAuthState(): AuthState {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, user: null };
  }
  
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    return { isAuthenticated: false, user: null };
  }
  
  try {
    const authState = JSON.parse(stored);
    return {
      isAuthenticated: authState.isAuthenticated,
      user: authState.user ? {
        ...authState.user,
        createdAt: new Date(authState.user.createdAt),
      } : null,
    };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

export function setAuthState(authState: AuthState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

export function getUsers(): Array<{ email: string; password: string; name: string }> {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(USERS_STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveUser(email: string, password: string, name: string): void {
  if (typeof window === "undefined") return;
  const users = getUsers();
  users.push({ email, password, name });
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function login(email: string, password: string): User | null {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  
  if (user) {
    const authUser: User = {
      id: Date.now().toString(),
      email: user.email,
      name: user.name,
      createdAt: new Date(),
    };
    
    setAuthState({
      isAuthenticated: true,
      user: authUser,
    });
    
    return authUser;
  }
  
  return null;
}

export function logout(): void {
  setAuthState({
    isAuthenticated: false,
    user: null,
  });
}

export function register(email: string, password: string, name: string): User | null {
  const users = getUsers();
  
  // Check if user already exists
  if (users.some((u) => u.email === email)) {
    return null;
  }
  
  // Save new user
  saveUser(email, password, name);
  
  // Auto login after registration
  return login(email, password);
}


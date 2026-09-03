// // // store/auth.tsx
// // import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
// // import { User } from '@/types';
// // import { API_BASE_URL } from '@/constants/api';

// // type AuthState = {
// //   user: User | null;
// //   token: string | null;
// //   isLoading: boolean;
// //   isAuthenticated: boolean;
// // };

// // type AuthAction =
// //   | { type: 'SET_LOADING'; payload: boolean }
// //   | { type: 'SET_AUTH'; payload: { user: User; token: string } }
// //   | { type: 'LOGOUT' }
// //   | { type: 'UPDATE_USER'; payload: Partial<User> };

// // const initialState: AuthState = {
// //   user: null,
// //   token: null,
// //   isLoading: true,
// //   isAuthenticated: false,
// // };

// // function authReducer(state: AuthState, action: AuthAction): AuthState {
// //   switch (action.type) {
// //     case 'SET_LOADING':
// //       return { ...state, isLoading: action.payload };
// //     case 'SET_AUTH':
// //       return { user: action.payload.user, token: action.payload.token, isLoading: false, isAuthenticated: true };
// //     case 'LOGOUT':
// //       return { user: null, token: null, isLoading: false, isAuthenticated: false };
// //     case 'UPDATE_USER':
// //       return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
// //     default:
// //       return state;
// //   }
// // }

// // type AuthContextType = {
// //   state: AuthState;
// //   login: (email: string, password: string) => Promise<void>;
// //   register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
// //   logout: () => Promise<void>;
// //   updateUser: (data: Partial<User>) => void;
// // };

// // const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // // Storage abstraction
// // const storage = {
// //   async getItem(key: string): Promise<string | null> {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         return window.localStorage.getItem(key);
// //       }
// //     } catch {}
// //     return null;
// //   },
// //   async setItem(key: string, value: string): Promise<void> {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         window.localStorage.setItem(key, value);
// //       }
// //     } catch {}
// //   },
// //   async removeItem(key: string): Promise<void> {
// //     try {
// //       if (typeof window !== 'undefined' && window.localStorage) {
// //         window.localStorage.removeItem(key);
// //       }
// //     } catch {}
// //   },
// // };

// // export function AuthProvider({ children }: { children: ReactNode }) {
// //   const [state, dispatch] = useReducer(authReducer, initialState);

// //   useEffect(() => {
// //     (async () => {
// //       try {
// //         const token = await storage.getItem('auth_token');
// //         const userStr = await storage.getItem('auth_user');
// //         if (token && userStr) {
// //           dispatch({ type: 'SET_AUTH', payload: { user: JSON.parse(userStr), token } });
// //         } else {
// //           dispatch({ type: 'SET_LOADING', payload: false });
// //         }
// //       } catch {
// //         dispatch({ type: 'SET_LOADING', payload: false });
// //       }
// //     })();
// //   }, []);

// //   const login = useCallback(async (email: string, password: string) => {
// //     try {
// //       const url = `${API_BASE_URL}/login`;
// //       console.log('🔍 Login URL:', url);
// //       console.log('📦 Login Request:', { email, password: '***' });
      
// //       const response = await fetch(url, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json',
// //         },
// //         body: JSON.stringify({ email, password }),
// //       });

// //       console.log('📡 Login Response Status:', response.status);
// //       console.log('📡 Content-Type:', response.headers.get('content-type'));

// //       // Get raw response
// //       const responseText = await response.text();
// //       console.log('📄 Raw Login Response:', responseText);

// //       // Try to parse as JSON
// //       let data;
// //       try {
// //         data = JSON.parse(responseText);
// //       } catch (e) {
// //         console.error('❌ Failed to parse login JSON');
// //         throw new Error(`Server returned invalid response. Status: ${response.status}. Response: ${responseText.substring(0, 100)}`);
// //       }

// //       if (!response.ok) {
// //         throw new Error(data.message || 'Login failed');
// //       }

// //       // Store token and user data
// //       await storage.setItem('auth_token', data.token);
// //       await storage.setItem('auth_user', JSON.stringify(data.user));
      
// //       // Map the user object from backend to match your frontend User type
// //       const user: User = {
// //         id: data.user.id.toString(),
// //         name: data.user.name,
// //         email: data.user.email,
// //         phone: data.user.phone || '',
// //         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
// //         isPremium: false,
// //       };

// //       dispatch({ type: 'SET_AUTH', payload: { user, token: data.token } });
// //       console.log('✅ Login successful for:', user.email);
// //     } catch (error) {
// //       console.error('❌ Login error:', error);
// //       throw error;
// //     }
// //   }, []);

// //   const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
// //     try {
// //       const url = `${API_BASE_URL}/register`;
// //       console.log('🔍 Registration URL:', url);
// //       console.log('📦 Registration Request:', { name, email, phone, password: '***' });
      
// //       const response = await fetch(url, {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //           'Accept': 'application/json',
// //         },
// //         body: JSON.stringify({ name, email, phone, password }),
// //       });

// //       console.log('📡 Registration Response Status:', response.status);
// //       console.log('📡 Content-Type:', response.headers.get('content-type'));

// //       // Get raw response
// //       const responseText = await response.text();
// //       console.log('📄 Raw Registration Response:', responseText);

// //       // Try to parse as JSON
// //       let data;
// //       try {
// //         data = JSON.parse(responseText);
// //       } catch (e) {
// //         console.error('❌ Failed to parse registration JSON');
// //         throw new Error(`Server returned invalid response. Status: ${response.status}. Response: ${responseText.substring(0, 100)}`);
// //       }

// //       if (!response.ok) {
// //         throw new Error(data.message || 'Registration failed');
// //       }

// //       console.log('✅ Registration successful!');

// //       // After successful registration, automatically log in
// //       try {
// //         console.log('🔍 Attempting auto-login...');
// //         const loginResponse = await fetch(`${API_BASE_URL}/login`, {
// //           method: 'POST',
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Accept': 'application/json',
// //           },
// //           body: JSON.stringify({ email, password }),
// //         });

// //         const loginText = await loginResponse.text();
// //         console.log('📄 Auto-login Response:', loginText);

// //         const loginData = JSON.parse(loginText);

// //         if (loginResponse.ok) {
// //           await storage.setItem('auth_token', loginData.token);
// //           await storage.setItem('auth_user', JSON.stringify(loginData.user));

// //           const user: User = {
// //             id: loginData.user.id.toString(),
// //             name: loginData.user.name,
// //             email: loginData.user.email,
// //             phone: loginData.user.phone || '',
// //             avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
// //             isPremium: false,
// //           };

// //           dispatch({ type: 'SET_AUTH', payload: { user, token: loginData.token } });
// //           console.log('✅ Auto-login successful!');
// //         } else {
// //           console.warn('⚠️ Auto-login failed:', loginData);
// //         }
// //       } catch (loginError) {
// //         console.warn('⚠️ Auto-login after registration failed:', loginError);
// //         // Don't throw here - registration was successful
// //       }

// //       return data;
// //     } catch (error) {
// //       console.error('❌ Registration error:', error);
// //       throw error;
// //     }
// //   }, []);

// //   const logout = useCallback(async () => {
// //     console.log('🔍 Logging out...');
// //     await storage.removeItem('auth_token');
// //     await storage.removeItem('auth_user');
// //     dispatch({ type: 'LOGOUT' });
// //     console.log('✅ Logout successful');
// //   }, []);

// //   const updateUser = useCallback((data: Partial<User>) => {
// //     if (state.user) {
// //       const updated = { ...state.user, ...data };
// //       storage.setItem('auth_user', JSON.stringify(updated));
// //       dispatch({ type: 'UPDATE_USER', payload: data });
// //       console.log('✅ User updated:', data);
// //     }
// //   }, [state.user]);

// //   return (
// //     <AuthContext.Provider value={{ state, login, register, logout, updateUser }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// // export function useAuth() {
// //   const ctx = useContext(AuthContext);
// //   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
// //   return ctx;
// // }





// // store/auth.tsx
// import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
// import { User } from '@/types';
// import { API_BASE_URL } from '@/constants/api';

// type AuthState = {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   registrationEmail: string | null; // Store email for OTP verification
// };

// type AuthAction =
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_AUTH'; payload: { user: User; token: string } }
//   | { type: 'LOGOUT' }
//   | { type: 'UPDATE_USER'; payload: Partial<User> }
//   | { type: 'SET_REGISTRATION_EMAIL'; payload: string | null };

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: true,
//   isAuthenticated: false,
//   registrationEmail: null,
// };

// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     case 'SET_AUTH':
//       return { 
//         ...state, 
//         user: action.payload.user, 
//         token: action.payload.token, 
//         isLoading: false, 
//         isAuthenticated: true,
//         registrationEmail: null 
//       };
//     case 'LOGOUT':
//       return { user: null, token: null, isLoading: false, isAuthenticated: false, registrationEmail: null };
//     case 'UPDATE_USER':
//       return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
//     case 'SET_REGISTRATION_EMAIL':
//       return { ...state, registrationEmail: action.payload };
//     default:
//       return state;
//   }
// }

// type AuthContextType = {
//   state: AuthState;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
//   verifyOTP: (email: string, otp: string) => Promise<void>;
//   resendOTP: (email: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUser: (data: Partial<User>) => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Storage abstraction
// const storage = {
//   async getItem(key: string): Promise<string | null> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         return window.localStorage.getItem(key);
//       }
//     } catch {}
//     return null;
//   },
//   async setItem(key: string, value: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.setItem(key, value);
//       }
//     } catch {}
//   },
//   async removeItem(key: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.removeItem(key);
//       }
//     } catch {}
//   },
// };

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   useEffect(() => {
//     (async () => {
//       try {
//         const token = await storage.getItem('auth_token');
//         const userStr = await storage.getItem('auth_user');
//         if (token && userStr) {
//           dispatch({ type: 'SET_AUTH', payload: { user: JSON.parse(userStr), token } });
//         } else {
//           dispatch({ type: 'SET_LOADING', payload: false });
//         }
//       } catch {
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     })();
//   }, []);

//   const login = useCallback(async (email: string, password: string) => {
//     try {
//       const url = `${API_BASE_URL}/login`;
//       console.log('🔍 Login URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       // Check if OTP is required
//       if (response.status === 403 && data.requiresOTP) {
//         dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });
//         throw new Error('Please verify your email first');
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       await storage.setItem('auth_token', data.token);
//       await storage.setItem('auth_user', JSON.stringify(data.user));

//       const user: User = {
//         id: data.user.id.toString(),
//         name: data.user.name,
//         email: data.user.email,
//         phone: data.user.phone || '',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: false,
//       };

//       dispatch({ type: 'SET_AUTH', payload: { user, token: data.token } });
//     } catch (error) {
//       console.error('❌ Login error:', error);
//       throw error;
//     }
//   }, []);

//   const register = useCallback(async (name: string, email: string, password: string, phone?: string) => {
//     try {
//       const url = `${API_BASE_URL}/register`;
//       console.log('🔍 Registration URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ name, email, phone, password }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // Store email for OTP verification
//       dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });

//       return data;
//     } catch (error) {
//       console.error('❌ Registration error:', error);
//       throw error;
//     }
//   }, []);

//   const verifyOTP = useCallback(async (email: string, otp: string) => {
//     try {
//       const url = `${API_BASE_URL}/verify-otp`;
//       console.log('🔍 Verify OTP URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'OTP verification failed');
//       }

//       // Store token and user data
//       await storage.setItem('auth_token', data.token);
//       await storage.setItem('auth_user', JSON.stringify(data.user));

//       const user: User = {
//         id: data.user.id.toString(),
//         name: data.user.name,
//         email: data.user.email,
//         phone: data.user.phone || '',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: false,
//       };

//       dispatch({ type: 'SET_AUTH', payload: { user, token: data.token } });
//     } catch (error) {
//       console.error('❌ OTP verification error:', error);
//       throw error;
//     }
//   }, []);

//   const resendOTP = useCallback(async (email: string) => {
//     try {
//       const url = `${API_BASE_URL}/resend-otp`;
//       console.log('🔍 Resend OTP URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to resend OTP');
//       }

//       return data;
//     } catch (error) {
//       console.error('❌ Resend OTP error:', error);
//       throw error;
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     console.log('🔍 Logging out...');
//     await storage.removeItem('auth_token');
//     await storage.removeItem('auth_user');
//     dispatch({ type: 'LOGOUT' });
//     console.log('✅ Logout successful');
//   }, []);

//   const updateUser = useCallback((data: Partial<User>) => {
//     if (state.user) {
//       const updated = { ...state.user, ...data };
//       storage.setItem('auth_user', JSON.stringify(updated));
//       dispatch({ type: 'UPDATE_USER', payload: data });
//     }
//   }, [state.user]);

//   return (
//     <AuthContext.Provider value={{ 
//       state, 
//       login, 
//       register, 
//       verifyOTP, 
//       resendOTP, 
//       logout, 
//       updateUser 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }



// // store/auth.ts
// import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
// import { User } from '@/types';
// import { API_BASE_URL } from '@/constants/api';

// type AuthState = {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   registrationEmail: string | null; // Store email for OTP verification
//   registrationData: any | null; // Store registration data for resend
// };

// type AuthAction =
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_AUTH'; payload: { user: User; token: string } }
//   | { type: 'LOGOUT' }
//   | { type: 'UPDATE_USER'; payload: Partial<User> }
//   | { type: 'SET_REGISTRATION_EMAIL'; payload: string | null }
//   | { type: 'SET_REGISTRATION_DATA'; payload: any | null };

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: true,
//   isAuthenticated: false,
//   registrationEmail: null,
//   registrationData: null,
// };

// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     case 'SET_AUTH':
//       return { 
//         ...state, 
//         user: action.payload.user, 
//         token: action.payload.token, 
//         isLoading: false, 
//         isAuthenticated: true,
//         registrationEmail: null,
//         registrationData: null
//       };
//     case 'LOGOUT':
//       return { 
//         user: null, 
//         token: null, 
//         isLoading: false, 
//         isAuthenticated: false, 
//         registrationEmail: null,
//         registrationData: null
//       };
//     case 'UPDATE_USER':
//       return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
//     case 'SET_REGISTRATION_EMAIL':
//       return { ...state, registrationEmail: action.payload };
//     case 'SET_REGISTRATION_DATA':
//       return { ...state, registrationData: action.payload };
//     default:
//       return state;
//   }
// }

// type AuthContextType = {
//   state: AuthState;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string, phone?: string, address?: any) => Promise<void>;
//   verifyOTP: (email: string, otp: string) => Promise<void>;
//   resendOTP: (email: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUser: (data: Partial<User>) => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Storage abstraction
// const storage = {
//   async getItem(key: string): Promise<string | null> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         return window.localStorage.getItem(key);
//       }
//     } catch {}
//     return null;
//   },
//   async setItem(key: string, value: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.setItem(key, value);
//       }
//     } catch {}
//   },
//   async removeItem(key: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.removeItem(key);
//       }
//     } catch {}
//   },
// };

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   useEffect(() => {
//     (async () => {
//       try {
//         const token = await storage.getItem('auth_token');
//         const userStr = await storage.getItem('auth_user');
//         if (token && userStr) {
//           dispatch({ type: 'SET_AUTH', payload: { user: JSON.parse(userStr), token } });
//         } else {
//           dispatch({ type: 'SET_LOADING', payload: false });
//         }
//       } catch {
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     })();
//   }, []);

//   const login = useCallback(async (email: string, password: string) => {
//     try {
//       const url = `${API_BASE_URL}/login`;
//       console.log('🔍 Login URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       // Check if OTP is required
//       if (response.status === 403 && data.requiresOTP) {
//         dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });
//         throw new Error('Please verify your email first');
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       await storage.setItem('auth_token', data.token);
//       await storage.setItem('auth_user', JSON.stringify(data.user));

//       const user: User = {
//         id: data.user.id.toString(),
//         name: data.user.name,
//         email: data.user.email,
//         phone: data.user.phone || '',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: false,
//         addressLine1: data.user.addressLine1,
//         addressLine2: data.user.addressLine2,
//         city: data.user.city,
//         state: data.user.state,
//         pincode: data.user.pincode,
//         country: data.user.country || 'India'
//       };

//       dispatch({ type: 'SET_AUTH', payload: { user, token: data.token } });
//     } catch (error) {
//       console.error('❌ Login error:', error);
//       throw error;
//     }
//   }, []);

//   const register = useCallback(async (name: string, email: string, password: string, phone?: string, address?: any) => {
//     try {
//       const url = `${API_BASE_URL}/register`;
//       console.log('🔍 Registration URL:', url);
      
//       const payload = {
//         name,
//         email,
//         phone: phone || '',
//         password,
//         addressLine1: address?.addressLine1 || '',
//         addressLine2: address?.addressLine2 || '',
//         city: address?.city || '',
//         state: address?.state || '',
//         pincode: address?.pincode || '',
//         country: address?.country || 'India'
//       };
      
//       console.log('📦 Registration Payload:', { ...payload, password: '***' });
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // Store email and data for OTP verification
//       dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });
//       dispatch({ type: 'SET_REGISTRATION_DATA', payload: { name, email, phone, ...address } });

//       return data;
//     } catch (error) {
//       console.error('❌ Registration error:', error);
//       throw error;
//     }
//   }, []);

//   const verifyOTP = useCallback(async (email: string, otp: string) => {
//     try {
//       const url = `${API_BASE_URL}/verify-otp`;
//       console.log('🔍 Verify OTP URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'OTP verification failed');
//       }

//       // Store token and user data
//       await storage.setItem('auth_token', data.token);
//       await storage.setItem('auth_user', JSON.stringify(data.user));

//       const user: User = {
//         id: data.user.id.toString(),
//         name: data.user.name,
//         email: data.user.email,
//         phone: data.user.phone || '',
//         avatar: 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//         isPremium: false,
//         addressLine1: data.user.addressLine1,
//         addressLine2: data.user.addressLine2,
//         city: data.user.city,
//         state: data.user.state,
//         pincode: data.user.pincode,
//         country: data.user.country || 'India'
//       };

//       dispatch({ type: 'SET_AUTH', payload: { user, token: data.token } });
//     } catch (error) {
//       console.error('❌ OTP verification error:', error);
//       throw error;
//     }
//   }, []);

//   const resendOTP = useCallback(async (email: string) => {
//     try {
//       const url = `${API_BASE_URL}/resend-otp`;
//       console.log('🔍 Resend OTP URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to resend OTP');
//       }

//       return data;
//     } catch (error) {
//       console.error('❌ Resend OTP error:', error);
//       throw error;
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     console.log('🔍 Logging out...');
//     await storage.removeItem('auth_token');
//     await storage.removeItem('auth_user');
//     dispatch({ type: 'LOGOUT' });
//     console.log('✅ Logout successful');
//   }, []);

//   const updateUser = useCallback((data: Partial<User>) => {
//     if (state.user) {
//       const updated = { ...state.user, ...data };
//       storage.setItem('auth_user', JSON.stringify(updated));
//       dispatch({ type: 'UPDATE_USER', payload: data });
//     }
//   }, [state.user]);

//   return (
//     <AuthContext.Provider value={{ 
//       state, 
//       login, 
//       register, 
//       verifyOTP, 
//       resendOTP, 
//       logout, 
//       updateUser 
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }



// // store/auth.tsx
// import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
// import { User } from '@/types';
// import { API_BASE_URL } from '@/constants/api';

// type AuthState = {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   registrationEmail: string | null;
//   registrationData: any | null;
// };

// type AuthAction =
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_AUTH'; payload: { user: User; token: string } }
//   | { type: 'LOGOUT' }
//   | { type: 'UPDATE_USER'; payload: Partial<User> }
//   | { type: 'SET_REGISTRATION_EMAIL'; payload: string | null }
//   | { type: 'SET_REGISTRATION_DATA'; payload: any | null };

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: true,
//   isAuthenticated: false,
//   registrationEmail: null,
//   registrationData: null,
// };

// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     case 'SET_AUTH':
//       console.log('✅ SET_AUTH called with user:', action.payload.user);
//       console.log('✅ User ID:', action.payload.user.id);
//       return { 
//         ...state, 
//         user: action.payload.user, 
//         token: action.payload.token, 
//         isLoading: false, 
//         isAuthenticated: true,
//         registrationEmail: null,
//         registrationData: null
//       };
//     case 'LOGOUT':
//       return { 
//         user: null, 
//         token: null, 
//         isLoading: false, 
//         isAuthenticated: false, 
//         registrationEmail: null,
//         registrationData: null
//       };
//     case 'UPDATE_USER':
//       console.log('✅ UPDATE_USER called with:', action.payload);
//       return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
//     case 'SET_REGISTRATION_EMAIL':
//       return { ...state, registrationEmail: action.payload };
//     case 'SET_REGISTRATION_DATA':
//       return { ...state, registrationData: action.payload };
//     default:
//       return state;
//   }
// }

// type AuthContextType = {
//   state: AuthState;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string, phone?: string, address?: any) => Promise<void>;
//   verifyOTP: (email: string, otp: string) => Promise<void>;
//   resendOTP: (email: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUser: (data: Partial<User>) => void;
//   refreshUser: () => Promise<void>;
//   debugAuth: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Storage abstraction
// const storage = {
//   async getItem(key: string): Promise<string | null> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         return window.localStorage.getItem(key);
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   },
//   async setItem(key: string, value: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.setItem(key, value);
//       }
//     } catch {}
//   },
//   async removeItem(key: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.removeItem(key);
//       }
//     } catch {}
//   },
// };

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Load auth state from storage on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         console.log('🔍 Loading auth state from storage...');
//         const token = await storage.getItem('auth_token');
//         const userStr = await storage.getItem('auth_user');
        
//         console.log('🔍 Token found:', token ? 'Yes' : 'No');
//         console.log('🔍 User data found:', userStr ? 'Yes' : 'No');
        
//         if (token && userStr) {
//           try {
//             const user = JSON.parse(userStr);
//             console.log('📦 Parsed user from storage:', user);
            
//             // Ensure user has an ID
//             if (!user.id) {
//               console.error('❌ User data missing ID:', user);
//               await storage.removeItem('auth_token');
//               await storage.removeItem('auth_user');
//               dispatch({ type: 'SET_LOADING', payload: false });
//               return;
//             }
            
//             console.log('✅ Auth restored. User ID:', user.id);
//             console.log('✅ User data:', user);
//             dispatch({ type: 'SET_AUTH', payload: { user, token } });
//           } catch (parseError) {
//             console.error('❌ Failed to parse user data:', parseError);
//             await storage.removeItem('auth_token');
//             await storage.removeItem('auth_user');
//             dispatch({ type: 'SET_LOADING', payload: false });
//           }
//         } else {
//           console.log('❌ No auth data found');
//           dispatch({ type: 'SET_LOADING', payload: false });
//         }
//       } catch (error) {
//         console.error('❌ Auth loading error:', error);
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     })();
//   }, []);

//   // Helper function to map user data from API
//   const mapUserData = useCallback((data: any): User => {
//     console.log('📦 Mapping user data:', data);
    
//     // Try multiple possible ID fields - prioritize 'id' as it's returned from your API
//     const userId = data.id || data._id || data.customer_id || data.user_id || data.uid;
    
//     if (!userId) {
//       console.error('❌ No user ID found in data:', data);
//       throw new Error('User ID is missing from server response');
//     }

//     console.log('✅ Mapping user with ID:', userId);

//     return {
//       id: String(userId), // Ensure ID is always a string
//       name: data.name || data.full_name || data.username || 'User',
//       email: data.email || '',
//       phone: data.phone || data.mobile || data.phoneNumber || '',
//       avatar: data.avatar || data.profile_image || data.profile_picture || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//       isPremium: data.isPremium || data.is_premium || false,
//       addressLine1: data.addressLine1 || data.address_line1 || data.address1 || '',
//       addressLine2: data.addressLine2 || data.address_line2 || data.address2 || '',
//       city: data.city || data.city_name || '',
//       state: data.state || data.state_name || '',
//       pincode: data.pincode || data.zip_code || data.postal_code || '',
//       country: data.country || 'India',
//       createdAt: data.createdAt || data.created_at || data.registration_date || new Date().toISOString(),
//       updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
//     };
//   }, []);

//   const login = useCallback(async (email: string, password: string) => {
//     try {
//       const url = `${API_BASE_URL}/login`;
//       console.log('🔍 Login URL:', url);
//       console.log('📧 Login email:', email);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Login response:', data);

//       // Check if OTP is required
//       if (response.status === 403 && data.requiresOTP) {
//         dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });
//         throw new Error('Please verify your email first');
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       // Get user data from response - your API returns user directly
//       const userData = data.user || data.customer || data.data?.user || data.data?.customer;
      
//       if (!userData) {
//         console.error('❌ No user data in response:', data);
//         throw new Error('No user data in response');
//       }

//       // Map user data
//       const user = mapUserData(userData);
      
//       console.log('✅ Login successful. User ID:', user.id);
//       console.log('✅ User data:', user);

//       // Store auth data
//       const token = data.token || data.accessToken;
//       await storage.setItem('auth_token', token);
//       await storage.setItem('auth_user', JSON.stringify(user));

//       // Verify storage worked
//       const verifyToken = await storage.getItem('auth_token');
//       const verifyUser = await storage.getItem('auth_user');
//       console.log('✅ Storage verification - token:', verifyToken ? 'exists' : 'missing');
//       console.log('✅ Storage verification - user:', verifyUser ? 'exists' : 'missing');

//       dispatch({ type: 'SET_AUTH', payload: { user, token } });
      
//     } catch (error) {
//       console.error('❌ Login error:', error);
//       throw error;
//     }
//   }, [mapUserData]);

//   const register = useCallback(async (name: string, email: string, password: string, phone?: string, address?: any) => {
//     try {
//       const url = `${API_BASE_URL}/register`;
//       console.log('🔍 Registration URL:', url);
      
//       const payload = {
//         name,
//         email,
//         phone: phone || '',
//         password,
//         addressLine1: address?.addressLine1 || '',
//         addressLine2: address?.addressLine2 || '',
//         city: address?.city || '',
//         state: address?.state || '',
//         pincode: address?.pincode || '',
//         country: address?.country || 'India'
//       };
      
//       console.log('📦 Registration Payload:', { ...payload, password: '***' });
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Registration response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       // Store email and data for OTP verification
//       const emailToStore = data.email || email;
//       dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: emailToStore });
//       dispatch({ type: 'SET_REGISTRATION_DATA', payload: { name, email, phone, ...address } });

//       console.log('✅ Registration initiated. Email:', emailToStore);

//       return data;
//     } catch (error) {
//       console.error('❌ Registration error:', error);
//       throw error;
//     }
//   }, []);

//   const verifyOTP = useCallback(async (email: string, otp: string) => {
//     try {
//       const url = `${API_BASE_URL}/verify-otp`;
//       console.log('🔍 Verify OTP URL:', url);
//       console.log('📧 Email:', email);
//       console.log('🔢 OTP:', otp);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Verify OTP response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'OTP verification failed');
//       }

//       // Get user data from response
//       const userData = data.user || data.customer || data.data?.user || data.data?.customer;
      
//       if (!userData) {
//         throw new Error('No user data in response');
//       }

//       // Map user data
//       const user = mapUserData(userData);
      
//       const token = data.token || data.accessToken;
      
//       console.log('✅ OTP verified. User ID:', user.id);
//       console.log('✅ User data:', user);

//       // Store auth data
//       await storage.setItem('auth_token', token);
//       await storage.setItem('auth_user', JSON.stringify(user));

//       dispatch({ type: 'SET_AUTH', payload: { user, token } });
//     } catch (error) {
//       console.error('❌ OTP verification error:', error);
//       throw error;
//     }
//   }, [mapUserData]);

//   const resendOTP = useCallback(async (email: string) => {
//     try {
//       const url = `${API_BASE_URL}/resend-otp`;
//       console.log('🔍 Resend OTP URL:', url);
//       console.log('📧 Email:', email);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Resend OTP response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to resend OTP');
//       }

//       return data;
//     } catch (error) {
//       console.error('❌ Resend OTP error:', error);
//       throw error;
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     console.log('🔍 Logging out...');
//     console.log('👤 Current user:', state.user?.id);
    
//     await storage.removeItem('auth_token');
//     await storage.removeItem('auth_user');
//     dispatch({ type: 'LOGOUT' });
    
//     console.log('✅ Logout successful');
//   }, [state.user]);

//   const updateUser = useCallback((data: Partial<User>) => {
//     if (state.user) {
//       const updated = { ...state.user, ...data };
//       storage.setItem('auth_user', JSON.stringify(updated));
//       dispatch({ type: 'UPDATE_USER', payload: data });
//       console.log('✅ User updated:', updated);
//     }
//   }, [state.user]);

//   const refreshUser = useCallback(async () => {
//     if (!state.token || !state.user) {
//       console.log('❌ Cannot refresh user: No token or user');
//       return;
//     }

//     try {
//       console.log('🔄 Refreshing user data...');
//       const url = `${API_BASE_URL}/me`;
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${state.token}`,
//           'Accept': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const userData = data.user || data.customer || data.data;
        
//         if (userData) {
//           const user = mapUserData(userData);
//           console.log('✅ User refreshed:', user.id);
          
//           await storage.setItem('auth_user', JSON.stringify(user));
//           dispatch({ type: 'UPDATE_USER', payload: user });
//         }
//       }
//     } catch (error) {
//       console.error('❌ Failed to refresh user:', error);
//     }
//   }, [state.token, state.user, mapUserData]);

//   // Debug function to check auth state
//   const debugAuth = useCallback(() => {
//     console.log('🔍 DEBUG - Current Auth State:', {
//       user: state.user,
//       userId: state.user?.id,
//       token: state.token ? 'exists' : 'not found',
//       isAuthenticated: state.isAuthenticated,
//       isLoading: state.isLoading
//     });
    
//     // Check localStorage directly
//     if (typeof window !== 'undefined' && window.localStorage) {
//       const token = window.localStorage.getItem('auth_token');
//       const userStr = window.localStorage.getItem('auth_user');
//       console.log('🔍 DEBUG - localStorage:', {
//         token: token ? 'exists' : 'not found',
//         userStr: userStr ? userStr.substring(0, 100) + '...' : 'not found'
//       });
//       if (userStr) {
//         try {
//           const user = JSON.parse(userStr);
//           console.log('🔍 DEBUG - User from localStorage:', user);
//         } catch (e) {
//           console.error('❌ Failed to parse user from localStorage');
//         }
//       }
//     }
//   }, [state]);

//   // Memoize the context value to prevent unnecessary re-renders
//   const contextValue = useMemo(() => ({
//     state,
//     login,
//     register,
//     verifyOTP,
//     resendOTP,
//     logout,
//     updateUser,
//     refreshUser,
//     debugAuth
//   }), [state, login, register, verifyOTP, resendOTP, logout, updateUser, refreshUser, debugAuth]);

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }





// store/auth.tsx
// store/auth.tsx
// import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
// import { User } from '@/types';
// import { API_BASE_URL } from '@/constants/api';

// type AuthState = {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   registrationEmail: string | null;
//   registrationData: any | null;
// };

// type AuthAction =
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_AUTH'; payload: { user: User; token: string } }
//   | { type: 'LOGOUT' }
//   | { type: 'UPDATE_USER'; payload: Partial<User> }
//   | { type: 'SET_REGISTRATION_EMAIL'; payload: string | null }
//   | { type: 'SET_REGISTRATION_DATA'; payload: any | null };

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: true,
//   isAuthenticated: false,
//   registrationEmail: null,
//   registrationData: null,
// };

// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     case 'SET_AUTH':
//       console.log('✅ SET_AUTH called with user:', action.payload.user);
//       console.log('✅ User ID:', action.payload.user.id);
//       return { 
//         ...state, 
//         user: action.payload.user, 
//         token: action.payload.token, 
//         isLoading: false, 
//         isAuthenticated: true,
//         registrationEmail: null,
//         registrationData: null
//       };
//     case 'LOGOUT':
//       return { 
//         user: null, 
//         token: null, 
//         isLoading: false, 
//         isAuthenticated: false, 
//         registrationEmail: null,
//         registrationData: null
//       };
//     case 'UPDATE_USER':
//       console.log('✅ UPDATE_USER called with:', action.payload);
//       return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
//     case 'SET_REGISTRATION_EMAIL':
//       return { ...state, registrationEmail: action.payload };
//     case 'SET_REGISTRATION_DATA':
//       return { ...state, registrationData: action.payload };
//     default:
//       return state;
//   }
// }

// type AuthContextType = {
//   state: AuthState;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string, phone?: string, address?: any) => Promise<void>;
//   verifyOTP: (email: string, otp: string) => Promise<void>;
//   resendOTP: (email: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUser: (data: Partial<User>) => void;
//   updateProfile: (data: Partial<User>) => Promise<void>;
//   uploadProfilePhoto: (imageUri: string) => Promise<string | null>;
//   refreshUser: () => Promise<void>;
//   debugAuth: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Storage abstraction
// const storage = {
//   async getItem(key: string): Promise<string | null> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         return window.localStorage.getItem(key);
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   },
//   async setItem(key: string, value: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.setItem(key, value);
//       }
//     } catch {}
//   },
//   async removeItem(key: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.removeItem(key);
//       }
//     } catch {}
//   },
// };

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Load auth state from storage on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         console.log('🔍 Loading auth state from storage...');
//         const token = await storage.getItem('auth_token');
//         const userStr = await storage.getItem('auth_user');
        
//         console.log('🔍 Token found:', token ? 'Yes' : 'No');
//         console.log('🔍 User data found:', userStr ? 'Yes' : 'No');
        
//         if (token && userStr) {
//           try {
//             const user = JSON.parse(userStr);
//             console.log('📦 Parsed user from storage:', user);
            
//             if (!user.id) {
//               console.error('❌ User data missing ID:', user);
//               await storage.removeItem('auth_token');
//               await storage.removeItem('auth_user');
//               dispatch({ type: 'SET_LOADING', payload: false });
//               return;
//             }
            
//             console.log('✅ Auth restored. User ID:', user.id);
//             dispatch({ type: 'SET_AUTH', payload: { user, token } });
//           } catch (parseError) {
//             console.error('❌ Failed to parse user data:', parseError);
//             await storage.removeItem('auth_token');
//             await storage.removeItem('auth_user');
//             dispatch({ type: 'SET_LOADING', payload: false });
//           }
//         } else {
//           console.log('❌ No auth data found');
//           dispatch({ type: 'SET_LOADING', payload: false });
//         }
//       } catch (error) {
//         console.error('❌ Auth loading error:', error);
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     })();
//   }, []);

//   // Helper function to map user data from API
//   const mapUserData = useCallback((data: any): User => {
//     console.log('📦 Mapping user data:', data);
    
//     const userId = data.id || data._id || data.customer_id || data.user_id || data.uid;
    
//     if (!userId) {
//       console.error('❌ No user ID found in data:', data);
//       throw new Error('User ID is missing from server response');
//     }

//     console.log('✅ Mapping user with ID:', userId);

//     return {
//       id: String(userId),
//       name: data.name || data.full_name || data.username || 'User',
//       email: data.email || '',
//       phone: data.phone || data.mobile || data.phoneNumber || '',
//       avatar: data.avatar || data.profile_image || data.profile_picture || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//       isPremium: data.isPremium || data.is_premium || false,
//       addressLine1: data.addressLine1 || data.address_line1 || data.address1 || '',
//       addressLine2: data.addressLine2 || data.address_line2 || data.address2 || '',
//       city: data.city || data.city_name || '',
//       state: data.state || data.state_name || '',
//       pincode: data.pincode || data.zip_code || data.postal_code || '',
//       country: data.country || 'India',
//       createdAt: data.createdAt || data.created_at || data.registration_date || new Date().toISOString(),
//       updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
//     };
//   }, []);

//   const login = useCallback(async (email: string, password: string) => {
//     try {
//       const url = `${API_BASE_URL}/login`;
//       console.log('🔍 Login URL:', url);
//       console.log('📧 Login email:', email);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Login response:', data);

//       if (response.status === 403 && data.requiresOTP) {
//         dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });
//         throw new Error('Please verify your email first');
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       const userData = data.user || data.customer || data.data?.user || data.data?.customer;
      
//       if (!userData) {
//         console.error('❌ No user data in response:', data);
//         throw new Error('No user data in response');
//       }

//       const user = mapUserData(userData);
      
//       console.log('✅ Login successful. User ID:', user.id);

//       const token = data.token || data.accessToken;
//       await storage.setItem('auth_token', token);
//       await storage.setItem('auth_user', JSON.stringify(user));

//       dispatch({ type: 'SET_AUTH', payload: { user, token } });
      
//     } catch (error) {
//       console.error('❌ Login error:', error);
//       throw error;
//     }
//   }, [mapUserData]);

//   const register = useCallback(async (name: string, email: string, password: string, phone?: string, address?: any) => {
//     try {
//       const url = `${API_BASE_URL}/register`;
//       console.log('🔍 Registration URL:', url);
      
//       const payload = {
//         name,
//         email,
//         phone: phone || '',
//         password,
//         addressLine1: address?.addressLine1 || '',
//         addressLine2: address?.addressLine2 || '',
//         city: address?.city || '',
//         state: address?.state || '',
//         pincode: address?.pincode || '',
//         country: address?.country || 'India'
//       };
      
//       console.log('📦 Registration Payload:', { ...payload, password: '***' });
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Registration response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       const emailToStore = data.email || email;
//       dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: emailToStore });
//       dispatch({ type: 'SET_REGISTRATION_DATA', payload: { name, email, phone, ...address } });

//       console.log('✅ Registration initiated. Email:', emailToStore);

//       return data;
//     } catch (error) {
//       console.error('❌ Registration error:', error);
//       throw error;
//     }
//   }, []);

//   const verifyOTP = useCallback(async (email: string, otp: string) => {
//     try {
//       const url = `${API_BASE_URL}/verify-otp`;
//       console.log('🔍 Verify OTP URL:', url);
//       console.log('📧 Email:', email);
//       console.log('🔢 OTP:', otp);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Verify OTP response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'OTP verification failed');
//       }

//       const userData = data.user || data.customer || data.data?.user || data.data?.customer;
      
//       if (!userData) {
//         throw new Error('No user data in response');
//       }

//       const user = mapUserData(userData);
//       const token = data.token || data.accessToken;
      
//       console.log('✅ OTP verified. User ID:', user.id);

//       await storage.setItem('auth_token', token);
//       await storage.setItem('auth_user', JSON.stringify(user));

//       dispatch({ type: 'SET_AUTH', payload: { user, token } });
//     } catch (error) {
//       console.error('❌ OTP verification error:', error);
//       throw error;
//     }
//   }, [mapUserData]);

//   const resendOTP = useCallback(async (email: string) => {
//     try {
//       const url = `${API_BASE_URL}/resend-otp`;
//       console.log('🔍 Resend OTP URL:', url);
//       console.log('📧 Email:', email);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Resend OTP response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to resend OTP');
//       }

//       return data;
//     } catch (error) {
//       console.error('❌ Resend OTP error:', error);
//       throw error;
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     console.log('🔍 Logging out...');
//     console.log('👤 Current user:', state.user?.id);
    
//     await storage.removeItem('auth_token');
//     await storage.removeItem('auth_user');
//     dispatch({ type: 'LOGOUT' });
    
//     console.log('✅ Logout successful');
//   }, [state.user]);

//   const updateUser = useCallback((data: Partial<User>) => {
//     if (state.user) {
//       const updated = { ...state.user, ...data };
//       storage.setItem('auth_user', JSON.stringify(updated));
//       dispatch({ type: 'UPDATE_USER', payload: data });
//       console.log('✅ User updated:', updated);
//     }
//   }, [state.user]);

//   // ─── Update Profile ──────────────────────────────────────────────────────────
//   const updateProfile = useCallback(async (data: Partial<User>) => {
//     if (!state.token || !state.user) {
//       console.log('❌ Cannot update profile: No token or user');
//       throw new Error('User not authenticated');
//     }

//     try {
//       console.log('🔄 Updating profile...', data);
      
//       const url = `${API_BASE_URL}/customers/${state.user.id}`;
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${state.token}`,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update profile');
//       }

//       const result = await response.json();
//       console.log('✅ Profile updated:', result);
      
//       const updatedUser = { ...state.user, ...data };
//       await storage.setItem('auth_user', JSON.stringify(updatedUser));
//       dispatch({ type: 'UPDATE_USER', payload: data });
      
//       return result;
//     } catch (error) {
//       console.error('❌ Failed to update profile:', error);
//       throw error;
//     }
//   }, [state.token, state.user]);

//   // ─── Upload Profile Photo ───────────────────────────────────────────────────
//   const uploadProfilePhoto = useCallback(async (imageUri: string): Promise<string | null> => {
//     if (!state.token || !state.user) {
//       console.log('❌ Cannot upload photo: No token or user');
//       throw new Error('User not authenticated');
//     }

//     try {
//       console.log('📸 Uploading profile photo...');
      
//       // Create form data
//       const formData = new FormData();
//       formData.append('profileImage', {
//         uri: imageUri,
//         type: 'image/jpeg',
//         name: `profile_${state.user.id}_${Date.now()}.jpg`,
//       } as any);

//       const url = `${API_BASE_URL}/customers/${state.user.id}/profile-image`;
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${state.token}`,
//           'Accept': 'application/json',
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to upload photo');
//       }

//       const result = await response.json();
//       console.log('✅ Profile photo uploaded:', result);
      
//       const avatarUrl = result.data?.imageUrl || result.imageUrl || result.avatar;
      
//       if (avatarUrl) {
//         const updatedUser = { ...state.user, avatar: avatarUrl };
//         await storage.setItem('auth_user', JSON.stringify(updatedUser));
//         dispatch({ type: 'UPDATE_USER', payload: { avatar: avatarUrl } });
//       }
      
//       return avatarUrl || null;
//     } catch (error) {
//       console.error('❌ Failed to upload profile photo:', error);
//       throw error;
//     }
//   }, [state.token, state.user]);

//   const refreshUser = useCallback(async () => {
//     if (!state.token || !state.user) {
//       console.log('❌ Cannot refresh user: No token or user');
//       return;
//     }

//     try {
//       console.log('🔄 Refreshing user data...');
//       const url = `${API_BASE_URL}/me`;
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${state.token}`,
//           'Accept': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const userData = data.user || data.customer || data.data;
        
//         if (userData) {
//           const user = mapUserData(userData);
//           console.log('✅ User refreshed:', user.id);
          
//           await storage.setItem('auth_user', JSON.stringify(user));
//           dispatch({ type: 'UPDATE_USER', payload: user });
//         }
//       }
//     } catch (error) {
//       console.error('❌ Failed to refresh user:', error);
//     }
//   }, [state.token, state.user, mapUserData]);

//   const debugAuth = useCallback(() => {
//     console.log('🔍 DEBUG - Current Auth State:', {
//       user: state.user,
//       userId: state.user?.id,
//       token: state.token ? 'exists' : 'not found',
//       isAuthenticated: state.isAuthenticated,
//       isLoading: state.isLoading
//     });
    
//     if (typeof window !== 'undefined' && window.localStorage) {
//       const token = window.localStorage.getItem('auth_token');
//       const userStr = window.localStorage.getItem('auth_user');
//       console.log('🔍 DEBUG - localStorage:', {
//         token: token ? 'exists' : 'not found',
//         userStr: userStr ? userStr.substring(0, 100) + '...' : 'not found'
//       });
//     }
//   }, [state]);

//   const contextValue = useMemo(() => ({
//     state,
//     login,
//     register,
//     verifyOTP,
//     resendOTP,
//     logout,
//     updateUser,
//     updateProfile,
//     uploadProfilePhoto,
//     refreshUser,
//     debugAuth
//   }), [state, login, register, verifyOTP, resendOTP, logout, updateUser, updateProfile, uploadProfilePhoto, refreshUser, debugAuth]);

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }



// store/auth.tsx - Complete updated file with fixed upload functions

// // store/auth.tsx
// import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
// import { User } from '@/types';
// import { API_BASE_URL } from '@/constants/api';

// type AuthState = {
//   user: User | null;
//   token: string | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   registrationEmail: string | null;
//   registrationData: any | null;
// };

// type AuthAction =
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'SET_AUTH'; payload: { user: User; token: string } }
//   | { type: 'LOGOUT' }
//   | { type: 'UPDATE_USER'; payload: Partial<User> }
//   | { type: 'SET_REGISTRATION_EMAIL'; payload: string | null }
//   | { type: 'SET_REGISTRATION_DATA'; payload: any | null };

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: true,
//   isAuthenticated: false,
//   registrationEmail: null,
//   registrationData: null,
// };

// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case 'SET_LOADING':
//       return { ...state, isLoading: action.payload };
//     case 'SET_AUTH':
//       console.log('✅ SET_AUTH called with user:', action.payload.user);
//       console.log('✅ User ID:', action.payload.user.id);
//       return { 
//         ...state, 
//         user: action.payload.user, 
//         token: action.payload.token, 
//         isLoading: false, 
//         isAuthenticated: true,
//         registrationEmail: null,
//         registrationData: null
//       };
//     case 'LOGOUT':
//       return { 
//         user: null, 
//         token: null, 
//         isLoading: false, 
//         isAuthenticated: false, 
//         registrationEmail: null,
//         registrationData: null
//       };
//     case 'UPDATE_USER':
//       console.log('✅ UPDATE_USER called with:', action.payload);
//       return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
//     case 'SET_REGISTRATION_EMAIL':
//       return { ...state, registrationEmail: action.payload };
//     case 'SET_REGISTRATION_DATA':
//       return { ...state, registrationData: action.payload };
//     default:
//       return state;
//   }
// }

// type AuthContextType = {
//   state: AuthState;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string, phone?: string, address?: any) => Promise<void>;
//   verifyOTP: (email: string, otp: string) => Promise<void>;
//   resendOTP: (email: string) => Promise<void>;
//   logout: () => Promise<void>;
//   updateUser: (data: Partial<User>) => void;
//   updateProfile: (data: Partial<User>) => Promise<void>;
//   uploadProfilePhoto: (imageUri: string) => Promise<string | null>;
//   refreshUser: () => Promise<void>;
//   debugAuth: () => void;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Storage abstraction
// const storage = {
//   async getItem(key: string): Promise<string | null> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         return window.localStorage.getItem(key);
//       }
//       return null;
//     } catch {
//       return null;
//     }
//   },
//   async setItem(key: string, value: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.setItem(key, value);
//       }
//     } catch {}
//   },
//   async removeItem(key: string): Promise<void> {
//     try {
//       if (typeof window !== 'undefined' && window.localStorage) {
//         window.localStorage.removeItem(key);
//       }
//     } catch {}
//   },
// };

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // Load auth state from storage on mount
//   useEffect(() => {
//     (async () => {
//       try {
//         console.log('🔍 Loading auth state from storage...');
//         const token = await storage.getItem('auth_token');
//         const userStr = await storage.getItem('auth_user');
        
//         console.log('🔍 Token found:', token ? 'Yes' : 'No');
//         console.log('🔍 User data found:', userStr ? 'Yes' : 'No');
        
//         if (token && userStr) {
//           try {
//             const user = JSON.parse(userStr);
//             console.log('📦 Parsed user from storage:', user);
            
//             if (!user.id) {
//               console.error('❌ User data missing ID:', user);
//               await storage.removeItem('auth_token');
//               await storage.removeItem('auth_user');
//               dispatch({ type: 'SET_LOADING', payload: false });
//               return;
//             }
            
//             console.log('✅ Auth restored. User ID:', user.id);
//             dispatch({ type: 'SET_AUTH', payload: { user, token } });
//           } catch (parseError) {
//             console.error('❌ Failed to parse user data:', parseError);
//             await storage.removeItem('auth_token');
//             await storage.removeItem('auth_user');
//             dispatch({ type: 'SET_LOADING', payload: false });
//           }
//         } else {
//           console.log('❌ No auth data found');
//           dispatch({ type: 'SET_LOADING', payload: false });
//         }
//       } catch (error) {
//         console.error('❌ Auth loading error:', error);
//         dispatch({ type: 'SET_LOADING', payload: false });
//       }
//     })();
//   }, []);

//   // Helper function to map user data from API
//   const mapUserData = useCallback((data: any): User => {
//     console.log('📦 Mapping user data:', data);
    
//     const userId = data.id || data._id || data.customer_id || data.user_id || data.uid;
    
//     if (!userId) {
//       console.error('❌ No user ID found in data:', data);
//       throw new Error('User ID is missing from server response');
//     }

//     console.log('✅ Mapping user with ID:', userId);

//     return {
//       id: String(userId),
//       name: data.name || data.full_name || data.username || 'User',
//       email: data.email || '',
//       phone: data.phone || data.mobile || data.phoneNumber || '',
//       avatar: data.avatar || data.profile_image || data.profile_picture || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
//       isPremium: data.isPremium || data.is_premium || false,
//       addressLine1: data.addressLine1 || data.address_line1 || data.address1 || '',
//       addressLine2: data.addressLine2 || data.address_line2 || data.address2 || '',
//       city: data.city || data.city_name || '',
//       state: data.state || data.state_name || '',
//       pincode: data.pincode || data.zip_code || data.postal_code || '',
//       country: data.country || 'India',
//       createdAt: data.createdAt || data.created_at || data.registration_date || new Date().toISOString(),
//       updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
//     };
//   }, []);

//   const login = useCallback(async (email: string, password: string) => {
//     try {
//       const url = `${API_BASE_URL}/login`;
//       console.log('🔍 Login URL:', url);
//       console.log('📧 Login email:', email);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Login response:', data);

//       if (response.status === 403 && data.requiresOTP) {
//         dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });
//         throw new Error('Please verify your email first');
//       }

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       const userData = data.user || data.customer || data.data?.user || data.data?.customer;
      
//       if (!userData) {
//         console.error('❌ No user data in response:', data);
//         throw new Error('No user data in response');
//       }

//       const user = mapUserData(userData);
      
//       console.log('✅ Login successful. User ID:', user.id);

//       const token = data.token || data.accessToken;
//       await storage.setItem('auth_token', token);
//       await storage.setItem('auth_user', JSON.stringify(user));

//       dispatch({ type: 'SET_AUTH', payload: { user, token } });
      
//     } catch (error) {
//       console.error('❌ Login error:', error);
//       throw error;
//     }
//   }, [mapUserData]);

//   const register = useCallback(async (name: string, email: string, password: string, phone?: string, address?: any) => {
//     try {
//       const url = `${API_BASE_URL}/register`;
//       console.log('🔍 Registration URL:', url);
      
//       const payload = {
//         name,
//         email,
//         phone: phone || '',
//         password,
//         addressLine1: address?.addressLine1 || '',
//         addressLine2: address?.addressLine2 || '',
//         city: address?.city || '',
//         state: address?.state || '',
//         pincode: address?.pincode || '',
//         country: address?.country || 'India'
//       };
      
//       console.log('📦 Registration Payload:', { ...payload, password: '***' });
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Registration response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Registration failed');
//       }

//       const emailToStore = data.email || email;
//       dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: emailToStore });
//       dispatch({ type: 'SET_REGISTRATION_DATA', payload: { name, email, phone, ...address } });

//       console.log('✅ Registration initiated. Email:', emailToStore);

//       return data;
//     } catch (error) {
//       console.error('❌ Registration error:', error);
//       throw error;
//     }
//   }, []);

//   const verifyOTP = useCallback(async (email: string, otp: string) => {
//     try {
//       const url = `${API_BASE_URL}/verify-otp`;
//       console.log('🔍 Verify OTP URL:', url);
//       console.log('📧 Email:', email);
//       console.log('🔢 OTP:', otp);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email, otp }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Verify OTP response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'OTP verification failed');
//       }

//       const userData = data.user || data.customer || data.data?.user || data.data?.customer;
      
//       if (!userData) {
//         throw new Error('No user data in response');
//       }

//       const user = mapUserData(userData);
//       const token = data.token || data.accessToken;
      
//       console.log('✅ OTP verified. User ID:', user.id);

//       await storage.setItem('auth_token', token);
//       await storage.setItem('auth_user', JSON.stringify(user));

//       dispatch({ type: 'SET_AUTH', payload: { user, token } });
//     } catch (error) {
//       console.error('❌ OTP verification error:', error);
//       throw error;
//     }
//   }, [mapUserData]);

//   const resendOTP = useCallback(async (email: string) => {
//     try {
//       const url = `${API_BASE_URL}/resend-otp`;
//       console.log('🔍 Resend OTP URL:', url);
//       console.log('📧 Email:', email);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify({ email }),
//       });

//       const responseText = await response.text();
//       let data;
//       try {
//         data = JSON.parse(responseText);
//       } catch (e) {
//         throw new Error(`Server returned invalid response. Status: ${response.status}`);
//       }

//       console.log('📦 Resend OTP response:', data);

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to resend OTP');
//       }

//       return data;
//     } catch (error) {
//       console.error('❌ Resend OTP error:', error);
//       throw error;
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     console.log('🔍 Logging out...');
//     console.log('👤 Current user:', state.user?.id);
    
//     await storage.removeItem('auth_token');
//     await storage.removeItem('auth_user');
//     dispatch({ type: 'LOGOUT' });
    
//     console.log('✅ Logout successful');
//   }, [state.user]);

//   const updateUser = useCallback((data: Partial<User>) => {
//     if (state.user) {
//       const updated = { ...state.user, ...data };
//       storage.setItem('auth_user', JSON.stringify(updated));
//       dispatch({ type: 'UPDATE_USER', payload: data });
//       console.log('✅ User updated:', updated);
//     }
//   }, [state.user]);

//   // ─── Update Profile ──────────────────────────────────────────────────────────
//   const updateProfile = useCallback(async (data: Partial<User>) => {
//     if (!state.token || !state.user) {
//       console.log('❌ Cannot update profile: No token or user');
//       throw new Error('User not authenticated');
//     }

//     try {
//       console.log('🔄 Updating profile...', data);
      
//       const url = `${API_BASE_URL}/customers/${state.user.id}`;
//       console.log('📡 Update URL:', url);
      
//       const response = await fetch(url, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${state.token}`,
//           'Content-Type': 'application/json',
//           'Accept': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to update profile');
//       }

//       const result = await response.json();
//       console.log('✅ Profile updated:', result);
      
//       const updatedUser = { ...state.user, ...data };
//       await storage.setItem('auth_user', JSON.stringify(updatedUser));
//       dispatch({ type: 'UPDATE_USER', payload: data });
      
//       return result;
//     } catch (error) {
//       console.error('❌ Failed to update profile:', error);
//       throw error;
//     }
//   }, [state.token, state.user]);

//   // ─── Upload Profile Photo (Fixed for React Native Web) ──────────────────────
//   const uploadProfilePhoto = useCallback(async (imageUri: string): Promise<string | null> => {
//     if (!state.token || !state.user) {
//       console.log('❌ Cannot upload photo: No token or user');
//       throw new Error('User not authenticated');
//     }

//     try {
//       console.log('📸 Uploading profile photo...');
//       console.log('👤 User ID:', state.user.id);
//       console.log('📸 Image URI:', imageUri);
      
//       // First, fetch the image as blob
//       const imageResponse = await fetch(imageUri);
//       const blob = await imageResponse.blob();
      
//       console.log('📸 Blob created:', {
//         size: blob.size,
//         type: blob.type
//       });

//       // Create form data
//       const formData = new FormData();
      
//       // Determine file extension and name
//       const timestamp = Date.now();
//       const fileName = `profile_${state.user.id}_${timestamp}.jpg`;
      
//       // Append the blob directly
//       formData.append('profileImage', blob, fileName);

//       console.log('📦 FormData created with file:', {
//         fileName: fileName,
//         blobSize: blob.size,
//         blobType: blob.type
//       });

//       const url = `${API_BASE_URL}/customers/${state.user.id}/profile-image`;
//       console.log('📡 Upload URL:', url);
      
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${state.token}`,
//           'Accept': 'application/json',
//         },
//         body: formData,
//       });

//       console.log('📡 Response status:', response.status);

//       if (!response.ok) {
//         const errorData = await response.json();
//         console.error('❌ Upload error response:', errorData);
//         throw new Error(errorData.message || 'Failed to upload photo');
//       }

//       const result = await response.json();
//       console.log('✅ Profile photo uploaded:', result);
      
//       // Get the image URL from the response
//       const imageUrl = result.data?.imageUrl || result.imageUrl || result.avatar;
      
//       if (imageUrl) {
//         // Store the full URL if it's a path
//         const fullAvatarUrl = imageUrl.startsWith('http') 
//           ? imageUrl 
//           : `http://localhost:5000${imageUrl}`;
        
//         console.log('📸 Full avatar URL:', fullAvatarUrl);
        
//         const updatedUser = { ...state.user, avatar: fullAvatarUrl };
//         await storage.setItem('auth_user', JSON.stringify(updatedUser));
//         dispatch({ type: 'UPDATE_USER', payload: { avatar: fullAvatarUrl } });
        
//         return fullAvatarUrl;
//       }
      
//       return null;
//     } catch (error) {
//       console.error('❌ Failed to upload profile photo:', error);
//       throw error;
//     }
//   }, [state.token, state.user]);

//   const refreshUser = useCallback(async () => {
//     if (!state.token || !state.user) {
//       console.log('❌ Cannot refresh user: No token or user');
//       return;
//     }

//     try {
//       console.log('🔄 Refreshing user data...');
//       const url = `${API_BASE_URL}/customers/me`;
//       console.log('📡 Refresh URL:', url);
      
//       const response = await fetch(url, {
//         headers: {
//           'Authorization': `Bearer ${state.token}`,
//           'Accept': 'application/json',
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         const userData = data.user || data.customer || data.data;
        
//         if (userData) {
//           const user = mapUserData(userData);
//           console.log('✅ User refreshed:', user.id);
          
//           await storage.setItem('auth_user', JSON.stringify(user));
//           dispatch({ type: 'UPDATE_USER', payload: user });
//         }
//       }
//     } catch (error) {
//       console.error('❌ Failed to refresh user:', error);
//     }
//   }, [state.token, state.user, mapUserData]);

//   const debugAuth = useCallback(() => {
//     console.log('🔍 DEBUG - Current Auth State:', {
//       user: state.user,
//       userId: state.user?.id,
//       token: state.token ? 'exists' : 'not found',
//       isAuthenticated: state.isAuthenticated,
//       isLoading: state.isLoading
//     });
    
//     if (typeof window !== 'undefined' && window.localStorage) {
//       const token = window.localStorage.getItem('auth_token');
//       const userStr = window.localStorage.getItem('auth_user');
//       console.log('🔍 DEBUG - localStorage:', {
//         token: token ? 'exists' : 'not found',
//         userStr: userStr ? userStr.substring(0, 100) + '...' : 'not found'
//       });
//     }
//   }, [state]);

//   const contextValue = useMemo(() => ({
//     state,
//     login,
//     register,
//     verifyOTP,
//     resendOTP,
//     logout,
//     updateUser,
//     updateProfile,
//     uploadProfilePhoto,
//     refreshUser,
//     debugAuth
//   }), [state, login, register, verifyOTP, resendOTP, logout, updateUser, updateProfile, uploadProfilePhoto, refreshUser, debugAuth]);

//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//   return ctx;
// }




// store/auth.tsx
import { createContext, useContext, useReducer, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { User } from '@/types';
import { API_BASE_URL } from '@/constants/api';

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  registrationEmail: string | null;
  registrationData: any | null;
};

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_REGISTRATION_EMAIL'; payload: string | null }
  | { type: 'SET_REGISTRATION_DATA'; payload: any | null };

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  registrationEmail: null,
  registrationData: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUTH':
      console.log('✅ SET_AUTH called with user:', action.payload.user);
      return { 
        ...state, 
        user: action.payload.user, 
        token: action.payload.token, 
        isLoading: false, 
        isAuthenticated: true,
        registrationEmail: null,
        registrationData: null
      };
    case 'LOGOUT':
      return { 
        user: null, 
        token: null, 
        isLoading: false, 
        isAuthenticated: false, 
        registrationEmail: null,
        registrationData: null
      };
    case 'UPDATE_USER':
      return { ...state, user: state.user ? { ...state.user, ...action.payload } : null };
    case 'SET_REGISTRATION_EMAIL':
      return { ...state, registrationEmail: action.payload };
    case 'SET_REGISTRATION_DATA':
      return { ...state, registrationData: action.payload };
    default:
      return state;
  }
}

type AuthContextType = {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, address?: any) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  uploadProfilePhoto: (imageUri: string) => Promise<string | null>;
  refreshUser: () => Promise<void>;
  debugAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage abstraction
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from storage on mount
  useEffect(() => {
    (async () => {
      try {
        console.log('🔍 Loading auth state from storage...');
        const token = await storage.getItem('auth_token');
        const userStr = await storage.getItem('auth_user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            if (!user.id) {
              console.error('❌ User data missing ID:', user);
              await storage.removeItem('auth_token');
              await storage.removeItem('auth_user');
              dispatch({ type: 'SET_LOADING', payload: false });
              return;
            }
            dispatch({ type: 'SET_AUTH', payload: { user, token } });
          } catch (parseError) {
            console.error('❌ Failed to parse user data:', parseError);
            await storage.removeItem('auth_token');
            await storage.removeItem('auth_user');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('❌ Auth loading error:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, []);

  const mapUserData = useCallback((data: any): User => {
    const userId = data.id || data._id || data.customer_id || data.user_id || data.uid;
    
    if (!userId) {
      console.error('❌ No user ID found in data:', data);
      throw new Error('User ID is missing from server response');
    }

    return {
      id: String(userId),
      name: data.name || data.full_name || data.username || 'User',
      email: data.email || '',
      phone: data.phone || data.mobile || data.phoneNumber || '',
      avatar: data.avatar || data.profile_image || data.profile_picture || 'https://images.pexels.com/photos/220457/pexels-photo-220457.jpeg?auto=compress&cs=tinysrgb&w=400',
      isPremium: data.isPremium || data.is_premium || false,
      addressLine1: data.addressLine1 || data.address_line1 || data.address1 || '',
      addressLine2: data.addressLine2 || data.address_line2 || data.address2 || '',
      city: data.city || data.city_name || '',
      state: data.state || data.state_name || '',
      pincode: data.pincode || data.zip_code || data.postal_code || '',
      country: data.country || 'India',
      createdAt: data.createdAt || data.created_at || data.registration_date || new Date().toISOString(),
      updatedAt: data.updatedAt || data.updated_at || new Date().toISOString(),
    };
  }, []);

  // 🔧 FIXED: Use /auth/login instead of /login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const url = `${API_BASE_URL}/auth/login`;
      console.log('🔍 Login URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        const contentType = response.headers.get('content-type') || 'unknown';
        console.error('❌ Login API returned a non-JSON response:', {
          status: response.status,
          contentType,
        });
        throw new Error(
          response.ok
            ? 'Login service returned an invalid response. Please try again later.'
            : `Login service is unavailable (${response.status}). Please try again later.`
        );
      }

      if (response.status === 403 && data.requiresOTP) {
        dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: data.email });
        throw new Error('Please verify your email first');
      }

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const userData = data.user || data.customer || data.data?.user || data.data?.customer;
      
      if (!userData) {
        console.error('❌ No user data in response:', data);
        throw new Error('No user data in response');
      }

      const user = mapUserData(userData);
      const token = data.token || data.accessToken;
      
      await storage.setItem('auth_token', token);
      await storage.setItem('auth_user', JSON.stringify(user));

      dispatch({ type: 'SET_AUTH', payload: { user, token } });
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      if (error instanceof TypeError) {
        throw new Error('Unable to reach the login service. Check your internet connection and try again.');
      }
      throw error;
    }
  }, [mapUserData]);

  // 🔧 FIXED: Use /auth/register instead of /register
  const register = useCallback(async (name: string, email: string, password: string, phone?: string, address?: any) => {
    try {
      const url = `${API_BASE_URL}/auth/register`;
      console.log('🔍 Registration URL:', url);
      
      const payload = {
        name,
        email,
        phone: phone || '',
        password,
        addressLine1: address?.addressLine1 || '',
        addressLine2: address?.addressLine2 || '',
        city: address?.city || '',
        state: address?.state || '',
        pincode: address?.pincode || '',
        country: address?.country || 'India'
      };
      
      console.log('📦 Registration Payload:', { ...payload, password: '***' });
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const emailToStore = data.email || email;
      dispatch({ type: 'SET_REGISTRATION_EMAIL', payload: emailToStore });
      dispatch({ type: 'SET_REGISTRATION_DATA', payload: { name, email, phone, ...address } });

      return data;
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }, []);

  // 🔧 FIXED: Use /auth/verify-otp instead of /verify-otp
  const verifyOTP = useCallback(async (email: string, otp: string) => {
    try {
      const url = `${API_BASE_URL}/auth/verify-otp`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'OTP verification failed');
      }

      const userData = data.user || data.customer || data.data?.user || data.data?.customer;
      
      if (!userData) {
        throw new Error('No user data in response');
      }

      const user = mapUserData(userData);
      const token = data.token || data.accessToken;

      await storage.setItem('auth_token', token);
      await storage.setItem('auth_user', JSON.stringify(user));

      dispatch({ type: 'SET_AUTH', payload: { user, token } });
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      throw error;
    }
  }, [mapUserData]);

  // 🔧 FIXED: Use /auth/resend-otp instead of /resend-otp
  const resendOTP = useCallback(async (email: string) => {
    try {
      const url = `${API_BASE_URL}/auth/resend-otp`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error(`Server returned invalid response. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      return data;
    } catch (error) {
      console.error('❌ Resend OTP error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await storage.removeItem('auth_token');
    await storage.removeItem('auth_user');
    dispatch({ type: 'LOGOUT' });
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    if (state.user) {
      const updated = { ...state.user, ...data };
      storage.setItem('auth_user', JSON.stringify(updated));
      dispatch({ type: 'UPDATE_USER', payload: data });
    }
  }, [state.user]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!state.token || !state.user) {
      throw new Error('User not authenticated');
    }

    try {
      const url = `${API_BASE_URL}/customers/${state.user.id}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const result = await response.json();
      
      const updatedUser = { ...state.user, ...data };
      await storage.setItem('auth_user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: data });
      
      return result;
    } catch (error) {
      console.error('❌ Failed to update profile:', error);
      throw error;
    }
  }, [state.token, state.user]);

  const uploadProfilePhoto = useCallback(async (imageUri: string): Promise<string | null> => {
    if (!state.token || !state.user) {
      throw new Error('User not authenticated');
    }

    try {
      const imageResponse = await fetch(imageUri);
      const blob = await imageResponse.blob();
      
      const formData = new FormData();
      const timestamp = Date.now();
      const fileName = `profile_${state.user.id}_${timestamp}.jpg`;
      
      formData.append('profileImage', blob, fileName);

      const url = `${API_BASE_URL}/customers/${state.user.id}/profile-image`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload photo');
      }

      const result = await response.json();
      
      const imageUrl = result.data?.imageUrl || result.imageUrl || result.avatar;
      
      if (imageUrl) {
        const fullAvatarUrl = imageUrl.startsWith('http') 
          ? imageUrl 
          : `http://localhost:5000${imageUrl}`;
        
        const updatedUser = { ...state.user, avatar: fullAvatarUrl };
        await storage.setItem('auth_user', JSON.stringify(updatedUser));
        dispatch({ type: 'UPDATE_USER', payload: { avatar: fullAvatarUrl } });
        
        return fullAvatarUrl;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to upload profile photo:', error);
      throw error;
    }
  }, [state.token, state.user]);

  const refreshUser = useCallback(async () => {
    if (!state.token || !state.user) {
      return;
    }

    try {
      const url = `${API_BASE_URL}/customers/me`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user || data.customer || data.data;
        
        if (userData) {
          const user = mapUserData(userData);
          await storage.setItem('auth_user', JSON.stringify(user));
          dispatch({ type: 'UPDATE_USER', payload: user });
        }
      }
    } catch (error) {
      console.error('❌ Failed to refresh user:', error);
    }
  }, [state.token, state.user, mapUserData]);

  const debugAuth = useCallback(() => {
    console.log('🔍 DEBUG - Current Auth State:', {
      user: state.user,
      userId: state.user?.id,
      token: state.token ? 'exists' : 'not found',
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading
    });
  }, [state]);

  const contextValue = useMemo(() => ({
    state,
    login,
    register,
    verifyOTP,
    resendOTP,
    logout,
    updateUser,
    updateProfile,
    uploadProfilePhoto,
    refreshUser,
    debugAuth
  }), [state, login, register, verifyOTP, resendOTP, logout, updateUser, updateProfile, uploadProfilePhoto, refreshUser, debugAuth]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

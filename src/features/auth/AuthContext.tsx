import { createContext, useContext, useReducer, useEffect, type ReactNode, type Dispatch } from 'react'; 
import { authReducer, initialState, type AuthState, type AuthAction } from './authReducer';
import { setAuthToken } from '../../api/axios';

interface AuthContextType {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Synchronise le token avec l'instance API à chaque changement du state.token
  useEffect(() => {
    setAuthToken(state.token);
  }, [state.token]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  return context;
}
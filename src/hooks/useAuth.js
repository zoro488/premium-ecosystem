import { useState, useEffect } from 'react';
import { escucharAuthState } from '../services/authService';

/**
 * Hook personalizado para manejar el estado de autenticación
 *
 * @returns {Object} - { user, loading, isAuthenticated }
 *
 * Uso:
 * const { user, loading, isAuthenticated } = useAuth();
 *
 * if (loading) return <div>Cargando...</div>;
 * if (!isAuthenticated) return <LoginForm />;
 * return <div>Hola {user.displayName}</div>;
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuchar cambios en el estado de autenticación
    const unsubscribe = escucharAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup: dejar de escuchar cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: user !== null
  };
};

export default useAuth;

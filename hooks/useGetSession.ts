import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface UserSession {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  rol: string;
  imagen_perfil?: string;
  token: string;
}

export default function useGetSession() {
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("auth-token");
      const rol = await AsyncStorage.getItem("rol");

      if (token && rol) {
        const response = await fetch("http://192.168.132.114:8000/api/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener el perfil del usuario");
        }

        const data = await response.json();

        // Asegura que estás accediendo al objeto de usuario correctamente
        const usuario = data.usuarios ?? data.usuario ?? data;

        setUserSession({
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          correo: usuario.correo,
          telefono: usuario.telefono,
          imagen_perfil: usuario.imagen_perfil,
          rol,
          token,
        });
      } else {
        setUserSession(null);
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      setUserSession(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const refreshSession = async () => {
    await loadSession();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth-token");
    await AsyncStorage.removeItem("rol");
    setUserSession(null);
  };

  return { userSession, loading, handleLogout, refreshSession };
}


{/*import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useGetSession() {
  const [userSession, setUserSession] = useState<{ token: string; rol: string } | null>(null);

  useEffect(() => {
    const loadSession = async () => {
      const token = await AsyncStorage.getItem('auth-token');
      const rol = await AsyncStorage.getItem('rol');
      if (token && rol) {
        setUserSession({ token, rol });
      }
    };

    loadSession();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('auth-token');
    await AsyncStorage.removeItem('rol');
    setUserSession(null);
  };

  return { userSession, handleLogout };
}*/}

import { HttpHeaders } from '@angular/common/http';

export const getHeaders = (): HttpHeaders => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('Token no disponible. El usuario no está autenticado.');
  }

  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });
};

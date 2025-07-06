import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Clonamos la request y le añadimos el Authorization si hay token
  const modifiedReq = token
    ? req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
      withCredentials: true
    })
    : req.clone({ withCredentials: true });

  return next(modifiedReq);
};

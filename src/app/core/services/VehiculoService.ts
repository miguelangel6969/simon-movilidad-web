import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../enviroments/environment';
import {VehiculoUbicacion} from '../models/VehiculoUbicacion.model';

@Injectable({ providedIn: 'root' })
export class VehiculoService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/vehiculos`;

  getUbicaciones(): Observable<VehiculoUbicacion[]> {
    const url = `${this.baseUrl}/posiciones`;
    const cacheKey = 'vehiculos';

    return new Observable(observer => {
      // 1. Intentar mostrar los datos cacheados primero
      const dataLocal = localStorage.getItem(cacheKey);
      if (dataLocal) {
        observer.next(JSON.parse(dataLocal));
      }

      // 2. Consultar los datos reales del backend
      this.http.get<VehiculoUbicacion[]>(url).subscribe({
        next: (data) => {
          localStorage.setItem(cacheKey, JSON.stringify(data)); // Actualizar caché
          observer.next(data); // Enviar al frontend
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getHistorialSensores(vehiculoId: number): Observable<any[]> {
    const cacheKey = `historial_${vehiculoId}`;
    const url = `${this.baseUrl}/${vehiculoId}/sensores`;

    return new Observable(observer => {
      // 1. Intentar cargar desde localStorage primero
      const localData = localStorage.getItem(cacheKey);
      if (localData) {
        observer.next(JSON.parse(localData)); // muestra caché de inmediato
      }

      // 2. Hacer la petición real para obtener lo más reciente
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          // Guardar en caché
          localStorage.setItem(cacheKey, JSON.stringify(data));
          observer.next(data);
          observer.complete();
        },
        error: (err) => observer.error(err),
      });
    });
  }

}

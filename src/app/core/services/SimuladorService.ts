// simulador.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';

const COORDENADAS_SIMULADAS = [
  { lat: 4.680643928383975, lon: -74.05800862066607 },
  { lat: 4.6849779393956155, lon: -74.05734100453392 },
  { lat: 4.689617639278006, lon: -74.05663730103052 },
  { lat: 4.6945810050274375, lon: -74.05577120440434 },
  { lat: 4.701990021583225, lon: -74.05458032154645 },
  { lat: 4.710334062353754, lon: -74.0531729145396 },
  { lat: 4.718336335016206, lon: -74.05185572590702 },
  { lat: 4.729568054489983, lon: -74.04996326848268 },
  { lat: 4.73909857621059, lon: -74.04826716258901 },
  { lat: 4.751056497703743, lon: -74.04658910037773 }
];

@Injectable({ providedIn: 'root' })
export class SimuladorService {
  private index = 0;
  private intervalSub?: Subscription;

  constructor(private http: HttpClient) {}

  iniciarSimulacion(): void {
    this.intervalSub = interval(5000).subscribe(() => {
      const coord = COORDENADAS_SIMULADAS[this.index];

      const payload = {
        vehiculoId: 1,
        latitud: coord.lat,
        longitud: coord.lon,
        temperatura: 30 + Math.random() * 2,      // variación realista
        velocidad: 40 + Math.random() * 10,
        nivelCombustible: 25 - this.index,        // simulando caída de combustible
        consumoPorHora: 10
      };

      this.http.post('http://localhost:8080/api/sensores', payload).subscribe();

      this.index = (this.index + 1) % COORDENADAS_SIMULADAS.length; // 🔁 reinicia recorrido
    });
  }

  detenerSimulacion(): void {
    this.intervalSub?.unsubscribe();
    this.index = 0;
  }
}

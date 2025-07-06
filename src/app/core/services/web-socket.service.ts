import { Injectable } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../enviroments/environment';
import { SensorData } from '../models/dto/SensorData';
import {VehiculoUbicacion} from '../models/VehiculoUbicacion.model';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private stompClient!: Client;

  private alertasSubject = new Subject<SensorData>();
  public alertas$ = this.alertasSubject.asObservable();

  private vehiculosSubject = new Subject<VehiculoUbicacion>();
  public vehiculos$ = this.vehiculosSubject.asObservable();

  connect(): void {
    const token = localStorage.getItem('token'); // <-- Aquí tomamos el token

    const socketUrl = `${environment.apiWebSocket}`;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`, // <-- Aquí lo enviamos al backend
      },
      reconnectDelay: 5000,
      onConnect: () => {
        // 📡 Suscribirse a alertas
        this.stompClient.subscribe('/topic/alertas', (message: IMessage) => {
          const alerta: SensorData = JSON.parse(message.body);
          this.alertasSubject.next(alerta);
          // 🔄 Guardar en localStorage
          const alertasGuardadas = JSON.parse(localStorage.getItem('alertas') || '[]');
          alertasGuardadas.push(alerta);
          localStorage.setItem('alertas', JSON.stringify(alertasGuardadas));
        });

        // 📍 Suscribirse a ubicaciones de vehículos
        this.stompClient.subscribe('/topic/vehiculos', (message: IMessage) => {
          const ubicacion: VehiculoUbicacion = JSON.parse(message.body);
          this.vehiculosSubject.next(ubicacion);
          // 🧠 Guardar último estado
          const actuales = JSON.parse(localStorage.getItem('vehiculos') || '[]');

          const index = actuales.findIndex((v: any) => v.id === ubicacion.id);
          if (index >= 0) {
            actuales[index] = ubicacion;
          } else {
            actuales.push(ubicacion);
          }

          localStorage.setItem('vehiculos', JSON.stringify(actuales));
        });
      },
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}

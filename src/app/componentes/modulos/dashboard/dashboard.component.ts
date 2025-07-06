import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import { Renderer2 } from '@angular/core';
import {VehiculoService} from '../../../core/services/VehiculoService';
import {VehiculoUbicacion} from '../../../core/models/VehiculoUbicacion.model';
import {WebSocketService} from '../../../core/services/web-socket.service';
import {HistorialModalComponent} from '../../modals/historial-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {LoginService} from '../../../core/services/login.service';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true
})

export class DashboardComponent implements AfterViewInit  {
  alertas: any[] = [];
  usuario: any = {};
  esAdmin: boolean = false;

  private map!: L.Map;
  private markers: Map<number, L.Marker> = new Map();

  constructor(private router: Router,private webSocketService: WebSocketService,private vehiculoService: VehiculoService,  private renderer: Renderer2,  private dialog: MatDialog,private loginService: LoginService) {}

  ngAfterViewInit(): void {
    // 🗺️ Inicializar mapa antes de cualquier uso
    this.inicializarMapa();

    this.esAdmin = this.loginService.getRolUsuario() === 'ADMIN';

    // 🔁 Recuperar alertas en caché
    const almacenadas = localStorage.getItem('alertas');
    if (almacenadas) {
      this.alertas = JSON.parse(almacenadas);
    }

    // 🔁 Recuperar ubicaciones en caché
    const dataLocal = localStorage.getItem('vehiculos');
    if (dataLocal) {
      const ubicaciones: VehiculoUbicacion[] = JSON.parse(dataLocal);
      ubicaciones.forEach(v => this.actualizarVehiculoEnMapa(v));
    }

    // 🌐 Conexión WebSocket
    this.webSocketService.connect();

    // 🚗 Obtener ubicaciones del backend
    this.vehiculoService.getUbicaciones().subscribe((vehiculos) => {
      vehiculos.forEach((v) => this.actualizarVehiculoEnMapa(v));
    });

    // 🔄 Escuchar actualizaciones en tiempo real
    this.webSocketService.vehiculos$.subscribe((vehiculo) => {
      this.actualizarVehiculoEnMapa(vehiculo);
    });

    // 🚨 Escuchar alertas
    this.webSocketService.alertas$.subscribe((alerta) => {
      this.alertas.unshift({
        ...alerta,
        fecha: new Date()
      });
    });
  }


  inicializarMapa(): void {
    this.map = L.map('mapa').setView([4.656, -74.059], 13); // Centro Bogotá

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
  }

  actualizarVehiculoEnMapa(vehiculo: VehiculoUbicacion): void {
    const { id, latitud, longitud, placa } = vehiculo;

    const iconoCarro = L.icon({
      iconUrl: "assets/icons/car.png",
      iconSize: [50, 50],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    // 🧱 Crear popup personalizado
    const popupContent = L.DomUtil.create('div', '');
    popupContent.innerHTML = `<strong>Vehículo con placa: ${this.enmascararPlaca(placa)}</strong><br/>`;

    const button = L.DomUtil.create('button', '', popupContent);
    button.innerText = 'Ver historial';
    button.className = 'mt-2 inline-block bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition';

    this.renderer.listen(button, 'click', () => this.abrirModalConHistorial(id));

    if (this.markers.has(id)) {
      const marker = this.markers.get(id)!;
      marker.setLatLng([latitud, longitud]);
      marker.setPopupContent(popupContent); // 🔄 Actualiza popup también
    } else {
      const marker = L.marker([latitud, longitud], { icon: iconoCarro }).addTo(this.map);
      marker.bindPopup(popupContent);
      this.markers.set(id, marker);
    }
  }

  enmascararPlaca(placa: string): string {
    if (this.esAdmin) return placa;

    const letras = placa.slice(0, 1);
    const numeros = placa.slice(-3);
    return `${letras}***${numeros}`;
  }

  abrirModalConHistorial(idVehiculo: number): void {
    this.vehiculoService.getHistorialSensores(idVehiculo).subscribe(data => {
      this.dialog.open(HistorialModalComponent, {
        width: '95vw',
        maxWidth: '70vw',
        height: '70%',
        data,
        disableClose: true,
      });
    });
  }

  cerrarSesion(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

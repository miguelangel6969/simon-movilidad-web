# DESIGN.md – Frontend Angular 20

## ✨ Tecnologías Seleccionadas

### ☑ Angular 20 (Standalone API + Signal Inputs)
Angular proporciona una estructura robusta, modular y bien mantenida. La versión 20 se eligió por:

- Compatibilidad con componentes `standalone`, ideal para apps SPA modernas.
- Buen manejo de estados reactivamente.
- Ecosistema maduro para pruebas, autenticación, WebSocket y manejo de rutas.

### ☑ Tailwind CSS
Framework de utilidad para estilos modernos sin escribir CSS personalizado.

- Facilita diseño responsivo.
- Rápido para prototipado.
- Integrado directamente en los componentes.

### ☑ Leaflet + OpenStreetMap
Para mostrar ubicaciones en vivo de los vehículos:

- Librería ligera y fácil de integrar.
- Compatible con datos de lat/lon recibidos por WebSocket.
- Personalización de marcadores con popups.

---

## ⚖️ Arquitectura general

- Autenticación JWT mediante `LoginService`
- Guard de rutas `AuthGuard`
- Servicios: `VehiculoService`, `WebSocketService`, `LoginService`
- Componentes standalone:
  - `LoginComponent`
  - `DashboardComponent` (mapa + alertas)
  - `HistorialModalComponent` (detalle de sensores)

---

## 🚀 WebSocket

Suscripción a los canales:
- `/topic/alertas`: Alertas de autonomía baja.
- `/topic/vehiculos`: Ubicación en tiempo real de vehículos.

WebSocket se maneja con `stomp.js` + `SockJS`, transmitiendo datos al frontend sin necesidad de polling.

---

## 📊 Funcionalidades implementadas

- Login JWT y protección de rutas
- Vista principal con mapa y marcadores por vehículo
- Modal con historial de sensores por vehículo
- Alerta visual en barra lateral (solo admin)
- Cacheo offline de datos con `localStorage`
  - Datos persistidos: alertas y ubicaciones

---

## ⚙️ Razones para estas decisiones

- Angular permite escalar la aplicación con múltiples vistas y mantener buenas prácticas de arquitectura.
- Tailwind permite velocidad de desarrollo visual sin perder coherencia.
- Leaflet es liviano y eficaz para mostrar ubicaciones en tiempo real.
- El uso de `localStorage` garantiza operatividad básica incluso sin conexión.


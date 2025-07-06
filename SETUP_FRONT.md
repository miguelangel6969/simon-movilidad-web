# SETUP.md – Frontend (Angular 20 + Tailwind CSS)

## 🚀 Requisitos previos

- Node.js (v18 o superior recomendado)
- npm o pnpm
- Angular CLI 17 o 18

---

## 📁 Clonar el repositorio

```bash
git clone https://github.com/miguelangel6969/simon-movilidad-web.git
cd simon-movilidad-web
```

---

## 📄 Instalar dependencias

```bash
npm install
# o con pnpm
dpnpm install
```

---

## ⚙️ Configurar entorno

Editar el archivo `src/enviroments/environment.ts`:

```ts
export const environment = {
  apiBaseUrl: 'http://localhost:8080/api',
  apiWebSocket: 'http://localhost:8080/ws-alertas'
};
```

---

## 🚧 Correr en local

```bash
ng serve
```

Accede en: [http://localhost:4200](http://localhost:4200)

---

## 🔑 Acceso de prueba

```
Usuario: migueladmin
Contraseña: 1234
Rol: ADMIN
```

---

## 🔄 Producción

Para construir la aplicación lista para despliegue:

```bash
ng build --configuration production
```

El contenido estático se genera en la carpeta `dist/`.

---

## 🚫 Problemas comunes

### Tailwind no aplica estilos:

- Asegúrate de tener importado en `styles.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Verifica que `tailwind.config.js` incluye:

```js
content: [
  './src/**/*.{html,ts}'
]
```

---

## 🚀 Extras

- Soporte offline: la app cachea datos de sensores y ubicaciones en `localStorage`.
- WebSocket para datos en tiempo real.
- Modal para ver historial de sensores.
- Iconos personalizados (carros) con Leaflet.

---

## ✨ Pruebas opcionales

```bash
ng test
```

---

## ✅ Estructura recomendada

```
/src
  /app
    /core
      /services
      /models
    /components
  /assets
    /icons
  environment.ts
```


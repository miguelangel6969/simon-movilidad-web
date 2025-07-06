(window as any).global = window;

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {credentialsInterceptor} from './app/interceptors/credentials-interceptor';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(
      withInterceptors([credentialsInterceptor])
    ),
  ]
}).catch((err) => console.error(err));

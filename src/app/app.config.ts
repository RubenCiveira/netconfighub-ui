import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { provideConfiguration } from '@common/context/config/app-config.service';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideI18nConfiguration, I18nLoaderService } from '@common/context/config/i18n-loader.service';
import { provideInstrumentation } from '@common/context/observability/instrumentation.service';
import { provideAuthorizationAccess } from '@common/context/authorization-access/authorization-access.provider';
import { provideConfiguredRoutes } from './bootstrap/app.routes';
import { AppwriteModule } from '@common/appwrite/appwrite.module';

export const appConfig: ApplicationConfig = {
  providers: [
    provideConfiguration(),
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([]),
    provideAuthorizationAccess(),
    provideConfiguredRoutes(),
    provideHttpClient(),
    provideInstrumentation(),
    provideTransloco({
      config: {
        availableLangs: ['en', 'es'],
        defaultLang: 'en',
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: false,
      },
      loader: I18nLoaderService,
    }),
    provideI18nConfiguration(),
    importProvidersFrom(AppwriteModule),
  ],
};

import { InjectionToken, NgModule } from '@angular/core';
import { IDENTITY_PROVIDER } from '@common/context/identity/identity-provider.interface';
import { STATIC_CONF } from '@common/context/config/app-config.service';
import { AppwriteClientService } from './appwrite-client-service';
import { AppwriteIdentityProvider } from './identity/appwrite-identity-provider.service';
import { AppwriteDataBuilder } from './data/appwrite-data-builder.service';

export const APPWRITE_CONFIG = new InjectionToken<any>('APPWRITE_CONFIG');

@NgModule({
  providers: [
    AppwriteDataBuilder,
    {
      provide: AppwriteClientService,
      deps: [APPWRITE_CONFIG],
    },
    {
      provide: IDENTITY_PROVIDER,
      useClass: AppwriteIdentityProvider,
      multi: true,
      deps: [],
    },
    {
      provide: APPWRITE_CONFIG,
      deps: [STATIC_CONF],
      useFactory: (conf: any) => conf.appwrite,
    },
  ],
})
export class AppwriteModule {}

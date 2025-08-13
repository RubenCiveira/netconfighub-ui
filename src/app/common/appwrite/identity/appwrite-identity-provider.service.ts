import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, ReplaySubject } from 'rxjs';

import { AppwriteLoginDialogComponent, LoginResult } from './appwrite-login-dialog.component';
import { AppStateService } from '@common/context/state/app-state.service';
import { IdentityHandler, IdentityProvider } from '@common/context/identity/identity-provider.interface';
import { AppwriteClientService } from '../appwrite-client-service';
import { Models, OAuthProvider } from 'appwrite';

export class AppwriteIdentityProvider implements IdentityProvider {
  constructor() {}

  accept(type: string, name: string): IdentityHandler | null {
    if (type === 'appwrite') {
      const result = new AppwriteIdentityHandlerService(name);
      return result;
    } else {
      return null;
    }
  }
}

export class AppwriteIdentityHandlerService implements IdentityHandler {
  private auth = inject(AppwriteClientService);
  private dialog = inject(MatDialog);
  private appState = inject(AppStateService);
  private boostrapSubject = new ReplaySubject<void>();
  private readonly providers = ['email', 'google', 'github'];

  constructor(private readonly name: string) {
    this.auth.account
      .get()
      .then((user) => {
        this.setUser(user);
      })
      .catch((fail) => {
        this.setUser(null);
      });
  }

  bootstrap(): Observable<void> {
    return this.boostrapSubject;
  }

  login(): void {
    this.dialog
      .open(AppwriteLoginDialogComponent, {
        data: this.providers,
        width: '400px',
      })
      .afterClosed()
      .subscribe(async (result: LoginResult | null) => {
        if (!result) return;
        try {
          if (result.provider === 'google') {
            this.auth.account.createOAuth2Session(
              OAuthProvider.Google,
              document.location.toString(),
              'http://localhost:4200/error',
            );
          } else if (result.provider === 'github') {
            this.auth.account.createOAuth2Session(
              OAuthProvider.Github,
              document.location.toString(),
              'http://localhost:4200/error',
            );
          } else if (result.provider === 'email') {
            const email = result.email!;
            const pass = result.password!;
            if (email && pass) {
              this.auth.account.createEmailPasswordSession(email, pass);
            } else {
              alert('No data provided');
            }
          } else if (result.provider === 'register') {
            const email = result.email!;
            const pass = result.password!;
            if (email && pass) {
              this.auth.account.create('unique()', email, pass, email);
            } else {
              alert('No data provided');
            }
          } else if (result.provider === 'reset') {
            const email = result.email!;
            if (email) {
              this.auth.account.createRecovery(email, document.location.toString());
            }
          }
        } catch (error) {
          console.error('Error al iniciar sesión con Firebase:', error);
          this.appState.userInfo[this.name].set({});
        }
      });
  }

  logout(): void {
    this.auth.account.deleteSessions();
  }

  private async setUser(user: Models.User<any> | null) {
    if (user) {
      const token = '';
      const userInfo = {
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        authenticated: true,
        token,
        roles: ['ADMIN'], // Puedes cargar roles desde Firestore si los usas
      };
      this.appState.userInfo[this.name].set(userInfo);
    } else {
      this.appState.userInfo[this.name].set({});
    }
    this.boostrapSubject.next();
  }
}

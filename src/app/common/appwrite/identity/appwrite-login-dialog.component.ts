import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

export interface LoginResult {
  provider: string;
  email?: string;
  password?: string;
}

@Component({
  selector: 'app-appwrite-login-dialog',
  template: `
    <div class="login-dialog-container">
      <h1 mat-dialog-title>
        <ng-container *ngIf="layer == 'email'">Iniciar sesión</ng-container>
        <ng-container *ngIf="layer == 'register'">Register</ng-container>
        <ng-container *ngIf="layer == 'reset'">Password olvidada</ng-container>
      </h1>

      <div mat-dialog-content class="login-container">
        <!-- Email login form -->
        <ng-container *ngIf="canUseEmail() && layer == 'email'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email" placeholder="ejemplo@correo.com" />
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput [(ngModel)]="password" type="password" />
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          <div class="pre-button link" (click)="showReset()">Forgot password?</div>
          <div class="button-row">
            <button mat-raised-button class="main-button" (click)="login('email')">Iniciar sesión</button>
          </div>
          <div class="post-button">Dont have an account: <span class="link" (click)="showRegister()">Sigup</span></div>
        </ng-container>

        <ng-container *ngIf="canUseEmail() && layer == 'register'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email" placeholder="ejemplo@correo.com" />
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Contraseña</mat-label>
            <input matInput [(ngModel)]="password" type="password" />
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Repetir contraseña</mat-label>
            <input matInput [(ngModel)]="confirmPassword" type="password" />
            <mat-icon matSuffix>lock</mat-icon>
          </mat-form-field>

          <div class="pre-button link" (click)="showLogin()">Back email</div>

          <div class="button-row">
            <button mat-raised-button class="main-button" (click)="login('register')">Iniciar sesión</button>
          </div>
        </ng-container>

        <ng-container *ngIf="canUseEmail() && layer == 'reset'">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput [(ngModel)]="email" type="email" placeholder="ejemplo@correo.com" />
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <div class="pre-button link" (click)="showLogin()">Back email</div>

          <div class="button-row">
            <button mat-raised-button class="main-button" (click)="login('recover')">Recuperar sesión</button>
          </div>
        </ng-container>

        <!-- Provider selection -->
        <div class="provider-list">
          <ng-container *ngFor="let providerId of availableProviders">
            <div *ngIf="providerId !== 'email'">
              <button mat-raised-button (click)="login(providerId)">
                <mat-icon>{{ getProviderIcon(providerId) }}</mat-icon>
                {{ getProviderName(providerId) }}
              </button>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        flex-direction: column;
      }
      .button-row {
        width: 100%;
      }
      .pre-button {
        text-align: left;
      }
      .post-button {
        text-align: right;
      }
      .link {
        cursor: pointer;
        color: blue;
      }
      .main-button {
        background-color: #000077;
        color: white;
      }
      .button-row button {
        width: 100%;
        margin: 15px 0;
      }
      .provider-list button {
        width: 100%;
        margin: 10px 0;
      }
    `,
  ],
  standalone: true,
  imports: [
    MatDialogModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatDividerModule,
  ],
})
export class AppwriteLoginDialogComponent {
  layer = 'email';
  email = '';
  password = '';
  confirmPassword = '';

  availableProviders: string[] = ['email', 'google', 'github'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { providers: string[] },
    private dialogRef: MatDialogRef<AppwriteLoginDialogComponent>,
  ) {
    // this.availableProviders = data.providers;
    this.availableProviders = ['email', 'google', 'github'];
  }

  showLogin() {
    this.layer = 'email';
    return false;
  }

  showRegister() {
    this.layer = 'register';
    return false;
  }

  showReset() {
    this.layer = 'reset';
    return false;
  }

  login(provider: string) {
    const result: LoginResult = { provider };

    if (provider === 'email') {
      result.email = this.email;
      result.password = this.password;
    }

    this.dialogRef.close(result);
  }

  register() {
    this.dialogRef.close({ provider: 'register' });
  }

  canUseEmail() {
    return true;
  }

  canRegister() {
    return true;
  }

  getProviderIcon(providerId: string): string {
    switch (providerId) {
      case 'google':
        return 'g_translate';
      case 'github':
        return 'code';
      case 'facebook':
        return 'facebook';
      case 'twitter':
        return 'flutter_dash';
      case 'email':
        return 'email';
      default:
        return 'login';
    }
  }

  getProviderName(providerId: string): string {
    switch (providerId) {
      case 'google':
        return 'Google';
      case 'github':
        return 'GitHub';
      case 'facebook':
        return 'Facebook';
      case 'twitter':
        return 'Twitter';
      case 'email':
        return 'Email y contraseña';
      default:
        return providerId;
    }
  }
}

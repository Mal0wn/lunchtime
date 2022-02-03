import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component'; //Composant de connexion
import { ResetPasswordComponent } from './reset-password/reset-password.component'; //Composant de réinitialisation de mot de passe
import { CreateAccountComponent } from './create-account/create-account.component'; //Composant de création de compte
import { ReactiveFormsModule } from '@angular/forms'; //Pour les formualires réacifs

@NgModule({
  declarations: [
    LoginComponent,
    ResetPasswordComponent,
    CreateAccountComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule //Pour les formualires réacifs
  ],
  exports: [
    LoginComponent,
    ResetPasswordComponent,
    CreateAccountComponent
  ]
})
export class LoginModule { }

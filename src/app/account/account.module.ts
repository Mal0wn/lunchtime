import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAccountComponent } from './user-account/user-account.component';
import { ChangeInformationsComponent } from './change-informations/change-informations.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user/user.component';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SearchComponent } from './users/search/search.component';


@NgModule({
  declarations: [
    UserAccountComponent, //Compte de l'utilisateur
    ChangeInformationsComponent, //Changement d'informations de l'utilisateur
    UsersComponent, //Liste des utilisateurs
    UserComponent, //Détails d'un utilisateurs
    SearchComponent //Recherche dans la liste des utilisateurs
  ],
  imports: [
    CommonModule,
    FormsModule, //Pour les formualires réacifs
    ReactiveFormsModule, //Pour les formualires réacifs
    AppRoutingModule, //Pour les redirections
    SharedModule

  ],
  exports: [
    UsersComponent, //Liste des utilisateurs
    UserComponent //Detail d'un utilisateur
  ]
})
export class AccountModule { }

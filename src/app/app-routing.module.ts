import { HomepageComponent } from './homepage/homepage.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAccountComponent } from './login/create-account/create-account.component';
import { LoginComponent } from './login/login/login.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { Page404Component } from './page404/page404.component';
import { UserAccountComponent } from './account/user-account/user-account.component';
import { ChangeInformationsComponent } from './account/change-informations/change-informations.component';
import { UserlistOrdersComponent } from './userlist-orders/userlist-orders.component';
import { OrderComponent } from './order/order/order.component';
import { BucketComponent } from './bucket/bucket/bucket.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';
import { HomepageLunchLadyComponent } from './homepage-lunch-lady/homepage-lunch-lady.component';
import { UserComponent } from './account/user/user.component';
import { UsersComponent } from './account/users/users.component';
import { ModifyMealComponent } from './meal/modify-meal/modify-meal.component';
import { AddMealComponent } from './meal/add-meal/add-meal.component';
import { CurrentOrderComponent } from './order/current-order/current-order.component';

const routes: Routes = [
  {path: '', component: HomepageComponent}, //Route par défaut
  {path: 'homepage', component: HomepageComponent}, //Route d'accueil des utilisateurs
  {path: 'lunchHomepage', component: HomepageLunchLadyComponent}, //Route d'accueil de la lunchelady (lunch)

  {path: 'login', component: LoginComponent}, //Route de connexion
  {path: 'resetPassword', component: ResetPasswordComponent}, //Route de reinitialisation de password
  {path: 'createAccount', component: CreateAccountComponent}, //Route de création d'un compte
  {path: 'users', component: UsersComponent}, //Route listes des utilisateurs (lunch)
  {path: 'user/:userId', component: UserComponent}, //Route détail d'un utilisateur (lunch)
  {path: 'myAccount', component: UserAccountComponent}, //Route vers details du Cmpte connecté
  {path: 'changeInformations', component: ChangeInformationsComponent}, //Route vers changement de mes informations

  {path: 'order/:userId', component: OrderComponent}, //Route vers mes commandes
  {path: 'orderDetails/:orderId/:userId', component: OrderDetailsComponent}, //Route vers detail d'une de mes commandes
  {path: 'currentOrder/:userId', component: CurrentOrderComponent}, //Route vers liste des commandes en cours d'un utilisateur (lunch)

  {path: 'modifyMeal/:mealId', component: ModifyMealComponent}, //Route vers modification d'un element de la carte (lunch)
  {path: 'addMeal/:idCategory', component: AddMealComponent}, //Route vers ajout d'un element à la carte (lunch)

  {path: 'bucket', component: BucketComponent}, //Route vers mon Panier
  {path: "orderlist", component: UserlistOrdersComponent}, //Route vers le recapitulatif des commandes (lunch)
  {path: '**', component: Page404Component} //Route en cas d'URL non reconnue 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; //Pour les requetes d'API
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule, MatCommonModule } from '@angular/material/core';
import { ReactiveFormsModule ,FormsModule} from '@angular/forms'; //Gestion des Formulaires Réactifs
import { RouterModule } from '@angular/router'; //Gestion des Redirections
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { registerLocaleData } from '@angular/common'; //Gestion des dates Françaises
import localeFr from '@angular/common/locales/fr'; //Gestion des dates Françaises
registerLocaleData(localeFr, 'fr'); //Gestion des dates Françaises

//Nos Composants
import { AppComponent } from './app.component';
import { WeekPickerComponent } from './shared/week-picker/week-picker.component';
import { OrderUserSearchComponent } from './userlist-orders/search/order-user-search/order-user-search.component';
import { UserlistOrdersComponent } from './userlist-orders/userlist-orders.component';
import { OrderItemComponent } from './userlist-orders/user-item/order-item.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HomepageLunchLadyComponent } from './homepage-lunch-lady/homepage-lunch-lady.component';
import { Page404Component } from './page404/page404.component'; //Page de rédirection d'URL inconnue

//Nos Modules
import { OrderModule } from './order/order.module';
import { BucketModule } from './bucket/bucket.module';
import { ToastrModule } from 'ngx-toastr';
import { MealModule } from './meal/meal.module';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './login/login.module'; //Importation pour utilisation du module de login (login, resetPassword, creatAccount)
import { AccountModule } from './account/account.module';
import { NavbarModule } from './navbar/navbar.module';
import { AppRoutingModule } from './app-routing.module'; //Déclaration des routes

//Nos Services
import { UserService } from './service/user.service';
import { DateService } from './service/date.service';

@NgModule({
  declarations: [
    AppComponent,
    Page404Component,
    HomepageComponent,
    UserlistOrdersComponent,
    OrderItemComponent,
    WeekPickerComponent,
    HomepageLunchLadyComponent,
    OrderUserSearchComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    LoginModule,
    AccountModule,
    HttpClientModule,
    NavbarModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    OrderModule,
    BucketModule,
    ToastrModule.forRoot(),
    MealModule,
    SharedModule,
  ],
  providers: [
    UserService,
    NavbarModule,
    MatCommonModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatToolbarModule,
    MatMenuTrigger,
    DateService,
    AccountModule
  ],
  exports: [
    RouterModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

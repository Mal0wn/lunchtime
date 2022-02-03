import { UserService } from '../service/user.service';
import { User } from './../shared/user.interface';
import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {

public user!: User;
checkToken : any  = '';
checkTokenDecode : any = '';
public result: any  ;
public isConnect : Boolean = false ;
public isLunchLady : Boolean = false;
userId:any = "" ;
today: number = Date.now();

//---------------------------- Constructeur --------------------------------
  constructor(private userService:UserService, private router: Router) {}
//---------------------------- QUI EST CONNECTÉ --------------------------------
  whoIsConnect(){
  //Récuperation de l'authentification de la personne en cours
  this.result = this.userService.onVerifAuthentification() ;

  //Selon le resultat on assigne a isConnect et isLunchLady leur valeur
  switch (this.result) {
    case 0:
      this.isConnect = false ;
      this.isLunchLady = false;
      break;
    case 1:
      this.isConnect = true;
      this.isLunchLady = false;
      break;
    case 2:
      this.isConnect = true ;
      this.isLunchLady = true;
      break;
  }

  //Redirection en cas de lunchlady
  if(this.isConnect && this.isLunchLady){
    this.router.navigate(["lunchHomepage"]);
  }

  //Récuperation des informations de l'utilisateur avec l'item user en local storage
  let objetUserInfoLocal:any = localStorage.getItem('user') ;

  //Si l'objet local n'est pas null alors on recupere son coutenu
  if(objetUserInfoLocal != null){
    objetUserInfoLocal = JSON.parse(objetUserInfoLocal) ;
    this.userId = objetUserInfoLocal.id ;
  }
  }
//---------------------------- ON INIT --------------------------------
  ngOnInit(): void {
    this.whoIsConnect();
  }
//---------------------------- NAV SIDE --------------------------------
  navSide() {
    let x = document.getElementById("myLinks") as HTMLElement;
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }
//---------------------------- ON LOG --------------------------------
  onLog(){
    this.router.navigate(["login"]);
  }
//---------------------------- ON DECONNEXION --------------------------------
  onDeconnexion(){
    //Supression de l'item user, du jwt et du bucket enregistrés en local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('bucket');
    this.router.navigate(['homepage']);
    //Rafraichissement de la connexion
    this.whoIsConnect() ;
    //Rafraichissement de la nav side
    this.navSide();
  }
//---------------------------- Refraiche de la page --------------------------------
  refresh(){
    location.reload();
  }
}





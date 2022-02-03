import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/service/menu.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { UserService } from 'src/app/service/user.service';
import { User } from 'src/app/shared/user.interface';
import { OrderService } from 'src/app/service/order.service';
import { ConstraintService } from 'src/app/service/constraint.service';

@Component({
  selector: 'app-bucket',
  templateUrl: './bucket.component.html',
  styleUrls: ['./bucket.component.css']
})
export class BucketComponent implements OnInit {

  date: any = new Date;
  price: number = 0;
  msgError: string = "";
  buckets: any = [];
  isAuth: boolean = false;
  userCanPay: boolean = false;
  bucketIsEmpty: boolean = true;
  wallet: number = 0;
  tooLate: boolean = false;
  timeLimit: string = "";

  //-------------------- CONSTRUCTEUR ----------------------------------------------
  constructor(private router: Router, private menuService: MenuService, private toastr: ToastrService, private datePipe: DatePipe, private userService: UserService, private orderService: OrderService, private constraintService: ConstraintService) {
    this.date = this.datePipe.transform(this.date, 'dd/MM/yyyy');
  }

  //-------------------- ON INIT ----------------------------------------------
  ngOnInit(): void {
    //CHARGEMENT DU PANIER
    this.onChargeBucket();
    //CALCUL DES CREDITS UTILISÉS
    this.calculerCreditUtilise();

    let isAuth = this.userService.onVerifAuthentification();

    if (isAuth == 0) {
      this.isAuth = false;
    } else {
      this.isAuth = true;
    }
    this.onChargeBucket();
  }
  async getTimeLimit(){
  let tmp = new Date();
  try{
    let cons: any = await this.constraintService.getConstraint(1);
    this.timeLimit = cons.orderTimeLimit;
    let tmpMinutes = parseInt(cons.orderTimeLimit.substring(3, 5));
    let tmpHours = parseInt(cons.orderTimeLimit.substring(0, 2));
    if(tmpMinutes > tmp.getHours() || (tmpMinutes > tmp.getMinutes() && tmpMinutes == tmp.getHours())){
      this.tooLate = false;
    }
  }catch{

  }

  }
  //-------------------- CHARGEMENT DU PANIER ----------------------------------------------
  onChargeBucket() {
    this.getTimeLimit();
    //RECUPERATION DU PANIER ENREGISTRÉ EN LOCAL STORAGE
    let bucketLocalStorage: any = (localStorage.getItem('bucket'));
    this.buckets = JSON.parse(bucketLocalStorage);
    if (this.isAuth) {
      let tmpString: any = localStorage.getItem('user');
      let tmpUser = JSON.parse(tmpString);
      this.wallet = tmpUser.wallet;
    }
    let tmp = new Date();
    this.calculerCreditUtilise();
    if(tmp.getHours() > 10 || (tmp.getMinutes() > 30 && tmp.getHours() == 10)){
      this.tooLate = true;
    }else{ this.tooLate = false;}
  }

  //-------------------- AUGMENTATION QUANTITE ----------------------------------------------
  onUpQuantite(item: any) {
    //POUR CHAQUE ELEMENT DU PANIER, SI L'ID DE L'ITEM DEMANDÉ ET L'ID DE L'ELEMENT ALORS AUGMENTATION DE LA QUANTITÉ
    this.buckets.forEach((element: any) => {
      if (element[1].id == item[1].id) {
        element[0].quantite = element[0].quantite + 1;
      }
    });
    //RECLACULER LES CRÉDITS UTILISÉS
    this.calculerCreditUtilise();
  }

  //-------------------- REDUCTION QUANTITE ----------------------------------------------
  onDownQuantite(item: any) {
    //POUR CHAQUE ELEMENT DU PANIER, SI L'ID DE L'ITEM DEMANDÉ ET L'ID DE L'ELEMENT ALORS DIMINUTION DE LA QUANTITÉ
    this.buckets.forEach((element: any) => {
      if (element[1].id == item[1].id) {
        if (element[0].quantite > 1) {
          element[0].quantite = element[0].quantite - 1;
        }
      }
    });
    //RECALCULER LES CRÉDITS UTILISÉS
    this.calculerCreditUtilise();
  }

  //-------------------- SUPPRESSION D'UN ITEM DU PANIER ----------------------------------------------
  onDeletePartOrder(item: any) {
    let count = 0;

    this.buckets.forEach((element: any) => {
      if (element[1].id == item[1].id) {
        this.buckets.splice(count, 1);
        localStorage.removeItem('bucket');
        let bucket = JSON.stringify(this.buckets);
        localStorage.setItem('bucket', bucket);
      }
      count = count + 1;
    });

    //RECALCUL DES CRÉDITS UTILISÉS
    this.calculerCreditUtilise();
  }

  //-------------------- SUPRESSION DU PANIER ----------------------------------------------
  onDeleteBucket() {
    this.showGoodToaster("Suppression du Panier effectuée avec succes Capitaine ^^");
    //SUPPRESSION DE L'OBEJT LOCAL "PANIER"
    localStorage.removeItem('bucket');
    this.onChargeBucket();
  }

  //-------------------- CALCUL CREDIT PANIER ----------------------------------------------
  calculerCreditUtilise() {

    this.price = 0;

    if (this.buckets != null) {
      ////POUR CHAQUE ELEMENT DU PANIER, CREDIT UTILISÉ = CRÉDIT UTILISÉ + LE PRIX LE L'ELEMENT * LA QUANTITÉ COMMANDÉE
      this.buckets.forEach((element: any) => {
        var quantite: number = element[0].quantite;
        this.price = this.price + (element[1].priceDF * quantite);
      });
      this.bucketIsEmpty = false;
    } else {
      this.bucketIsEmpty = true;
      this.showCleverToaster("Votre Panier est vide ! Remplissez-le vite :D");
    }

    if (this.isAuth) {
      let userInfo: any = localStorage.getItem('user');
      userInfo = JSON.parse(userInfo);
      this.wallet = userInfo.wallet;

      if (this.price > this.wallet) {
        this.showBadToaster("Vous avez " + this.wallet + " crédits, vider un peu votre panier ou remplissez votre compte auprès de la dame de cantine");
        this.userCanPay = false;
      } else if (this.price < this.wallet) {
        this.userCanPay = true;
      } else {
        this.userCanPay = false;
      }
    }

  }

  //-------------------- REDIRECTION VERS LE MENU ----------------------------------------------
  onGoToMenu() {
    //REDIRECTION
    this.router.navigate(['homepage']);
  }

  //-------------------- FONCTIONS DES TOASTER ----------------------------------------------
  showGoodToaster(message: string) {
    this.toastr.success(message);
  }

  showBadToaster(message: string) {
    this.toastr.error(message);
  }

  showCleverToaster(message: string) {
    this.toastr.info(message);
  }

  onLogin() {
    this.router.navigate(['login']);
  }

  //-------------------- VALIDATIATION PANIER ----------------------------------------------
  async onValideBucket() {
    console.log("i try");
    //Récuperation du bucket
    //Inserer local storage bucket
    //Recuperation de l'heure
    //Recuperation des constriants de la lunchlady pour l'heure max de commande et le nombre max de plats
    //Vérification que la commande depasse pas les credits, est dans les horaires de commandes, plats disponibles
    //si tout est ok :
    //requete async await d'enregistrement de la commande
    //try 

    let bucketLocalStorage: any = (localStorage.getItem('bucket'));
    let bucket: any = JSON.parse(bucketLocalStorage);
    let tmpString: any = localStorage.getItem('user');
    let tmpUser = JSON.parse(tmpString);
    //console.log( bucket);
    let order = {
      userId: tmpUser.id,
      constraintId: -1,
      quantity: []
    };
    let quant: any = [];
    await bucket.forEach(async (item: any) => {
      let tmpQuant = {
        quantity: item[0].quantite,
        mealId: item[1].id,
      }
      quant.push(tmpQuant);
    });
    order.quantity = quant;
    try {
      await this.orderService.addOrder(JSON.stringify(order));
    } catch (error: any) {
      if (error['status'] == 401) {
        this.showBadToaster("Mais Chef ! T'es plus connecté :( ... Reviens :D ! ");
      } else {
        this.showBadToaster('Chef, chef ! On a un problème :( ' + error['status'] + ' ' + error.error['exceptionMessage']);
      }
    }
    localStorage.removeItem('bucket');
    this.onChargeBucket();
this.showGoodToaster("La commande est passée ! Vous allez vous régaler !");

  }


}

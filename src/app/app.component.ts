import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { NotificationService } from './features/Profile/services/notification.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './features/Authentication/services/auth.service';
import { UserStoreService } from './features/Authentication/services/user-store.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnChanges{
  title = 'BloodWebsite';
  currentRoute:string =" ";
  center: google.maps.LatLngLiteral | undefined;
  receivedNotifications: string[]=[];
  someKey:string='0f133edd-388b-4866-8eab-3e1e2fb78e61'
  show!:boolean;
  receiveId!: string
  requstId!: number
  orderId!: number
  public userId : string = ""
  x:any[]=[];
  constructor( private authService:AuthService,private userService:UserStoreService,private router: Router,private location :Location,private toast: NgToastService,private notificationService: NotificationService) 
  {  
    this.sent();
    this.getUserId()
   }
  ngOnChanges(): void {

  }
  
  ngOnInit() {
    this.getUserId()
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
    this.currentRoute= this.router.url;
    console.log("Url", this.currentRoute)
    
    this.notificationService.startConnection(this.userId); 

    this.notificationService.signalRListener("ReceiveNotification", (...Input: any[]) => {
      console.log("Received data:", Input);
      // this.notificationService.notify(Input[1]);
      this.notificationService.setMessageNotifiToUser(Input[1]);
      this.notificationService.setReceiveIdNotifi(Input[0]);
      this.notificationService.setShowForm(Input[2])
      this.notificationService.setRequstIdValue(Input[3])
    });


    this.notificationService.signalRListener("SendToAllUsers", (...Input: any[]) => {
      console.log("Received data:", Input);
      this.notificationService.notify(Input);
    });


    this.notificationService.getShowForm().subscribe( res => {
      this.show = res
      console.log("Show",this.show)
    })
    this.notificationService.getReceiveIdNotifi().subscribe( res => {
      this.receiveId = res
      console.log("receiveId in app Componant:",this.receiveId)
    });
    this.notificationService.getRequstIdValue().subscribe( res => {
      this.requstId = res
      console.log("requstId in app Componant:",this.requstId)
    });
        

    this.notificationService.getMessageNotifiToUser().subscribe( res => {
      this.toast.info({ detail: '', summary: res, duration: 20000 });
    });

    this.notificationService.onNotification()
    .subscribe(notifications => {
      this.receivedNotifications = notifications;
      let i =0;
      for (const notification of notifications) {
        this.x[i]=notification
        this.toast.info({ detail: '', summary: notification, duration: 20000 });
        i++;
      }
    });
    this.sent()
  }


  goBack() {
    this.location.back();
  }

  sent(){

  }

  handleValue(value:number){
    this.notificationService.setQuantityValue(value);
    console.log("Quantity In appconmponant",value)
    console.log(this.receiveId)
  }

  getUserId(){
    this.userService.getUserIdFromStore()
    .subscribe(val=>{
      const userIdFromToken = this.authService.getUserIdFromToken();
      this.userId = val || userIdFromToken
    });
  }

  ngOnDestroy(): void {
    this.notificationService.onDisconnected(() => {
      console.log('SignalR connection disconnected');
    });
  }


  // this.notifications

}

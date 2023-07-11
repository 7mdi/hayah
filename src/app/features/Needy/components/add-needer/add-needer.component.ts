import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { CoreService } from 'src/app/core/services/core.service';
import { AuthService } from 'src/app/features/Authentication/services/auth.service';
import { UserStoreService } from 'src/app/features/Authentication/services/user-store.service';
import { NeedyService } from '../../services/needy.service';
import { NeedRequest } from '../../_models/needy-request';
import { NotificationService } from 'src/app/features/Profile/services/notification.service';
declare var window:any;

@Component({
  selector: 'app-add-needer',
  templateUrl: './add-needer.component.html',
  styleUrls: ['./add-needer.component.scss']
})
export class AddNeederComponent implements OnInit{
  requestId:number =0 
  counter:number = 1
  receiveId: string = ''
  quantity!:number;
  location_lat: any;
  location_lng: any;
  formModel:any;
  sections:any[]=[];
  result!:any;
  center: google.maps.LatLngLiteral | undefined;
  public neederForm!: FormGroup;
  bloodTypeList:any[];
  public userId : string = ""
  newOrder:NeedRequest= {} as NeedRequest;
  file!:File;
  show:boolean = false
  constructor(private notificationService: NotificationService,private location:Location, private authService:AuthService,private needyService:NeedyService,private userService:UserStoreService,private coreService:CoreService,private fdonar: FormBuilder, private toast: NgToastService,private router: Router) {
    this.bloodTypeList =
      [
        { id: 1, name: '- A', val: 'A-'   },
        { id: 2, name: '+ A', val: 'AP'   },
        { id: 3, name: '- B', val: 'B-'   },
        { id: 4, name: '+ B', val: 'BP'   },
        { id: 5, name: '- AB', val: 'AB-' },
        { id: 6, name: '+ AB', val: 'ABP' },
        { id: 7, name: '- O', val: 'O-'   },
        { id: 8, name: '+ O', val: 'OP'   }     
     ]; 

   }

   ngOnInit(): void { 
    this.getAllSections()
    this.getUserId()
    this.notificationService.startConnection(this.userId); 
    this.newOrder.applicationUserId=this.userId;
    console.log(this.userId)
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this.location_lat = this.center.lat
      this.location_lng = this.center.lng
      // this.location_lat = this.center.lat.toString()
      // this.location_lng = this.center.lng.toString()
    });
    this.formModel = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
    this.formModel.show();
    
    // this.notificationService.getLongituValue().subscribe( res => {
    //   console.log("Long in Add Needy :", res)
    // });

    // this.needyService.getReceiveId().subscribe( id => {
    //   console.log("this.receiveId 1",id)
    //   this.receiveId = id
    // }); 

    // this.notificationService.getQuantityValue().subscribe( (quantity) => {
    //   this.quantity = quantity
    //   console.log("Quantity is :", this.quantity)
    //   this.orderId = 107
    //   console.log("OrderId is :", this.orderId)
    //   if(this.quantity != 0)
    //   {
    //     this.needyService.editNeedyRequestQuantity(this.orderId,quantity).subscribe();
    //     // this.getNearestDonorFromMachine()
    //   }else
    //   {
    //     // this.getNearestDonorFromMachine()
    //   }
    // },
    // (err:any) =>{
    //   alert('Error occured while fetching Quantity value')
    // });
  }


  onChange(event:any) {
    this.file = event.target.files[0];
}

  onSubmit(){
    this.newOrder.latitude = this.location_lat;
    this.newOrder.longitude = this.location_lng;
    // this.newOrder.hospitalReport = this.file;

    this.needyService.addRequest(this.newOrder).subscribe((res) => 
    {
      this.result = res.response ;
      this.formModel.hide();
      this.requestId = this.result.id;
      console.log("requstId 1 ",this.result)
      this.router.navigate(['/needers', this.newOrder.sectionId]);
      this.sendNotificationToAllUsers();
      this.getNearestDonorFromMachine(this.newOrder.longitude, this.newOrder.latitude, this.counter, this.newOrder.bloodType, this.newOrder.sectionId)
      this.toast.success({ detail: "SUCCESS", summary: "Added.", duration: 5000 });
    },(err => 
      {
        this.toast.error({ detail: "ERROR", summary: "You cannot add a need request while you have a donation request.!", duration: 5000 });
        alert()
        console.log(err.message) 
      }))

    console.log("Form",this.newOrder)
  }

  getUserId(){
    this.userService.getUserIdFromStore()
    .subscribe(val=>{
      const userIdFromToken = this.authService.getUserIdFromToken();
      this.userId = val || userIdFromToken
    });
  }

  getAllSections(){

    const observer = { 
      next: (res: any) => {
        this.sections=res.response;
        console.log("data",this.sections) 
        
      },
      error: (err: Error) => { 
        console.log(err.message) 
      }
    }

    this.coreService.getAllSections().subscribe(observer);
  }

  openModel(){
    this.formModel.show();
  }

  closeModel(){
    this.formModel.hide();
    // this.router.navigateByUrl('/home');
    this.location.back();
  }

  //will call this fun in notifi popup in close and submit with new current!!
  getNearestDonorFromMachine(longitude:number, latitude:number, current:number, bloodType:string, donatType:number){
  
    if(longitude != 0 && latitude !=0 && current !=0 && bloodType !=' ' && donatType !=0){

      const observer = {
        next: (res: any) => { 
          console.log("Machine",res)
          this.getNearestDonor(res.Latitude,res.Longitude,this.requestId)
        },
        error: (err: Error) => { console.log(err.message) }
      }
  
      this.needyService.post(longitude, latitude, current, bloodType, donatType).subscribe(observer)
  
    }
  
  }

  getNearestDonor(latitude: number, longitude: number ,requstId:number) {

    const observer = {
      next: (res: any) => { 
        console.log("data",res)
        this.receiveId=res.applicationUserId
        console.log("receiveId 55",res.applicationUserId)
        console.log("requstId",requstId)
        this.sendNotificationToUser(res.applicationUserId,requstId)
      },
      error: (err: Error) => { console.log(err.message) }
    }  
    this.needyService.GetNeersteDonar(longitude,latitude).subscribe(observer)

  }


  sendNotificationToAllUsers() {
    const message = 'Someone need blood.if you want to donate, call '+ this.newOrder.phone ;
    this.notificationService.sendNotificationToAllUsers(message);
  }

  sendNotificationToUser(id:string, requstId:number) {
    const show=true
    // console.log("id",id)
    const message = 'Someone needs blood!!!';
    this.notificationService.sendNotificationToUser(id,message,show,requstId);   
  }

  ngOnDestroy(): void {
    this.notificationService.onDisconnected(() => {
      console.log('SignalR connection disconnected');
    });
  }


}

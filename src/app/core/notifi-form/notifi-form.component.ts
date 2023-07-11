import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/features/Authentication/services/auth.service';
import { UserStoreService } from 'src/app/features/Authentication/services/user-store.service';
import { NeedyService } from 'src/app/features/Needy/services/needy.service';
import { NeedRequest } from 'src/app/features/Needy/_models/needy-request';
import { NotificationService } from 'src/app/features/Profile/services/notification.service';
declare var window:any;

@Component({
  selector: 'app-notifi-form',
  templateUrl: './notifi-form.component.html',
  styleUrls: ['./notifi-form.component.scss']
})
export class NotifiFormComponent implements OnInit {
  @ViewChild('quantityInput', { static: false }) quantityInput: ElementRef | undefined;
  @Input() show:boolean = false
  @Input() receiveId:string ='' 
  @Input() requstId!:number
  @Output() newQuantity = new EventEmitter<number>();
  newLongitude!:number;
  newLatitude!:number;
  newBloodType!:string;
  newSectionId!:number;
  newCounter:number = 1
  NeedyById:NeedRequest | undefined;
  userId:string =''
  formQuantity: FormGroup;
  orderId!:number;
  formModel:any;
  fullscreenImageStyles: any;
  fullscreenImageUrl!: string;
  constructor(private notificationService: NotificationService,private authService:AuthService,private userService:UserStoreService,private needyService:NeedyService) {
    this.formQuantity = new FormGroup({
      quantity: new FormControl('', [Validators.required, Validators.pattern('[1-2]{1,1}')])
    });
    this.getUserId()
    // this.startTimeout() 
  }

  ngOnInit(): void {
    this.formModel = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
  }

  // startTimeout() {
  //   setTimeout(() => {
  //     this.clocePopup()
  //     console.log('Timeout completed!');
  //   }, 2000);
  // }

  clocePopup(){
    this.show = false
    const quantityValue = 0
    console.log(quantityValue); 
    this.newQuantity.emit(quantityValue);
    this.getNeedyDataels()
  }

  closeOverLay(e:any){
    if(e.target.classList.contains('over-lay')){
      this.show= true
    }
  }

  submit() {
    const quantityValue = this.quantityInput!.nativeElement.value;
    console.log(quantityValue); 
    this.newQuantity.emit(quantityValue);
    this.needyService.editNeedyRequestQuantity(this.requstId,quantityValue).subscribe();
    this.getNeedyDataels()
   }

   getNeedyDataels(){
    const observer = { 
      next: (res: any) => {
        this.NeedyById=res.response;
        console.log("dataById",res) 
        this.newLongitude = this.NeedyById!.longitude
        this.newLatitude = this.NeedyById!.latitude
        this.newBloodType = this.NeedyById!.bloodType
        this.newSectionId = this.NeedyById!.sectionId
        this.newCounter= this.newCounter+1 
        console.log("Data2",this.newLongitude,this.newLatitude,this.newCounter,this.newBloodType,this.newSectionId,this.requstId)
        this.getNearestDonorFromMachine(this.newLongitude,this.newLatitude,this.newCounter,this.newBloodType,this.newSectionId)
      },
      error: (err: Error) => { 
        console.log(err.message) 
      }
    }

    this.needyService.getNeedyRequestById(this.requstId).subscribe(observer);
   }

  getUserId(){
    this.userService.getUserIdFromStore()
    .subscribe(val=>{
      const userIdFromToken = this.authService.getUserIdFromToken();
      this.userId = val || userIdFromToken
    });
  }

  test(){
    console.log("IsShow", this.show)
    console.log("UserId", this.userId)
    console.log("receiveId", this.receiveId)
    console.log("receiveId", this.requstId)
  }

  openModel(){
    this.formModel.show();
  }

  closeModel(){
    this.formModel.hide();
  }

  showFullScreenImage(image: any) {
    this.fullscreenImageUrl = image.src;
    this.fullscreenImageStyles = { display: 'block' };
  }

  closeFullScreenImage() {
    this.fullscreenImageStyles = { display: 'none' };
  }

  getNearestDonorFromMachine(longitude:number, latitude:number, current:number, bloodType:string, donatType:number){
    console.log("Data To Machin",longitude,latitude,current,bloodType,donatType)
    const observer = {
      next: (res: any) => { 
        console.log("Machine",res)
        this.getNearestDonor(res.Latitude,res.Longitude,this.requstId)
      },
      error: (err: Error) => { console.log(err.message) }
    }

    this.needyService.post(longitude, latitude, current, bloodType, donatType).subscribe(observer)

  }

  getNearestDonor(latitude: number, longitude: number ,requstId:number) {
    const observer = {
      next: (res: any) => { 
        console.log("data",res)
        this.receiveId=res.applicationUserId
        // console.log("receiveId 55",res.applicationUserId)
        this.sendNotificationToUser(res.applicationUserId,requstId)
      },
      error: (err: Error) => { console.log(err.message) }
    }  
    this.needyService.GetNeersteDonar(longitude,latitude).subscribe(observer)

  }

  sendNotificationToUser(id:string, requstId:number) {
    const show=true
    const message = 'Someone needs blood!!!';
    this.notificationService.sendNotificationToUser(id,message,show,requstId);   
  }

}










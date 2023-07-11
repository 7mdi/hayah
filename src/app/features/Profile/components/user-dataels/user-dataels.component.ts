import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/features/Authentication/helpers/validationform';
import { AuthService } from 'src/app/features/Authentication/services/auth.service';
import { UserStoreService } from 'src/app/features/Authentication/services/user-store.service';
import { ProfileService } from '../../services/profile.service';
import { UserPhoto } from '../../_models/userPhoto';
declare var window:any;

@Component({
  selector: 'app-user-dataels',
  templateUrl: './user-dataels.component.html',
  styleUrls: ['./user-dataels.component.scss']
})
export class UserDataelsComponent implements OnInit {
  formModel:any;
  public user: any;
  public userId : string="";
  public editUserForm!: FormGroup;
  public userName : string="";
  public email : string = "";
  public userPhotoForm!: FormGroup;
  file!:File;
  userPhoto:UserPhoto= {} as UserPhoto;
  constructor(private fb: FormBuilder,private profileService:ProfileService,private toast: NgToastService,private userService:UserStoreService,private authService:AuthService) { }

  ngOnInit(): void {
    this.getUserName();
    this.getEmail();
    this.getUserId();
    this.getUser();
    this.editUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [this.email, Validators.required],
      userName: ['', Validators.required],
    });
    this.formModel = new window.bootstrap.Modal(
      document.getElementById("exampleModal")
    );
  }

  onChange(event:any) {
    this.file = event.target.files[0];
}

  editUserInfo() {
    if (this.editUserForm.valid) {
      console.log(this.editUserForm.value);
      this.profileService.editUserInformation(this.editUserForm.value,this.userId).subscribe({
        next: (res) => {
          console.log(res.message);
          this.editUserForm.reset();
          this.toast.success({detail:"SUCCESS", summary:"Updated.", duration: 5000});
        },
        error: (err) => {
          this.toast.error({detail:"ERROR", summary:"Was not update!", duration: 5000});
          console.log(err?.error.message);
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.editUserForm);
    }

  }

  addPhoto(){
    this.userPhoto.file = this.file

    this.profileService.addPhotoToUser(this.userPhoto.file).subscribe({
      next: (res) => {
        console.log("Photo added.!")
        this.toast.success({ detail: "SUCCESS", summary: "Updated.", duration: 5000 });
      },
      error: (err) => {
        console.log(err.message) 
        this.toast.error({ detail: "ERROR", summary: "Was not update.", duration: 5000 });
      },
    });
  }

  getUserName(){
    this.userService.getUserNameFromStore()
    .subscribe(val=>{
      const userNameFromToken = this.authService.getUserNameFromToken();
      this.userName = val || userNameFromToken
    });
  }

  getUserId(){
    this.userService.getUserIdFromStore()
    .subscribe(val=>{
      const userIdFromToken = this.authService.getUserIdFromToken();
      this.userId = val || userIdFromToken
    });
  }

  getUser(){
    const observer = { 
      next: (res: any) => {
        this.user=res.response;
        console.log("user is ",this.user)
      },
      error: (err: Error) => { 
        console.log(err.message) 
      }
    }

    this.profileService.getUserInformation(this.userId).subscribe(observer);
  }

  getEmail(){
    this.userService.getEmailFromStore()
    .subscribe(val=>{
      const emailFromToken = this.authService.getEmailFromToken();
      this.email = val || emailFromToken
    });
  }
  
 openModel(){
  this.formModel.show();
}

closeModel(){
  this.formModel.hide();
}
}

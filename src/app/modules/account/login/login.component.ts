import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserDataService } from 'src/app/services/user-data.service';
import { COMMON_EMAIL, COMMON_VALIDATION, PATTERN_EMAIL, PATTERN_PASS } from 'src/app/validations/validations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private userData:UserDataService,private router:Router,private fb:FormBuilder,private http:HttpClient,private _snackbar:MatSnackBar) { }

  currentUser!:String;
  phoneNo!:Number;
  loginForm!:FormGroup;
  data:any;
  ngOnInit(): void {

    this.http.get("http://localhost:4000").subscribe((data:any)=>{
      this.data = data
      console.log("active users...",data);

     })

    this.loginForm = this.fb.group({
      email: ['', [PATTERN_EMAIL, COMMON_EMAIL, COMMON_VALIDATION]],
      password: [
        '',
        [COMMON_VALIDATION, PATTERN_PASS, Validators.minLength(6)],
      ],
      name: ['', Validators.required],
    });

  }
  token:any;
  userExist:any[]=[]
  login(username:any,phoneno:any){



    // this.http.post("http://localhost:3000/login",{name:username.value}).subscribe((data:any)=>{
    //   console.log("this is post request data....",data);

    // })

    console.log("comparision value.....",this.data[0]?.name,username.value);

    this.userExist = this.data.filter((item:any)=>{
      return item.name == username.value
    })



    // if(this.loginForm.controls.userName.value)
    console.log(username.value,phoneno.value);
    this.loginForm.controls['email'].patchValue(this.loginForm.controls['email'].value?.trim());
    this.userData.userList[0].name=username.value;
    this.userData.userList[0].phone=phoneno.value
    console.log(this.userData.userList  );
    if(this.userExist.length>0){
      this._snackbar.open("user already exist",'',{
              duration:2000,
              verticalPosition:'top',
              panelClass:['mat-toolbar', 'mat-warn']
            })
      console.log("this is blank router navigate......");

      this.router.navigate([''])
    }else{
      this.userData.loginFormInfo=this.loginForm

      this.router.navigate(['chat'])
      console.log("this is chat router navigate......");


    }

    this.token = phoneno.value

    localStorage.setItem('token',this.token)
    // this.userData.loginForm=this.loginForm
  }

  onSubmit(loginForm: any, userName: any, password: any) {
    // console.log(loginForm.value.email);
    // this.room.loggedUserDetails.name = userName.value;
    // this.room.loggedUserDetails.password = password.value;
    // let user_index = users_Data.findIndex((user) => user.email == loginForm.value.email);
    // this.room.friends = users_Data[user_index].user_chats;
    // this.service.getconnection()


    this.router.navigate(['/chat']);

  }



}

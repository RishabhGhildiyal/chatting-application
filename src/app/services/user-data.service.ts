import { Injectable } from '@angular/core';

interface userListData{
  socketID:any;
  name:String;
  phone:Number;
}

@Injectable({
  providedIn: 'root'
})

export class UserDataService {

  constructor() { }

  loginFormInfo:any
  userDetail:any
  userList= [
    {
      socketID:null    ,
      name:"",
      phone:null
    }
  ]
  setUserInfo(data?:any){
    this.userDetail={
      name: data.name,
      email: data.email,
    }
    console.log(this.userDetail);

  }
  get getUserInfo(){
    return this.userDetail;
  }
}

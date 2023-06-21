import { Injectable } from '@angular/core';
import { DbServiceService } from './db-service.service';
@Injectable({
  providedIn: 'root'
})
export class LoggedServiceService {

  constructor(private dbservice:DbServiceService) { }
  logged=false


  getLoggedStatus(){
    return this.logged
  }
  verifyLogIn(username:string,enteredPass:string){
    let userExist=false
    let userPass=""
    let passCorrect=false
    let toreTurn =new Promise((resolve,reject)=>{
      this.dbservice.getItem("users").then((data)=>{
        data.forEach((el:any) => {
          if(el.userName==username){
            userExist=true
            userPass=el.pass
            passCorrect=(userPass==enteredPass)
          }
        });
        if(passCorrect){this.logged=true}
        resolve({userExist:userExist,passCorrect:passCorrect})
      })
     
    })
    return toreTurn
    
  }
  
}

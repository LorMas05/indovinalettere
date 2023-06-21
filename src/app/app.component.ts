import { Component, Input, OnInit } from '@angular/core';
import { Video } from './model/video';
import { core } from '@angular/compiler';
import { DbServiceService } from './services/db-service.service';
import { LoggedServiceService } from './services/logged-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  autenticated=false
  autenticating=false
  textbeforeAuth=""
  dedicationDuration=1000
  songDocumentid:string=""
  dedication=""
  foundSong=false
  separathedFrase:string[]=[]
  globalUserName:string=""
  private apiLoaded = false;
  currentVideoId: string | undefined;
  playerConfig = {
    controls: 0,
    mute: 0,
    autoplay: 1
  };
  aiutiAttivi=false
  videoId: string | undefined;
  errorMessageForLogIn=""
  gotSongs=false
  videoList: Video[] = [
    {
      title: 'noVid',
      link: 'no video'
    }
  ];
  constructor( private dbservice:DbServiceService,private loggedService:LoggedServiceService) { }
  
  ngOnInit(): void {
    if(!this.apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
    // let objToCreate={
    //   first: "Ada",
    //   last: "Lovelace",
    //   born: 1815
    // }
    // this.dbservice.createItem("users",objToCreate)
 
  }

  selectVideo(video: Video) {
    const params = new URL(video.link).searchParams;
    let currentVid=params.get('v');
    if(currentVid){
      this.videoId=currentVid
    }
  }
  getLoggedStatus(){
    let toRetun=this.loggedService.getLoggedStatus()
    if(toRetun && !this.gotSongs){
      this.checkForSongs()
    }
    return toRetun
  }

  checkForSongs(){
    this.foundSong=false
    this.gotSongs=true
    this.dbservice.getItem("sentVideos").then((songs)=>{
     songs.forEach((song:any) => {
      console.log(song,this.globalUserName)
      if(song.to==this.globalUserName && !song.completed){
        this.foundSong=true
        this.textbeforeAuth=song.secretMessage
        this.separathedFrase=this.textbeforeAuth.split(" ")
        this.videoList[0].link=song.link
        this.videoList[0].title=song.dedication
        this.dedication=song.dedication
        this.dedicationDuration=song.duration*1000
        this.songDocumentid=song.documentId
      }
      
     });
     
    })
  }


  getLetters(word:string){
    return word.split('')
  }
  getIndexToAdd(i:number){
    if(i>0){
      let toRetun=this.separathedFrase[i].length
      return toRetun
    }else{
      return 1
    }
  }
  modifiedletter(position:number,event:any){
    let correctAnswer=this.textbeforeAuth.replace(/\s+/g, '');
    correctAnswer=correctAnswer.toLowerCase()
    let currentGuess=""
    for(let i=0;i<correctAnswer.length;i++){
      let currentLetter=<HTMLInputElement>document.getElementById((i+1).toString())
      if(currentLetter){
        if(currentLetter.value){
          currentGuess+=currentLetter.value.toString()
         if(this.aiutiAttivi){currentLetter.value.toLowerCase()==correctAnswer[i]?currentLetter.style.backgroundColor="rgb(44 215 30 / 94%)":currentLetter.style.backgroundColor="white"}
        }else{
          currentGuess+=" "
        }
      }
     
    }
    currentGuess=currentGuess.toLocaleLowerCase()
    if(currentGuess==correctAnswer){
       this.autenticated=true
       this.autenticating=true
       setTimeout(() => {
        this.selectVideo(this.videoList[this.getRandomInt(this.videoList.length-1)])
        this.startTimer(0)
       }, this.dedicationDuration);
    }
    if(position!=0 && position <18){
      console.log(event.data)
      let oldLetter=<HTMLInputElement>document.getElementById((position).toString())
      let toFocus=<HTMLInputElement>document.getElementById((position+1).toString())
      if(toFocus && oldLetter.value){
        toFocus.focus() 
      }
    }

  }

  startTimer(callNumber:number){
    this.dedication=(3-callNumber).toString()+"..."
    if(callNumber<3){
      setTimeout(() => {
        this.startTimer(callNumber+1)
      }, 1000);
    }else{
      setTimeout(() => {
        this.autenticating=false
      }, 700);
      
    }

  }
  checked(checked:boolean){
    this.aiutiAttivi=checked
    if(this.aiutiAttivi){
     this.modifiedletter(0,null) 
    }else{
      for(let i=0;i<18;i++){
        let currentLetter=<HTMLInputElement>document.getElementById((i+1).toString())
        if(currentLetter){
          currentLetter.style.backgroundColor="white"
        }
       
      }
    }
  }
  verifyAuth(userName:string,pass:string,userNameEl:any,passEl:any){
    if(userName && pass){
      this.globalUserName=userName
      console.log("verifyng")
      this.loggedService.verifyLogIn(userName,pass).then((data:any)=>{
        if(!data.userExist){this.errorMessageForLogIn="username errato!!"} 
        else if(!data.passCorrect){this.errorMessageForLogIn="password errata!!"} else{this.errorMessageForLogIn=""}

      })
    }else{
      userNameEl.value=""
      passEl.value=""
      console.log("enter Pass")
    }

  }
  checkVideoEnded(ev:any){
    if(ev.data===0){
      // this.selectVideo(this.videoList[this.getRandomInt(this.videoList.length-1)])
      console.log("finito")
      this.dbservice.setCompleted("sentVideos",this.songDocumentid)
    }
  }
   getRandomInt(max:number) {
    return Math.floor(Math.random() * max);
  }
}

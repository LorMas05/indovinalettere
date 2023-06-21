import { Component, Input, OnInit } from '@angular/core';
import { Video } from './model/video';
import { core } from '@angular/compiler';
import { DbServiceService } from './db-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  autenticated=false
  autenticating=false
  textbeforeAuth="TI AMO 3000"
  private apiLoaded = false;
  currentVideoId: string | undefined;
  playerConfig = {
    controls: 0,
    mute: 0,
    autoplay: 1
  };
  aiutiAttivi=false
  videoId: string | undefined;
  videoList: Video[] = [
    {
      title: 'versace on the floor',
      link: 'https://www.youtube.com/watch?v=2NOioOsxctQ'
    }
  ];
  constructor( private dbservice:DbServiceService) { }
  
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
    this.dbservice.getItem("users").then((data)=>{
      console.log(data)
    })
  }

  selectVideo(video: Video) {
    const params = new URL(video.link).searchParams;
    let currentVid=params.get('v');
    if(currentVid){
      this.videoId=currentVid
    }
  }
  modifiedletter(position:number,event:any){
    let correctAnswer="quantocribbiotiamo"
    let currentGuess=""
    for(let i=0;i<18;i++){
      let currentLetter=<HTMLInputElement>document.getElementById((i+1).toString())
      if(currentLetter){
        if(currentLetter.value){
          currentGuess+=currentLetter.value.toString()
         if(this.aiutiAttivi){currentLetter.value==correctAnswer[i]?currentLetter.style.backgroundColor="rgb(44 215 30 / 94%)":currentLetter.style.backgroundColor="white"}
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
       }, 2000);
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
    this.textbeforeAuth=(3-callNumber).toString()+"..."
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
  checkVideoEnded(ev:any){
    if(ev.data===0){
      this.selectVideo(this.videoList[this.getRandomInt(this.videoList.length-1)])
    }
  }
   getRandomInt(max:number) {
    return Math.floor(Math.random() * max);
  }
}

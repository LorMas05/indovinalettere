import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 
import { getDocs } from "firebase/firestore"; 


@Injectable({
  providedIn: 'root'
})
export class DbServiceService {
  firebaseConfig = {
    apiKey: "AIzaSyBTyI_Rr4DKKASFMVbI8E6AhmwP3gxFjNI",
    authDomain: "loroladb.firebaseapp.com",
    projectId: "loroladb",
    storageBucket: "loroladb.appspot.com",
    messagingSenderId: "250729594764",
    appId: "1:250729594764:web:b0c07bd45442cd4ca9a0a9",
    measurementId: "G-EFSS850M4D"
  };
  app = initializeApp(this.firebaseConfig);
  db = getFirestore(this.app);
  constructor() { }



  async createItem(collecionName:string,dbObj:object){
    try {
      const docRef = await addDoc(collection(this.db, collecionName), dbObj);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async getItem(collectionName:string):Promise<any>{
    const querySnapshot = await getDocs(collection(this.db, collectionName));
    let toreTurn =new Promise((resolve,reject)=>{
      let fullData:any[]=[]
      querySnapshot.forEach((doc) => {
        fullData.push(doc.data())
      });
      resolve(fullData)
    })
    return toreTurn
     
  }

}

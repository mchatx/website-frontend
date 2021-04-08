import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TsugeGushiService {

  constructor() { }

    //------------------------ TSUGE GUSHI ENCRYPTION ------------------------
    TGEncryption(input:string, teeth:number, head:number): string{
      let output:string = "";
      let key:string = "";
      let teethsize:number = 0;
      
      output = btoa(input);
      key = head.toString();
  
      teethsize = Math.floor(output.length*3.0/4.0);
      for (let i: number = 0; i <= head; i++){
        output = output.slice(teethsize) + output.slice(0, teethsize);
      }
  
      for (let i: number = 0; i <= head; i++){
        if ((/[a-zA-Z]/).test(output[i])){
          key += output[i];
          break;
        }
      }
  
      for (let i: number = 0; i <= teeth; i++){
        let TeethLoc: number = Math.floor(Math.random()*output.length);
        let Halfend: string = output.slice(TeethLoc);
        output = output.slice(0, TeethLoc);
        key += TeethLoc.toString();
        
        if (Date.now() % 2 == 0){
          key += "~";
        } else {
          key += "/";
        }

        key += Halfend[0];

        
        Halfend = Halfend.slice(1);
  
        for (let i:number = 0;((Date.now() % 2 == 0) && (i < 5));i++){
          if (Halfend.length != 0){
            key += Halfend.slice(0,1);
            Halfend = Halfend.slice(1);
          }
          if (key.length > output.length + Halfend.length){
            break;
          }
        }
  
        output += Halfend;
        if (Date.now() % 2 == 0){
          key += "_";
        } else {
          key += "\\";
        }
  
        if (key.length >= output.length){
          break;
        }
      }
  
      output = output + " " + key;

      head = Math.floor((Date.now() % 1000) * 255.0 / 999.0);
      teethsize = Math.floor(output.length*3.0/4.0);
      for (let i: number = 0; i <= head; i++){
        output = output.slice(teethsize) + output.slice(0, teethsize);
      }

      key = head.toString(16);
      if (key.length == 1){
        key = "0" + key;
      }

      return (key + output);
    }
  
    TGDecryption(input:string): string {
      let teeth:number = Number.parseInt(input.slice(0, 2), 16);
      input = input.slice(2);

      let teethsize = input.length - Math.floor(input.length*3.0/4.0);
      for (let i: number = 0; i <= teeth; i++){
        input = input.slice(teethsize) + input.slice(0, teethsize);
      }

      let output:string = input.split(" ")[0];
      let key:string = input.split(" ")[1];
      
      let cutloc:number = 0;
      for (cutloc = 0; cutloc < key.length; cutloc++){
        if ((/[a-zA-Z]/).test(key[cutloc])){
          break;
        }
      }

      teeth = Number.parseInt(key.slice(0,cutloc));
      key = "\\" + key.slice(cutloc + 1);

      let cutstring:string = "";
      let cutstring2:string = "";
      for (let taking:boolean = false;key.length > 0;){
        if((key.slice(-1) == "_") || (key.slice(-1) == "\\")) {
          if (cutstring == ""){
            cutloc = 0
          } else {
            cutloc = Number.parseInt(cutstring);
          }
          output = output.slice(0, cutloc) + cutstring2 + output.slice(cutloc);
          cutstring = "";
          cutstring2 = "";
          taking = false;
        } else if ((key.slice(-1) == "~") || (key.slice(-1) == "/")) {
          taking = true;
        } else if (taking){
          cutstring = key.slice(-1) + cutstring;
        } else {
          cutstring2 = key.slice(-1) + cutstring2;
        }
        key = key.slice(0, key.length - 1);
      }

      teethsize = output.length - Math.floor(output.length*3.0/4.0);
      for (let i: number = 0; i <= teeth; i++){
        output = output.slice(teethsize) + output.slice(0, teethsize);
      }

      return (atob(output));
    }
    //======================== TSUGE GUSHI ENCRYPTION ========================
}

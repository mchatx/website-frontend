import { Component, OnInit, Renderer2, AfterViewInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import { SHA256, enc } from 'crypto-js';

/*
  Params
  room = room nick
  pass = room pass
  max = maximum number of displayed text
  ot = outline thickness

  Css
  html:
    background-color
  h1:
    background-color
    font-size
    font-family
    text-align
*/

class FullEntry {
  Stext: string | undefined;
  Stime: number = 0;
  CC: string | undefined;
  OC: string | undefined;
  key: string | undefined;
}

@Component({
  selector: 'app-proxyapp',
  templateUrl: './proxyapp.component.html',
  styleUrls: ['./proxyapp.component.scss']
})
export class ProxyappComponent implements OnInit, AfterViewInit {
  Status:string | undefined = "";
  EntryList: FullEntry[] = [];
  MaxDisplay = 1;
  OT:number = 1;

  DisplayElem:HTMLHeadElement[] = [];

  constructor(
    private Renderer: Renderer2,
    private TGEnc: TsugeGushiService,
    private route: ActivatedRoute
  ) { }


  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.ParamParse(params);
    });

    for (let i:number = 0; i < 5; i++){
      if (i % 2 != 0){
        this.EntryPrint({ 
          Stext: "TEST" + i.toString() + " asdfkjzx" + " asdfkjzx" + " asdfkjzx" + " asdfkjzx" + " asdfkjzx",
          Stime: 10000,
          CC: "000000",
          OC: "FFFFFF",
          key: ""
        })
      } else {
        this.EntryPrint({ 
          Stext: "TEST" + i.toString(),
          Stime: 10000,
          CC: "FFFFFF",
          OC: "000000",
          key: ""
        })
      }
    }
  }

  ParamParse(ParamsList: ParamMap){
    if (ParamsList.has("max")){
      var test = ParamsList.get("max")?.toString();
      if (Number(test) != NaN){
        this.MaxDisplay = Number(test);
      }
    }

    if (ParamsList.has("ot")){
      var test = ParamsList.get("ot")?.toString();
      if (Number(test) != NaN){
        this.OT = Number(test);
      }
    }

    if (ParamsList.has("room")){
      var test = ParamsList.get("pass")?.toString()
      if (test != null){
        /*
        this.StartListening(this.TGEnc.TGEncoding(JSON.stringify({
          Act: 'Listen',
          Room: ParamsList.get("room")?.toString(),
          Pass: SHA256(test).toString(enc.Hex).toLowerCase()
        })));
        */
      } else {
        /*
        this.StartListening(this.TGEnc.TGEncoding(JSON.stringify({
          Act: 'Listen',
          Room: ParamsList.get("room")?.toString()
        })));
        */
      }
    }
  }

  StartListening(Btoken: string): void {
    this.Status = Btoken;
    const RoomES = new EventSource('http://127.1.0.1:33333/FetchRaw/?BToken=' + Btoken);

    this.Status = "1";

    RoomES.onmessage = e => {
      if (e.data == '{ "flag":"Connect", "content":"CONNECTED TO SECURE SERVER"}'){
      } else if (e.data != '{}'){
        var DecodedString = this.TGEnc.TGDecoding(e.data);
        if (DecodedString == '{ "flag":"Timeout", "content":"Translator side time out" }'){
          RoomES.close();
        } else {
          var dt = JSON.parse(DecodedString);
          var tempFE:FullEntry = {
            Stext: dt["content"]["Stext"],
            key: dt["content"]["key"],
            Stime: 0,
            CC: "",
            OC: ""
          };

          if (!dt["content"]["CC"]){
            tempFE.CC = "FFFFFF";
          } else {
            tempFE.CC = dt["content"]["CC"];
          }
          if (!dt["content"]["OC"]){
            tempFE.OC = "000000";
          } else {
            tempFE.OC = dt["content"]["OC"];
          }

          if (dt["flag"] == "insert"){
            this.EntryPrint(tempFE);
          } else if (dt["flag"] == "update"){
            this.EntryRepaint(tempFE);
          }
        }
      }
    }

    RoomES.onerror = e => {
      this.EntryPrint({
        Stime: 0,
        Stext: "CONNECTION ERROR",
        OC: "000000",
        CC: "FFFFFF",
        key: ""
      })
    }

    RoomES.onopen = e => {
      this.EntryPrint({
        Stime: 0,
        Stext: "CONNECTED",
        OC: "000000",
        CC: "FFFFFF",
        key: ""
      })
    }
  
    RoomES.addEventListener('open', function(e) {
    }, false);

    RoomES.addEventListener('message', function (e) {
    }, false);

    RoomES.addEventListener('error', function(e) {
    }, false);

  }

  EntryRepaint(dt:FullEntry): void{
    for(let i:number = 0; i < this.EntryList.length; i++){
      if (this.EntryList[i].key == dt.key){
        const Stext = dt.Stext;
        const CC = dt.CC;
        const OC = dt.OC;
        if (Stext != undefined){
          this.DisplayElem[i].textContent = Stext;
        }
    
        const fontctx = "50px sans-serif";
        var CCctx = "#";
        if (CC != undefined){
          CCctx += CC;
        } else {
          CCctx += "000000"
        }
        var OCctx = "#";
        if (CC != undefined){
          OCctx += OC;
        } else {
          OCctx += "000000"
        }
    
        this.DisplayElem[i].style.webkitTextFillColor = CCctx;
        this.DisplayElem[i].style.webkitTextStrokeColor = OCctx;

        this.EntryList[i] = dt;
        break;
      }
    }
  }

  EntryPrint(dt:FullEntry): void{
    if (this.DisplayElem.length == this.MaxDisplay){
      this.DisplayElem.shift()?.remove();
      this.EntryList.shift();
    }

    const cvs:HTMLHeadElement = this.Renderer.createElement('h1');
    cvs.style.marginTop = "5px";
    cvs.style.paddingLeft = "10px"
    cvs.style.paddingRight = "10px"
    cvs.style.webkitTextStrokeWidth = this.OT.toString() + "px";

    const Stext = dt.Stext;
    const CC = dt.CC;
    const OC = dt.OC;
    if (Stext != undefined){
      cvs.textContent = Stext;
    }

    const fontctx = "50px sans-serif";
    var CCctx = "#";
    if (CC != undefined){
      CCctx += CC;
    } else {
      CCctx += "000000"
    }
    var OCctx = "#";
    if (CC != undefined){
      OCctx += OC;
    } else {
      OCctx += "000000"
    }

    cvs.style.webkitTextFillColor = CCctx;
    cvs.style.webkitTextStrokeColor = OCctx;
    this.Renderer.appendChild(document.getElementById("CardContainer"), cvs);

    /*
    const cvs:HTMLCanvasElement = this.Renderer.createElement('canvas');
    this.Renderer.appendChild(document.getElementById("CardContainer"), cvs);

    const Stext = dt.Stext;
    const CC = dt.CC;
    const OC = dt.OC;

    const fontctx = "50px sans-serif";
    var CCctx = "#";
    if (CC != undefined){
      CCctx += CC;
    } else {
      CCctx += "000000"
    }
    var OCctx = "#";
    if (CC != undefined){
      OCctx += OC;
    } else {
      OCctx += "000000"
    }

    cvs.style.backgroundColor = "rgba(0, 255, 0, 0.2)";
    cvs.style.marginTop = "5px";
    let ctx = cvs.getContext("2d");
    cvs.width = cvs.clientWidth;

    
    if ((Stext != undefined) && (ctx != null)){
      cvs.textContent = Stext;
      cvs.id = Stext;
 
      ctx.textAlign = "center";
      ctx.font = fontctx;

      const Textmetric  = ctx.measureText(Stext);
      const textheight = Math.abs(Textmetric.actualBoundingBoxAscent) + Math.abs(Textmetric.actualBoundingBoxDescent) + 20;

      var TextFragment = Stext.split(" ");
      var TextContainer = [];
 
      for (var StringContainer = "", i = 0; i < TextFragment.length;i++){
        if (StringContainer == ""){
          StringContainer = TextFragment[i];
        } else {
          StringContainer += " " + TextFragment[i];
        }
    
        if (ctx.measureText(StringContainer).width + 10 > cvs.width){
          if (StringContainer.lastIndexOf(" ") == -1){
            TextContainer.push(StringContainer);
            StringContainer = "";
          } else {
            TextContainer.push(StringContainer.substr(0, StringContainer.lastIndexOf(" ")));
            StringContainer = StringContainer.substr(StringContainer.lastIndexOf(" ") + 1);
          }
        }
    
        if (i == TextFragment.length - 1){
          TextContainer.push(StringContainer);
          const TextYShift = textheight*(TextContainer.length/2.0 - 0.75);
    
          cvs.style.height = (textheight*TextContainer.length + 30) + "px";
          cvs.height = cvs.clientHeight;
          ctx.textAlign = "center";
          ctx.font = fontctx;
          ctx.fillStyle = "white";
          //ctx.strokeStyle = OCctx;
    
          for (let j = 0; j < TextContainer.length; j++) {
            ctx.fillText(TextContainer[j], cvs.width/2.0, cvs.height/2.0 - TextYShift + j*textheight);
            ctx.strokeText(TextContainer[j], cvs.width/2.0, cvs.height/2.0 - TextYShift + j*textheight);
          }
        }
      }
    }
    */

    this.EntryList.push(dt);
    this.DisplayElem.push(cvs);
  }
}

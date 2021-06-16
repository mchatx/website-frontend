import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('cardcontainer') cardcontainer !: ElementRef; 

  Status:string | undefined = "";
  EntryList: FullEntry[] = [];
  MaxDisplay = 100;
  OT:number = 1;
  Ani: string = "";
  ChatProxy:HTMLIFrameElement | undefined;

  DisplayElem:HTMLDivElement [] = [];

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

    if (ParamsList.has("ani")){
      var test = ParamsList.get("ani")?.toString();
      if (test != null){
        this.Ani = test;
      }
    }

    if (ParamsList.has("room")){
      var test = ParamsList.get("pass")?.toString()
      if (test != null){
        this.StartListening(this.TGEnc.TGEncoding(JSON.stringify({
          Act: 'Listen',
          Room: ParamsList.get("room")?.toString(),
          Pass: SHA256(test).toString(enc.Hex).toLowerCase()
        })));
      } else {
        this.StartListening(this.TGEnc.TGEncoding(JSON.stringify({
          Act: 'Listen',
          Room: ParamsList.get("room")?.toString()
        })));
      }
    } else if (ParamsList.has("lc") && ParamsList.has("vid")) {
      var test1 = ParamsList.get("lc")?.toString()
      var test2 = ParamsList.get("vid")?.toString()
      if ((test1 != null) && (test2 != null)) {
        this.StartChatProxy(test1, test2);
      }
    } else {
      for (let i:number = 0; i < 10; i++){
        if (i % 2 != 0){
          this.EntryPrint({ 
            Stext: "TEST" + i.toString() + " asdfkjzx" + " asdfkjzx" + " asdfkjzx" + " asdfkjzx" + " asdfkjzx",
            Stime: 10000,
            CC: Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16),
            OC: Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16),
            key: ""
          })
        } else {
          this.EntryPrint({ 
            Stext: "TEST" + i.toString(),
            Stime: 10000,
            CC: Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16),
            OC: Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16),
            key: ""
          })
        }
      }
    }
  }

  StartChatProxy(ChatType:string, VidID: string){
    switch (ChatType) {
      case "YT":
        const RoomES = new EventSource('http://localhost:31023/Skimmer?vidID=' + VidID);

        this.Status = "1";
    
        RoomES.onmessage = e => {
          if (e.data == '{ "flag":"Connect", "content":"CONNECTED TO SECURE SERVER"}'){
          } else if (e.data != '{}'){
            JSON.parse(e.data).forEach((dt:any) => {
              this.YTCprint(dt);
            });
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
    
        break;

      case "TW":
        this.ChatProxy = this.Renderer.createElement("iframe");
        if (this.ChatProxy){
          this.ChatProxy.src = "https://www.twitch.tv/embed/" + VidID + "/chat?parent=" + window.location.hostname;
          this.ChatProxy.style.height = "100%";
          this.ChatProxy.frameBorder = "0";
          this.Renderer.appendChild(this.cardcontainer.nativeElement.parentNode, this.ChatProxy);
          this.cardcontainer.nativeElement.remove();
        }
        break;      
    }
  }

  StartListening(Btoken: string): void {
    this.Status = Btoken;
    const RoomES = new EventSource('https://repo.mchatx.org/FetchRaw/?BToken=' + Btoken);

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
    const parentdiv = this.Renderer.createElement('div');
    this.DisplayElem.push(parentdiv);

    const cvs:HTMLHeadElement = this.Renderer.createElement('h1');
    cvs.style.marginTop = "5px";
    cvs.style.paddingLeft = "20px";
    cvs.style.paddingRight = "20px";
    cvs.style.webkitTextStrokeWidth = this.OT.toString() + "px";

    parentdiv.id = "BoxShape";
    if (this.Ani != ""){
      parentdiv.className = "animate__animated animate__" + this.Ani;
    }

    const Stext = dt.Stext;
    const CC = dt.CC;
    const OC = dt.OC;
    if (Stext != undefined){
      cvs.textContent = Stext;
    }

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

    
    this.Renderer.appendChild(this.cardcontainer.nativeElement, parentdiv);
    this.EntryList.push(dt);
    this.Renderer.appendChild(parentdiv, cvs);
  }

  YTCprint(dt:any){
    if (this.DisplayElem.length == this.MaxDisplay){
      this.DisplayElem.shift()?.remove();
      this.EntryList.shift();
    }
    const parentdiv = this.Renderer.createElement('div');
    this.DisplayElem.push(parentdiv);

    parentdiv.id = "BoxShape";
    if (this.Ani != ""){
      parentdiv.className = "animate__animated animate__" + this.Ani;
    } else {
      parentdiv.className = "animate__animated animate__fadeInLeft";
    }

    let workhead;
    // AUTHOR HEAD RENDERER
    workhead = this.Renderer.createElement('img');
    workhead.src = dt.authorPhoto;
    workhead.style.borderRadius = "50%";
    workhead.style.width = "32px";
    workhead.style.height = "32px";
    this.Renderer.appendChild(parentdiv, workhead);

    workhead = this.Renderer.createElement('span');
    workhead.textContent = dt.author;
    this.Renderer.appendChild(parentdiv, workhead);

    if (dt.badgeContent){
      dt.badgeContent.forEach((e:any) => {
        if (e.Thumbnail){
          workhead = this.Renderer.createElement('img');
          workhead.src = e.Thumbnail;
          workhead.style.width = "32px";
          workhead.style.height = "32px";
          this.Renderer.appendChild(parentdiv, workhead);
        }
      });
    }

    workhead = this.Renderer.createElement('br');
    this.Renderer.appendChild(parentdiv, workhead);

    // CONTENT RENDERER
    dt.content.forEach((e:string) => {
      if (e.indexOf("https://") != -1){
        workhead = this.Renderer.createElement('img');
        workhead.src = e;
        workhead.style.width = "32px";
        workhead.style.height = "32px";
        this.Renderer.appendChild(parentdiv, workhead);
      } else {
        workhead = this.Renderer.createElement('span');
        workhead.textContent = e;
        this.Renderer.appendChild(parentdiv, workhead);
      }
    });

    //  PUT THE TL TOO
    if (dt.TL){
      workhead = this.Renderer.createElement('br');
      this.Renderer.appendChild(parentdiv, workhead);
  
      workhead = this.Renderer.createElement('span');
      workhead.textContent = "(Deepl:" + dt.TL + ")";
      this.Renderer.appendChild(parentdiv, workhead);
    }
        
    this.EntryList.push(dt);
    this.Renderer.appendChild(this.cardcontainer.nativeElement, parentdiv);
    this.cardcontainer.nativeElement.scrollTop = this.cardcontainer.nativeElement.scrollHeight;
  }
}

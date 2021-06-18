import { Component, OnInit, Renderer2, AfterViewInit, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import { SHA256, enc } from 'crypto-js';
import { filter } from 'rxjs/operators';

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
  @ViewChild('cardcontainer', {static: false}) cardcontainer !: ElementRef; 
  @ViewChildren('item') itemElements!: QueryList<any>;
  scrollContainer: any;

  Status:string | undefined = "";
  EntryList: any[] = [];
  EntryContainer: any[] = [];
  DisplayElem:HTMLHeadingElement[] = [];
  MaxDisplay = 100;
  OT:number = 1;
  Ani: string = "";
  ChatProxyEle:HTMLIFrameElement | undefined;

  ChatProxy:boolean = false;
  scrollend:boolean = true;
  EntryLoader:boolean = false;
  ChatFilterMode:boolean = false;
  Filter = {
    author: [""],
    keyword: ""
  }
  AuthPP:boolean = true;
  AuthName:boolean = true;
  AuthBadge:boolean = true;
  AuthHead:boolean = true;

  constructor(
    private Renderer: Renderer2,
    private TGEnc: TsugeGushiService,
    private route: ActivatedRoute
  ) { }

 
  ngOnInit(): void {
    this.ParamParse(this.route.snapshot.paramMap.get('token'));
  }

  ngAfterViewInit(): void {
    this.scrollContainer = this.cardcontainer.nativeElement;  
    this.itemElements.changes.subscribe(() => {this.onItemElementsChanged();});
  }

  onScrollView(): void{
    this.scrollend = this.isNearBottom();
  }

  onItemElementsChanged(): void {
    if (this.scrollend) {
      this.scrollContainer.scroll({
        top: this.scrollContainer.scrollHeight,
        left: 0
      });
    }
  }

  isNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }
  //--------------------------------------------- PARAM PARSER ---------------------------------------------
  ParamParse(Token: string|null){
    if (Token == null){
      return;
    }

    try {
      var ParamsList = JSON.parse(decodeURI(this.TGEnc.TGDecoding(decodeURIComponent(Token))));
    } catch (error) {
      return;
    }

    if (ParamsList["max"]){
      var test = ParamsList["max"].toString();
      if (Number(test) != NaN){
        this.MaxDisplay = Number(test);
      }
    }

    if (ParamsList["ot"]){
      var test = ParamsList["ot"].toString();
      if (Number(test) != NaN){
        this.OT = Number(test);
      }
    }

    if (ParamsList["ani"]){
      var test = ParamsList["ani"].toString();
      if (test != null){
        this.Ani = test;
      }
    }

    if (ParamsList["room"]){
      var test = ParamsList["pass"];
      if (test != null){
        this.StartListening(this.TGEnc.TGEncoding(JSON.stringify({
          Act: 'Listen',
          Room: ParamsList["room"].toString(),
          Pass: SHA256(test).toString(enc.Hex).toLowerCase()
        })));
      } else {
        this.StartListening(this.TGEnc.TGEncoding(JSON.stringify({
          Act: 'Listen',
          Room: ParamsList["room"].toString()
        })));
      }
    } else if (ParamsList["lc"] && ParamsList["vid"]) {
      this.ChatProxy = true;
      if (ParamsList["AuthPP"]){
        this.AuthPP = false;
      }
      if (ParamsList["AuthName"]){
        this.AuthName = false;
      }
      if (ParamsList["AuthBadge"]){
        this.AuthBadge = false;
      }
      if (!this.AuthPP && !this.AuthName && !this.AuthBadge){
        this.AuthHead = false;
      }

      if(ParamsList["FilterMode"]){
        this.Filter.author = [];
        this.ChatFilterMode = true;
        if (ParamsList["keywords"]){
          this.Filter.keyword = "";
          ParamsList["keywords"].forEach((e:string) => {
            if (this.Filter.keyword == ""){
              this.Filter.keyword = e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            } else {
              this.Filter.keyword += "|" + e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            }
          });
        }
        if (ParamsList["author"]){
          this.Filter.author = ParamsList["author"];
        }
        this.StartChatProxy(ParamsList["lc"], ParamsList["vid"], true);
      } else {
        this.StartChatProxy(ParamsList["lc"], ParamsList["vid"], false);
      }
   } else {
      for (let i:number = 0; i < 10; i++){
        if (i % 2 != 0){
          this.MEntryAdd({ 
            Stext: "TEST" + i.toString() + " asdfkjzx" + " asdfkjzx" + " asdfkjzx" + " asdfkjzx" + " asdfkjzx",
            Stime: 10000,
            CC: Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16),
            OC: Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16) + Math.floor(Math.random()*256).toString(16),
            key: ""
          })
        } else {
          this.MEntryAdd({ 
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
  //============================================= PARAM PARSER =============================================



  //--------------------------------------------- MCHAD ROOM MODE ---------------------------------------------
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
            this.MEntryAdd(tempFE);
          } else if (dt["flag"] == "update"){
            this.MEntryReplace(tempFE);
          }
        }
      }
    }

    RoomES.onerror = e => {
      this.MEntryAdd({
        Stime: 0,
        Stext: "CONNECTION ERROR",
        OC: "000000",
        CC: "FFFFFF",
        key: ""
      })
    }

    RoomES.onopen = e => {
      this.MEntryAdd({
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

  MEntryReplace(dt:FullEntry): void{
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

  MEntryAdd(dt:FullEntry): void{
    if (this.DisplayElem.length == this.MaxDisplay){
      this.DisplayElem.shift()?.remove();
      this.EntryList.shift();
    }

    const cvs:HTMLHeadingElement = this.Renderer.createElement('h1');
    cvs.style.marginTop = "5px";
    cvs.style.paddingLeft = "20px";
    cvs.style.paddingRight = "20px";
    cvs.id = "BoxShape";

    if (this.Ani != ""){
      cvs.className = "animate__animated animate__" + this.Ani;
    }
    cvs.style.webkitTextStrokeWidth = this.OT.toString() + "px";

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
    this.Renderer.appendChild(this.cardcontainer.nativeElement, cvs);

    this.EntryList.push(dt);
    this.DisplayElem.push(cvs);
  }
  //============================================= MCHAD ROOM MODE =============================================



  //--------------------------------------------- CHAT PROXY MODE ---------------------------------------------
  StartChatProxy(ChatType:string, VidID: string, filter:boolean){
    switch (ChatType) {
      case "YT":
        var RoomES = new EventSource("");
        if (filter){
          RoomES = new EventSource('http://localhost:31023/TLFilter?vidID=' + VidID);
        } else {
          RoomES = new EventSource('http://localhost:31023/AutoTL?vidID=' + VidID);
        }
        

        this.Status = "1";
    
        RoomES.onmessage = e => {
          if (e.data == '{ "flag":"Connect", "content":"CONNECTED TO SECURE SERVER"}'){
          } else if (e.data != '{}'){
            if (this.ChatFilterMode){
              if ((this.Filter.author.length != 0) && (this.Filter.keyword != "")){
                JSON.parse(e.data).forEach((dt:any) => {
                  if (this.Filter.author.indexOf(dt.author) != -1){
                    for(let i = 0; i < dt.content.length; i++){
                      if (dt.content[i].indexOf('https://') != -1){
                        return;
                      } else if (dt.content[i].match(new RegExp(this.Filter.keyword, 'i')) != null){
                        this.EntryContainer.push(dt);
                        break;
                      }
                    }
                  }
                });    
              } else if (this.Filter.author.length != 0){
                JSON.parse(e.data).forEach((dt:any) => {
                  if (this.Filter.author.indexOf(dt.author) != -1){
                    this.EntryContainer.push(dt);
                  }
                });    
              } else if (this.Filter.keyword != ""){
                JSON.parse(e.data).forEach((dt:any) => {
                  for(let i = 0; i < dt.content.length; i++){
                    if (dt.content[i].indexOf('https://') != -1){
                      return;
                    } else if (dt.content[i].match(new RegExp(this.Filter.keyword, 'i')) != null){
                      this.EntryContainer.push(dt);
                      break;
                    }
                  }
                });    
              } else {
                JSON.parse(e.data).forEach((dt:any) => {
                  this.EntryContainer.push(dt);
                });    
              }
            } else {
              JSON.parse(e.data).forEach((dt:any) => {
                this.EntryContainer.push(dt);
              });  
            }
            if (!this.EntryLoader){
              this.EntryLoader = true;
              this.StartYTCprint();
            }
          }
        }
    
        RoomES.onerror = e => {
        }
    
        RoomES.onopen = e => {
        }
      
        RoomES.addEventListener('open', function(e) {
        }, false);
    
        RoomES.addEventListener('message', function (e) {
        }, false);
    
        RoomES.addEventListener('error', function(e) {
        }, false);
    
        break;

      case "TW":
        this.ChatProxyEle = this.Renderer.createElement("iframe");
        if (this.ChatProxyEle){
          this.ChatProxyEle.src = "https://www.twitch.tv/embed/" + VidID + "/chat?parent=" + window.location.hostname;
          this.ChatProxyEle.style.height = "100%";
          this.ChatProxyEle.frameBorder = "0";
          this.Renderer.appendChild(this.cardcontainer.nativeElement.parentNode, this.ChatProxyEle);
          this.cardcontainer.nativeElement.remove();
        }
        break;      
    }
  }

  StartYTCprint(){
    if (this.EntryContainer.length == 0){
      this.EntryLoader = false;
      return;
    }
    let dt = this.EntryContainer.shift();

    if (this.EntryList.length == this.MaxDisplay){
      this.EntryList.shift();
    }
    this.EntryList.push(dt);

    setTimeout(() => {
      this.StartYTCprint();
    }, 500);
  }
  //============================================= CHAT PROXY MODE =============================================
}

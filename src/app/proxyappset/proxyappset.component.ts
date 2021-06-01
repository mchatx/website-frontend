import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { WPproxyService } from '../services/wpproxy.service';
import { Subscription, timer } from 'rxjs';

class RoomData{
  Nick: string | undefined;
  EntryPass: boolean = false;
  Empty: boolean = false;
  StreamLink: string | undefined;
  Tags: string | undefined;
}

class FullEntry {
  Stext: string | undefined;
  Stime: number = 0;
  CC: string | undefined;
  OC: string | undefined;
  key: string | undefined;
}

@Component({
  selector: 'app-proxyappset',
  templateUrl: './proxyappset.component.html',
  styleUrls: ['./proxyappset.component.scss']
})
export class ProxyappsetComponent implements OnInit {
  @ViewChild("cardcontainer") cardcontainer !: ElementRef;
  @ViewChild("BGSwitchButton") BGSwitchButton !: ElementRef;
  CurrentPage:number = 0;
  Timer:Subscription|undefined;

  EntryList: FullEntry[] = [];
  DisplayElem:HTMLHeadElement[] = [];

  /*  
    FIRST PAGE SETTING
    ProxyMode 0 MChad Room
              1 Chat Filter
              2 LiveTL's Kanatran?
  */
  ProxyMode:number = 0;
  RoomNick:string = "";
  RoomPass:string = "";
  RoomList: RoomData[] = [];
  PasswordProtected: boolean = false;

  /*  
    SECOND PAGE SETTING
    Styling and what's not
  */
  MaxDisplay: number = 1; //Maximum message card display
  OT:number = 1;          //Outline Thickness in pixel
  CardBGColour = {
    r:0,
    g:0,
    b:0,
    a:0
  }
  BGcolour: string = "#FFFFFF";
  FFamily:string = "sans-serif";
  FFsize:number = 50;
  TxAlign:string = "center";
  
  /*  
    THIRD PAGE
    Link and CSS generator
  */
  ProxyLink: string = "";
  ProxyCss: string = "";

  constructor(
    private WPService: WPproxyService,
    private Renderer: Renderer2
  ) { }

  ngOnInit(): void {
    //this.getRoom();
  }

  //------------------------------ FIRST PAGE HANDLER ------------------------------
  getRoom():void {
    this.WPService.getRoom().subscribe(
      (response:RoomData[]) => {
        this.RoomList = response;
      }
    )
  }

  CheckPass(){
    const RoomCheck:RoomData[] = this.RoomList.filter(Room => Room.Nick == this.RoomNick)
    if (RoomCheck.length != 0){
      this.PasswordProtected = RoomCheck[0].EntryPass;
      this.RoomPass = "";
    } else {
      this.PasswordProtected = false;
    }
  }
  //============================== FIRST PAGE HANDLER ==============================

  //------------------------------ SECOND PAGE HANDLER ------------------------------
  ReRenderExample():void{
    var ColourParse = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(this.BGcolour);
    if (ColourParse != null){
      this.CardBGColour.r = parseInt(ColourParse[1], 16);
      this.CardBGColour.g = parseInt(ColourParse[2], 16);
      this.CardBGColour.b = parseInt(ColourParse[3], 16);
    }
    this.RepaintEntries();
  }

  Backgroundchange():void{
    if (this.cardcontainer.nativeElement.style["background-color"] == "black"){
      this.cardcontainer.nativeElement.style["background-color"] = "white";
      this.BGSwitchButton.nativeElement.innerHTML = "black";
    } else {
      this.cardcontainer.nativeElement.style["background-color"] = "black";
      this.BGSwitchButton.nativeElement.innerHTML = "white";
    }
  }

  AddEntry(stext:string):void {
    this.EntryPrint({
      Stime: 0,
      Stext: "TEST " + stext,
      CC: "",
      OC: "",
      key: ""
    });
  }

  RepaintEntries():void {
    this.DisplayElem.forEach((elem) => {
      elem.style.webkitTextStrokeWidth = this.OT.toString() + "px";
      elem.style.fontFamily = this.FFamily;
      elem.style.fontSize = this.FFsize.toString() + "px";
      elem.style.textAlign = this.TxAlign;
      elem.style.backgroundColor = "rgba(" + this.CardBGColour.r.toString() + ", " + this.CardBGColour.g.toString() + ", " + this.CardBGColour.b.toString() + ", " + this.CardBGColour.a.toString() + ")";
    })
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
    cvs.style.fontFamily = this.FFamily;
    cvs.style.fontSize = this.FFsize.toString() + "px";
    cvs.style.textAlign = this.TxAlign;
    cvs.style.backgroundColor = "rgba(" + this.CardBGColour.r.toString() + ", " + this.CardBGColour.g.toString() + ", " + this.CardBGColour.b.toString() + ", " + this.CardBGColour.a.toString() + ")";

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
  //============================== SECOND PAGE HANDLER ==============================
  
  //------------------------------ MISC HANDLER ------------------------------
  NextButtonClick():void {
    if (this.CurrentPage == 1){
      this.Timer?.unsubscribe();
      this.EntryList = [];
      this.DisplayElem = [];
    }
    this.CurrentPage += 1;

    if (this.CurrentPage == 1){
      this.Timer = timer(1000,1000).subscribe((t) => {
        this.AddEntry(t.toString());
      });
      if(!this.PasswordProtected){
        this.RoomPass = "";
      }
    } else if (this.CurrentPage == 2){
      var TempString = "";

      //-------------------- LINK GENERATOR --------------------
      this.ProxyLink = TempString;

      TempString = "https://mchatx.org/proxyapp?";
      if (this.RoomNick != ""){
        TempString += "room=" + this.RoomNick.replace(" ", "%20") + "&";
      }
      if (this.RoomPass != ""){
        TempString += "pass=" + this.RoomPass.replace(" ", "%20") + "&";
      }
      if (this.MaxDisplay != 1){
        TempString += "max=" + this.MaxDisplay + "&";
      }
      if (this.OT != 1){
        TempString += "ot=" + this.OT + "&";
      }

      if(TempString[TempString.length-1] == "&"){
        TempString = TempString.substring(0, TempString.length - 1);
      }
      this.ProxyLink = TempString;

      //-------------------- CSS GENERATOR --------------------
      TempString = "";
      this.ProxyCss = TempString;
      TempString = "html {\n\tbackground-color: rgba(0, 0, 0, 0);\n}\n";
      TempString += "h1 {\n\tbackground-color: rgba(" + this.CardBGColour.r.toString() + ", " + this.CardBGColour.g.toString() + ", " + this.CardBGColour.b.toString() + ", " + this.CardBGColour.a.toString() + ");\n";
      TempString += "\tfont-size: " + this.FFsize + "px;\n";
      TempString += "\tfont-family: " + this.FFamily + ";\n";
      TempString += "\ttext-align: " + this.TxAlign + ";\n";
      TempString += "}";
      this.ProxyCss = TempString;
    }
  }

  PrevButtonClick():void {
    if (this.CurrentPage == 1){
      this.Timer?.unsubscribe();
      this.EntryList = [];
      this.DisplayElem = [];
    }
    this.CurrentPage -= 1;

    if (this.CurrentPage == 1){
      this.Timer = timer(1000,1000).subscribe((t) => {
        this.AddEntry(t.toString());
      });
    }
  }

  CopyBtnClick(CopyLink:boolean) {
    if (CopyLink){
      navigator.clipboard.writeText(this.ProxyLink).then().catch(e => console.error(e));
    } else {
      navigator.clipboard.writeText(this.ProxyCss).then().catch(e => console.error(e));
    }
  }
}

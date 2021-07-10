import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TsugeGushiService } from '../services/tsuge-gushi.service';
import { TranslatorService } from '../services/translator.service';
import {  AccountService } from '../services/account.service';
import { faHome, faLock, faUser } from '@fortawesome/free-solid-svg-icons';

class FullEntry {
  Stext: string = "";
  Stime: number = 0;
  CC: string | undefined;
  OC: string | undefined;
  key: string = "";
}

class Profile {
  Name: string = '';
  Prefix: string = '';
  Suffix: string = '';
  CC: string | undefined;
  OC: string | undefined;
}

@Component({
  selector: 'app-translator-client',
  templateUrl: './translator-client.component.html',
  styleUrls: ['./translator-client.component.scss']
})
export class TranslatorClientComponent implements OnInit {
  @ViewChild('cardcontainer') cardcontainer !: ElementRef; 
  @ViewChild('loadstate') loadbutton!: ElementRef;
  LoginMode: boolean = false;
  SearchPass: string = "";
  status:string = "";
  ModalMenu:number = 0;

  //  DISPLAY VARIABLES
  EntryList: FullEntry[] = [];
  OT:number = 1;
  ChatProxy:HTMLIFrameElement | undefined;

  FFsize:number = 21;
  FStyle:string = "Ubuntu";
  TxAlign:CanvasTextAlign = "left";
  MaxDisplay = 3;
  BGColour:string = "#28282B";

  RoomNick: string = "";

  //  TL VARIABLES
  TLEntry:FullEntry = ({
    Stext: "",
    Stime: 0,
    CC: undefined,
    OC: undefined,
    key: ""
  });

  Prefix: string = "";
  Suffix: string = "";
  OCcheck: boolean = false;
  CCcheck: boolean = false;
  OCcolour: string = "#000000";
  CCcolour: string = "#FFFFFF";

  ProfileTab:boolean = false;
  Profiletabtimeout:any;
  SelectedProfile: number = 0;
  ProfileList:Profile[] = [];

  constructor(
    private TGEnc: TsugeGushiService,
    private TLService: TranslatorService,
    private router: Router,
    private AccService: AccountService
  ) { }

  ngOnInit(): void {
    let test: string | null = localStorage.getItem("MChatToken");
    if (test != undefined) {
      try {
        let TokenData = JSON.parse(this.TGEnc.TGDecoding(test));
        this.RoomNick = TokenData["Room"];
        if (TokenData["Role"] == "TL") {
          this.AccService.CheckToken(TokenData["Room"], TokenData["Token"]).subscribe({
            error: error => {
              localStorage.removeItem("MChatToken");
            },
            next: data => {
              this.LoginMode = true;

              this.ProfileList.push({
                Name: 'Default',
                Prefix: '',
                Suffix: '',
                OC: undefined,
                CC: undefined
              });
            }
          });
        } else {
          this.router.navigate(['']);
        }
      } catch (error) {
        localStorage.removeItem("MChatToken");
      }
    }
  }

  LoginRoom() {
    this.status = "";
    this.loadbutton.nativeElement.classList.add('is-loading')
    setTimeout(() => {
      this.loadbutton.nativeElement.classList.remove('is-loading')
    }, 1000);
    this.AccService.GetToken(this.RoomNick, this.SearchPass).subscribe({
      error: error => {
        setTimeout(() => {
        }, 2000);
        this.status = "WRONG PASSWORD/ROOM NAME";
        this.SearchPass = "";
        localStorage.removeItem("MChatToken");
      },
      next: data => {
        if (data.body[0]["Role"] == "TL") {
          localStorage.setItem("MChatToken", this.TGEnc.TGEncoding(JSON.stringify({
            Room: this.RoomNick,
            Token: data.body[0]["Token"],
            Role: "TL"
          })));

          location.reload();
        } else {
          this.status = "THIS ACCOUNT DOESN'T HAVE TL PRIVILEGE";
          this.SearchPass = "";
        }
      }
    });
  }



  //-------------------------- AUX CONTROL --------------------------
  ProfileName:string = "";
  OpenSessionPass:string = "";
  StreamLink:string = "";
  Tags:string = "";
  Notes:string = "";
  PassCheck:boolean = false;
  PassString:string = "";
  ArchiveTitle:string = "";
  ThirdPartySharing:boolean = true;
  Hidden:boolean = false;
  EditCC:string = "";
  EditCCheck:boolean = false;
  EditOC:string = "";
  EditOCheck:boolean = false;
  EditText:string = "";
  EditKey:string = "";

  /*
  1 => Add New Profile
  2 => Host Open Session
  3 => Stream Link, Tags, Note
  4 => Password
  5 => Export Script
  6 => Save to Archive
  7 => Clear room
  8 => Edit Entry
  */
  SetModalMenu(idx: number):void {
    this.ModalMenu = idx;
    switch (this.ModalMenu) {
      case 1:
        this.ProfileName = "";        
        break;
      
      case 2:
        
        break;

      case 3:
        
        break;
  
      case 4:
        
        break;

      case 5:
        
        break;
  
      case 6:
        
        break;
  
      case 7:
        
        break;
    }
  }

  ClearRoom():void {
    this.EntryList = [];
    this.ModalMenu = 0;
  }

  SaveOpenSessionPass():void {
    this.ModalMenu = 0;
  }

  SaveExtraInfo():void {
    this.ModalMenu = 0;
  }

  SavePassword():void {
    this.ModalMenu = 0;
  }

  ThirdPartyChange():void {
    
  }

  SaveToArchive():void {
    this.ModalMenu = 0;
    this.EntryList = [];
  }

  OpenEditEntry(idx : number):void {
    let test = this.EntryList[idx].CC;
    if (test != undefined){
      this.EditCC = '#' + test;
      this.EditCCheck = true;
    } else {
      this.EditCC = '#FFFFFF';
      this.EditCCheck = false;
    }

    test = this.EntryList[idx].OC;
    if (test != undefined){
      this.EditOC = '#' + test;  
      this.EditOCheck = true;    
    } else {
      this.EditOC = '#FFFFFF';
      this.EditOCheck = false;
    }
   
    this.EditText = this.EntryList[idx].Stext;
    this.EditKey = this.EntryList[idx].key;
    this.SetModalMenu(8);
  }

  SendEdit():void {
    if (this.EditCCheck){
      this.TLEntry.CC = this.EditCC.substr(1);
    } else {
      this.TLEntry.CC = undefined;
    }

    if (this.EditOCheck){
      this.TLEntry.OC = this.EditOC.substr(1); 
    } else {
      this.TLEntry.OC = undefined;
    }

    this.TLEntry.Stime = Date.now();

    this.EntryRepaint({
      Stext: this.EditText,
      Stime: 0,
      CC: this.TLEntry.CC,
      OC: this.TLEntry.OC,
      key: this.EditKey
    });

    this.ModalMenu = 0;
  }
  //========================== AUX CONTROL ==========================



  //-------------------------- TL INPUT CONTROL --------------------------
  SaveProfile():void {
    if (this.CCcheck){
      this.ProfileList[this.SelectedProfile].CC = this.CCcolour;
    } else {
      this.ProfileList[this.SelectedProfile].CC = undefined;
    }

    if (this.OCcheck){
      this.ProfileList[this.SelectedProfile].OC = this.OCcolour; 
    } else {
      this.ProfileList[this.SelectedProfile].OC = undefined;
    }

    this.ProfileList[this.SelectedProfile].Suffix = this.Suffix;
    this.ProfileList[this.SelectedProfile].Prefix = this.Prefix;
  }

  LoadProfile():void {
    if (this.ProfileList[this.SelectedProfile].CC != undefined){
      this.CCcheck = true;
      var test = this.ProfileList[this.SelectedProfile].CC;
      if (test){
        this.CCcolour = test;
      }      
    } else {
      this.CCcheck = false;
      this.CCcolour = '#FFFFFF';
    }

    if (this.ProfileList[this.SelectedProfile].OC != undefined){
      this.OCcheck = true;
      var test = this.ProfileList[this.SelectedProfile].OC;
      if (test){
        this.OCcolour = test;
      }      
    } else {
      this.OCcheck = false;
      this.OCcolour = '#FFFFFF';
    }

    this.Suffix = this.ProfileList[this.SelectedProfile].Suffix;
    this.Prefix = this.ProfileList[this.SelectedProfile].Prefix;

    if (!this.ProfileTab){
      this.ProfileTab = true;
      this.Profiletabtimeout = setTimeout(() => {
        this.ProfileTab = false;
      }, 3000);
    } else {
      clearTimeout(this.Profiletabtimeout);
      this.Profiletabtimeout = setTimeout(() => {
        this.ProfileTab = false;
      }, 3000);
    }
  }

  @HostListener('document:keydown.tab', ['$event'])
  ShiftProfile(event: KeyboardEvent):void {
    event.preventDefault();
    this.SaveProfile();
    if (this.SelectedProfile == this.ProfileList.length - 1){
      if (this.ProfileList.length == 1){
        this.SelectedProfile = 0;
      } else {
        this.SelectedProfile = 1;
      }
    } else {
      this.SelectedProfile++;
    }
    this.LoadProfile();
  }

  @HostListener('document:keydown.shift.tab', ['$event'])
  JumpToDefault(event: KeyboardEvent):void {
    this.SaveProfile();
    this.SelectedProfile = 0;
    this.LoadProfile();
    event.preventDefault();
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  UpKeypress(event: KeyboardEvent):void {
    this.ShiftUp();
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  DownKeypress(event: KeyboardEvent):void {
    this.ShiftDown();
  }

  ShiftUp():void {
    this.SaveProfile();
    if (this.SelectedProfile == 0){
      this.SelectedProfile = this.ProfileList.length - 1;
    } else {
      this.SelectedProfile--;
    }
    this.LoadProfile();
  }

  ShiftDown():void {
    this.SaveProfile();
    if (this.SelectedProfile == this.ProfileList.length - 1){
        this.SelectedProfile = 0;
    } else {
      this.SelectedProfile++;
    }
    this.LoadProfile();
  }

  DeleteProfile():void {
    if (this.SelectedProfile != 0){
      this.ProfileList.splice(this.SelectedProfile, 1);
      this.SelectedProfile--;
    }
    this.LoadProfile();
  }

  AddProfile():void {
    this.SelectedProfile = this.ProfileList.length;
    if (this.ProfileName != ''){
      this.ProfileList.push({
        Name: this.ProfileName,
        Prefix: '',
        Suffix: '',
        OC: undefined,
        CC: undefined
      });
    } else {
      this.ProfileList.push({
        Name: 'Profile' + (this.ProfileList.length + 1).toString(),
        Prefix: '',
        Suffix: '',
        OC: undefined,
        CC: undefined
      });
    }
    this.LoadProfile();
    this.ModalMenu = 0;
  }

  SpamBlock:boolean = false;
  SendEntry(): void{
    if (!this.SpamBlock){
      this.SpamBlock = true;
      if (this.CCcheck){
        this.TLEntry.CC = this.CCcolour.substr(1);
      } else {
        this.TLEntry.CC = undefined;
      }
  
      if (this.OCcheck){
        this.TLEntry.OC = this.OCcolour.substr(1); 
      } else {
        this.TLEntry.OC = undefined;
      }
  
      this.TLEntry.Stime = Date.now();
  
      this.EntryPrint({
        Stext: this.Prefix + this.TLEntry.Stext + this.Suffix,
        Stime: this.TLEntry.Stime,
        CC: this.TLEntry.CC,
        OC: this.TLEntry.OC,
        key: Date.now().toString()
      });
  
      this.TLEntry.Stext = "";
      setTimeout(() => {
        this.SpamBlock = false;
      }, 1000);
    }
  }
  //========================== TL INPUT CONTROL ==========================  



  //-----------------------------------  LIVE LISTENER  -----------------------------------
  StartListening(Btoken: string): void {
    const RoomES = new EventSource('http://localhost:33333/TLAPI/?BToken=' + Btoken);

    RoomES.onmessage = e => {
      if (e.data == '{ "flag":"Connect", "content":"CONNECTED TO SECURE SERVER"}'){
      } else if (e.data != '{}'){
        var DecodedString = this.TGEnc.TGDecoding(e.data);
        if (DecodedString == '{ "flag":"Timeout", "content":"Translator side time out" }'){
          RoomES.close();
        } else {
          var dt = JSON.parse(DecodedString);

          if (dt["flag"] == "insert"){
            this.EntryPrint({
              Stext: dt["content"]["Stext"],
              key: dt["content"]["key"],
              Stime: 0,
              CC: dt["content"]["CC"],
              OC: dt["content"]["OC"]              
            });
          } else if (dt["flag"] == "update"){
            this.EntryRepaint({
              Stext: dt["content"]["Stext"],
              key: dt["content"]["key"],
              Stime: 0,
              CC: dt["content"]["CC"],
              OC: dt["content"]["OC"]              
            });
          }
        }
      }
    }

    RoomES.onerror = e => {
      RoomES.close();
      this.EntryPrint({
        Stime: 0,
        Stext: "CONNECTION ERROR",
        OC: undefined,
        CC: undefined,
        key: ""
      })
    }

    RoomES.onopen = e => {
      this.EntryPrint({
        Stime: 0,
        Stext: "CONNECTED",
        OC: undefined,
        CC: undefined,
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
  //===================================  LIVE LISTENER  ===================================



  //-----------------------------------  ENTRY HANDLER  -----------------------------------
  EntryRepaint(dt:FullEntry): void{
    for(let i:number = 0; i < this.EntryList.length; i++){
      if (this.EntryList[i].key == dt.key){
        dt.Stime = this.EntryList[i].Stime;

        this.EntryList[i] = dt;
        break;
      }
    }
  }

  EntryPrint(dt:FullEntry): void{
    if (this.EntryList.length == this.MaxDisplay){
      this.EntryList.shift();
    }

    this.EntryList.push(dt);
  }
  //===================================  ENTRY HANDLER  ===================================



  //-----------------------------------  EXPORT HANDLER  -----------------------------------
  ExportToFile(mode:number):void {
    this.ModalMenu = 0;
  }
  //===================================  EXPORt HANDLER  ===================================



  faUser = faUser;
  faLock = faLock;
  faHome = faHome;
}
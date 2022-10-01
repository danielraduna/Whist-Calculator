import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from "./entities/user.model";
import {NgbActiveModal, NgbModal, NgbModalOptions, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {NgTemplateOutlet} from "@angular/common";
import {Round} from "./entities/round";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Whist';
  @ViewChild('winnerModal') modalContent?: TemplateRef<any>;

  users: User[] = [];
  currentUser?: User;
  numberOfPlayers: number = 0;
  modalOption: NgbModalOptions = {};
  modalRef?: NgbModalRef;
  indexPlayer = 1;
  visible = false;
  done = false;

  rounds: Round[] = [];
  indexRound = 0;
  currentRound?: Round;
  winner?: User;

  constructor(private modalService: NgbModal) {

  }
  ngOnInit(): void {

  }

  setNumberOfPlayers(x: number): void {
    this.numberOfPlayers = x;
    this.indexPlayer = 1;
    this.modalService.dismissAll();
    let i;
    for(i = 0; i < x; i++) {
      this.users.push({
        name: "",
        points: 0,
        bet: 0,
        streak: 0
      });
    }
    this.currentUser = this.users[0];
    for(i = 0; i < x; i++) {
      this.rounds.push( {
        nrCarti: 1,
        jucator: {
          name: "",
          points: 0,
          bet: 0,
          streak: 0
        },
        jucatori: [],
        nrPariuri: 0,
        sumaPariuri: 0,
        betsLoading: true,
        pointsLoading: false
      });
    }
    for(i = 2; i <= 7; i++){
      this.rounds.push({
        nrCarti: i,
        jucator: {
          name: "",
          points: 0,
          bet: 0,
          streak: 0
        },
        jucatori: [],
        nrPariuri: 0,
        sumaPariuri: 0,
        betsLoading: true,
        pointsLoading: false
      });
    }
    for(i = 0; i < x; i++) {
      this.rounds.push({
        nrCarti: 8,
        jucator: {
          name: "",
          points: 0,
          bet: 0,
          streak: 0
        },
        jucatori: [],
        nrPariuri: 0,
        sumaPariuri: 0,
        betsLoading: true,
        pointsLoading: false
      });
    }
    for(i = 7; i >= 2; i--){
      this.rounds.push({
        nrCarti: i,
        jucator: {
          name: "",
          points: 0,
          bet: 0,
          streak: 0
        },
        jucatori: [],
        nrPariuri: 0,
        sumaPariuri: 0,
        betsLoading: true,
        pointsLoading: false
      });
    }
    for(i = 0; i < x; i++) {
      this.rounds.push({
        nrCarti: 1,
        jucator: {
          name: "",
          points: 0,
          bet: 0,
          streak: 0
        },
        jucatori: [],
        nrPariuri: 0,
        sumaPariuri: 0,
        betsLoading: true,
        pointsLoading: false
      });
    }


  }

  open(content: any) {
    this.modalOption.size = 'lg';
    this.modalService.open(content, this.modalOption);
  }

  setPlayerBet(bet: number) {
      let trs = document.getElementsByTagName('tr');
      this.rounds[this.indexRound].sumaPariuri += bet;
      this.users[this.indexPlayer - 1].bet = bet;

      let text = document.createElement("b");
      text.innerText = "Pariu:   " + bet;
      text.style.marginRight = "30px";
      trs[this.indexRound + 1].children[this.indexPlayer].childNodes[0].appendChild(text);
      this.currentRound!.nrPariuri++;
      if(this.currentRound!.nrPariuri === this.numberOfPlayers) {
        this.currentRound!.betsLoading = false;
        this.currentRound!.pointsLoading = true;
        this.indexPlayer = this.currentRound!.jucatori.indexOf(this.currentRound!.jucator!) + 1;
        this.currentRound!.nrPariuri = 0
        // this.currentRound = this.rounds[++this.indexRound];
        // this.indexPlayer = this.currentRound.jucatori.indexOf(this.currentRound.jucator!);
      }
      else {
        this.indexPlayer++;
        if(this.indexPlayer > this.numberOfPlayers) {
          this.indexPlayer = 1;
        }
      }

      this.currentUser = this.users[this.indexPlayer - 1];
      console.log(this.currentRound);
      this.modalService.dismissAll();
  }

  setPlayerResult(points: number) {
    let trs = document.getElementsByTagName('tr');


    if(this.currentUser?.bet === points) {
      this.currentUser.streak++;
      console.log(this.currentUser.streak);

      this.currentUser.points += points + 5;
      if(this.currentUser.streak === 5) {
        this.currentUser.streak = 0;
        this.currentUser.points += 5;
        trs[this.indexRound + 1].children[this.indexPlayer].className = "gold";
      }
      else
        trs[this.indexRound + 1].children[this.indexPlayer].className = "win";


    }
    else {
      this.currentUser!.streak = 0;
      trs[this.indexRound + 1].children[this.indexPlayer].className = "lose";
      this.currentUser!.points -= Math.abs(this.currentUser!.bet - points);
    }

    let textPoints = document.createElement("b");
    textPoints.style.marginRight = "30px";
    textPoints.innerHTML = "Puncte:   " + this.currentUser!.points;
    trs[this.indexRound + 1].children[this.indexPlayer].childNodes[0].appendChild(textPoints);
    this.currentRound!.nrPariuri++;
    this.modalService.dismissAll();

    if(this.currentRound!.nrPariuri === this.numberOfPlayers) {
      if(this.indexRound !== this.rounds.length - 1) {
        this.currentRound = this.rounds[++this.indexRound];
        this.indexPlayer = this.currentRound.jucatori.indexOf(this.currentRound.jucator!);
      }
      else {
        let max = 0;
        this.done = true;
        this.users.forEach(user => {
          if(user.points > max) {
            max = user.points;
            this.winner = user;
          }
          if(user.points === 0) {
            this.winner = user;
          }
        });
        this.open(this.modalContent);
      }

    }
    this.indexPlayer++;
    if(this.indexPlayer > this.numberOfPlayers) {
      this.indexPlayer = 1;
    }
    this.currentUser = this.users[this.indexPlayer - 1];

  }

  incrementIndexPlayer() {
    if(this.indexPlayer == this.numberOfPlayers && this.users[this.indexPlayer - 1].name !== "") {
      this.modalService.dismissAll();
      this.visible = true;
      this.indexPlayer = 1;
      this.rounds.forEach((round) => {
        round.jucator = this.users[this.indexPlayer - 1];
        round.jucatori = this.users;
        if(this.indexPlayer === this.numberOfPlayers) {
          this.indexPlayer = 1;
        }
        else
          this.indexPlayer++;
      });
      this.currentRound = this.rounds[0];
      this.indexPlayer = 1;

    }
    else if(this.users[this.indexPlayer - 1].name !== ""){
      this.indexPlayer++;
    }
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from "@angular/forms";

import { AngularFirestore } from "@angular/fire/firestore";

import { Subscription } from "rxjs/index";

import { AuthService } from "../_services/auth.service";

@Component({
    selector: 'app-mabble',
    templateUrl: './mabble.component.html',
    styleUrls: ['./mabble.component.scss']
})
export class MabbleComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];
    public currentUser: any = null;

    public gameId = '';
    public game: any;
    private players = [];
    public playersLength: any;
    public playerCards: any;
    public playerCard = 0;
    private score = 0;

    constructor(private fb: FormBuilder,
                private afs: AngularFirestore,
                public auth: AuthService,
                private route: ActivatedRoute) {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.currentUser = user;
            })
        );
    }

    ngOnInit() {
        this.subscriptions.push(
            this.route.paramMap.subscribe(params => {
                if (params.get('gameId')) {
                    this.gameId = params.get('gameId');
                    this.setGame();
                }
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private setGame() {
        console.log('set game');
        this.subscriptions.push(
            this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).valueChanges().subscribe(game => {
                this.game = game;
                this.players = Object.keys(this.game.players);
                this.playersLength = Object.keys(this.game.players).length;
                this.checkSnap(this.players);
            })
        );

        setTimeout(() => {
            const random = Math.floor(Math.random() * (31 - 1 + 1)) + 1;
            // only host push to AFS for playing deck and handles random number
            if (this.game.creator === this.currentUser.uid) {
                this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).update({
                    playingCard: random
                });
            }

            // remaining cards
            let cards = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
            cards.splice(cards.indexOf(random), 1);
            this.shuffle(cards);

            // deal player cards
            const dealtCards = this.deal(cards, this.game.noPlayers, true);

            for(let i = 0; i < this.playersLength ; i++) {
                if (this.currentUser.uid === this.players[i]) {
                    this.playerCards = dealtCards[i];
                }
            }
            if(this.game.noPlayers === this.playersLength) {
                this.startGame();
            }
        }, 1000);

    }

    private startGame() {
        console.log('startGame');
        setTimeout(() => {
            this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).update({
                started: true
            });
        }, 250);

    }

    public snap(image) {
        let playerClass = '';
        if (this.game.deck6['card'+this.game.playingCard].indexOf(image) !== -1) {
            this.score++;
            playerClass = 'correct';
            // add player's card to playing deck
            this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).update({
                playingCard: this.playerCards[this.playerCard]
            });
            // remove player's card from their deck
            if (this.playerCard < this.playerCards.length) {
                this.playerCard++;
            }
            // player runs out of cards
            if (this.playerCard === this.playerCards.length) {
                playerClass = 'finished';
                this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).update({
                    winnerName: this.currentUser.displayName,
                    winnerImageURL: this.currentUser.photoURL,
                    finished: true
                });
            }
        } else {
            playerClass = 'wrong';
            this.score--;
        }
        const playerId = {};
        playerId[`players.${this.currentUser.uid}.score`] = this.score;
        playerId[`players.${this.currentUser.uid}.playerClass`] = playerClass;
        this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).update(playerId).then(() => {
            if (playerClass !== 'finished') {
                playerId[`players.${this.currentUser.uid}.playerClass`] = null;
                this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).update(playerId);
            }
        });
    }

    private checkSnap(players) {
        for(let i = 0; i < this.playersLength ; i++) {
            if (this.game.players[players[i]].playerClass === 'wrong') {
                this.playWrongSound();
                return;
            }
            if (this.game.players[players[i]].playerClass === 'correct') {
                this.playCorrectSound();
                return;
            }
        }
    }

    private playCorrectSound() {
        console.log('correct sound');
        let audio = new Audio();
        audio.src = "../../assets/audio/ting.mp3";
        audio.load();
        audio.play();
    }

    private playWrongSound() {
        console.log('wrong sound');
        let audio = new Audio();
        audio.src = "../../assets/audio/quack.mp3";
        audio.load();
        audio.play();
    }

    public playAgain() {
        // create a new game with existing users
        // add a this user to vote count
        // total votes === noPlayers
            // create new game and send them there
    }

    shuffle(array) {
        let counter = array.length;

        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(Math.random() * counter);

            // Decrease counter by 1
            counter--;

            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }

        return array;
    }

    deal(a, n, balanced) {
        if (n < 2)
            return [a];

        let len = a.length, out = [], i = 0, size;

        if (len % n === 0) {
            size = Math.floor(len / n);
            while (i < len) {
                out.push(a.slice(i, i += size));
            }
        } else if (balanced) {
            while (i < len) {
                size = Math.ceil((len - i) / n--);
                out.push(a.slice(i, i += size));
            }
        } else {
            n--;
            size = Math.floor(len / n);
            if (len % size === 0)
                size--;
            while (i < size * n) {
                out.push(a.slice(i, i += size));
            }
            out.push(a.slice(size * n));
        }
        return out;
    }

}

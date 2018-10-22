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
    public players: any;
    public playerCards: any;
    public playerCard = 0;

    score = 0;

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
            })
        );

        this.subscriptions.push(
            this.afs.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}/players`).valueChanges().subscribe(players => {
                this.players = players;
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

            for(let i = 0; i < this.players.length; i++) {
                this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}/players/${this.players[i].uid}`).update({
                    cards: dealtCards[i]
                });
                if (this.currentUser.uid === this.players[i].uid) {
                    this.playerCards = dealtCards[i];
                }
            }
            if(this.game.noPlayers === this.players.length) {
                this.startGame()
            }
        }, 1000);

    }

    private startGame() {
        console.log('startGame');
        // shuffle deck
        // deal starting card

        setTimeout(() => {
            this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).update({
                started: true
            });
        }, 250);

    }

    public snap(image) {
        if (this.game.deck6['card'+this.game.playingCard].indexOf(image) !== -1) {
            this.score++;
            // add player's card to playing deck
            this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).update({
                playingCard: this.playerCards[this.playerCard]
            });
            // remove player's card from their deck
            if (this.playerCard < this.playerCards.length) {
                this.playerCard++;
            }
            if (this.playerCards === this.playerCards.length) {
                // player wins
                // stop game
            }
        } else {
            this.score--;
        }
        this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}/players/${this.currentUser.uid}`).update({
            score: this.score
        });

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

        let len = a.length,
            out = [],
            i = 0,
            size;

        if (len % n === 0) {
            size = Math.floor(len / n);
            while (i < len) {
                out.push(a.slice(i, i += size));
            }
        }

        else if (balanced) {
            while (i < len) {
                size = Math.ceil((len - i) / n--);
                out.push(a.slice(i, i += size));
            }
        }

        else {

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

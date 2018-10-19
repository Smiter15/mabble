import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import * as firebase from 'firebase';

import { Subscription } from "rxjs/index";

import { AuthService } from "../../../_services/auth.service";
import { AlertService } from "../../../_services/alert.service";
import { LoadingService } from "../../../_services/loading.service";

import { AlertType } from "../../../_enums/alert-type.enum";

@Component({
    selector: 'app-join',
    templateUrl: './join.component.html',
    styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    public currentUser: any = null;
    public joinGameForm: FormGroup;

    private db = firebase.firestore();

    constructor(private fb: FormBuilder,
                public auth: AuthService,
                public alertService: AlertService,
                private loadingService: LoadingService,
                private router: Router) { }

    ngOnInit() {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.currentUser = user;
            })
        );

        this.joinGameForm = this.fb.group({
            gameId: ['', [Validators.required]]
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    joinGame() {
        this.db.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games`).doc(this.joinGameForm.value.gameId).get().then(game => {
            if (game.exists) {
                this.loadingService.setLoading(true);
                this.db.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.joinGameForm.value.gameId}/players`).get().then(players => {
                    const currentPlayers = players.size; // will return the collection size
                    // check game has space

                    // if user already in game dont add them just redirect

                    if (currentPlayers < game.data().noPlayers) {
                        // add user to game
                        const player = {
                            score: 0,
                            cards: {},
                            displayName: this.currentUser.displayName,
                            photoURL: this.currentUser.photoURL,
                            uid: this.currentUser.uid
                        };
                        this.db.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.joinGameForm.value.gameId}/players`).doc(this.currentUser.uid).set(player).then(player => {
                            console.log('added player through join', player);
                            this.loadingService.setLoading(false);
                            // send user to game
                            this.router.navigateByUrl('mabble/' + this.joinGameForm.value.gameId);
                        });
                    } else {
                        this.loadingService.setLoading(false);
                        this.alertService.sendAlert('Game has finished!', AlertType.Danger);
                    }
                });
                console.log("game data", game.data());
            } else {
                this.loadingService.setLoading(false);
                // alert user that game does not exist
                // doc.data() will be undefined in this case
                console.log("No such document!");
                this.alertService.sendAlert('That game does not exist!', AlertType.Danger);
            }
        });
    }

}

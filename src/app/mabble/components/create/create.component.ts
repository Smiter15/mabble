import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AngularFirestore } from "@angular/fire/firestore";

import { Subscription } from "rxjs/index";

import { AuthService } from "../../../_services/auth.service";
import { AlertService } from "../../../_services/alert.service";
import { LoadingService } from "../../../_services/loading.service";

import * as deck6 from 'src/app/mabble/decks/deck6.default.js';

@Component({
    selector: 'app-create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    public currentUser: any = null;
    public createGameForm: FormGroup;

    public noPlayersList = [
        {value: 2, viewValue: '2'},
        {value: 3, viewValue: '3'},
        {value: 4, viewValue: '4'}
    ];

    constructor(private fb: FormBuilder,
                private afs: AngularFirestore,
                public auth: AuthService,
                private alertService: AlertService,
                private loadingService: LoadingService,
                private router: Router) { }

    ngOnInit() {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.currentUser = user;
            })
        );

        this.createGameForm = this.fb.group({
            noPlayers: ['', [Validators.required]],
            noImages: [{value: '6', disabled: true}, []]
        });
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    createGame() {
        this.loadingService.setLoading(true);
        const game = {
            deck6: deck6.deck6,
            createdAt: new Date(),
            finished: false,
            noPlayers: this.createGameForm.value.noPlayers,
            playingDeck: {}
        };
        this.afs.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games`).add(game).then(game => {
            // add player
            console.log('created game ', game);
            const player = {
                score: 0,
                cards: {},
                displayName: this.currentUser.displayName,
                photoURL: this.currentUser.photoURL,
                uid: this.currentUser.uid
            };
            this.afs.collection(`mabble/ZNtkxBjM9akNP7JSgPro/games/${game.id}/players`).doc(this.currentUser.uid).set(player).then(player => {
                console.log('added player', player);
                this.loadingService.setLoading(false);
                // redirect player
                this.router.navigateByUrl('mabble/' + game.id);
            });
        });
    }

}

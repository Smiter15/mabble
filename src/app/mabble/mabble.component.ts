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

    private gameId = '';
    public game: any;

    constructor(private fb: FormBuilder,
                private afs: AngularFirestore,
                public auth: AuthService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.subscriptions.push(
            this.route.paramMap.subscribe(params => {
                if (params.get('gameId')) {
                    this.gameId = params.get('gameId');
                    this.setGame();
                }
                console.log(this.gameId);
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    private setGame() {
        console.log('set game');
        this.afs.doc(`mabble/ZNtkxBjM9akNP7JSgPro/games/${this.gameId}`).valueChanges().subscribe(game => {
            this.game = game;
            console.log(this.game);
        });
    }

}

import { Component, OnInit, OnDestroy } from '@angular/core';

import * as firebase from 'firebase';

import { Subscription } from "rxjs/index";

// Services
import { AuthService } from "./_services/auth.service";
import { LoadingService } from "./_services/loading.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{

    private db = firebase.firestore();

    private subscriptions: Subscription[] = [];
    public loading: boolean;

    constructor(public auth: AuthService,
                private loadingService: LoadingService) { }

    ngOnInit() {
        this.subscriptions.push(
            this.loadingService.isLoading().subscribe(isLoading => {
                this.loading = isLoading;
            })
        );

        this.getOnlineUsers();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    getOnlineUsers() {
        const q = this.db.collection('status').where('state', '==', 'online').get().then(
            data => {
                console.log(data);
            }
        );
    }

}

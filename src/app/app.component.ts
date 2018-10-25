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

    public onlineUsers: any;
    public onlineUserCount: number;

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
        this.db.collection('users').where('state', '==', 'online').onSnapshot(onlineUsers => {

            let tempOnlineUsers = [];
            onlineUsers.forEach(function(onlineUser) {
                tempOnlineUsers.push(onlineUser.data());
            });

            this.onlineUsers = tempOnlineUsers;
            this.onlineUserCount = onlineUsers.size;
        })
    }

}

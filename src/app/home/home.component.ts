import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from "rxjs/index";

// Services
import { AuthService } from "../_services/auth.service";
import { NotificationService } from "../_services/notification.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    message: any;

    constructor(public auth: AuthService,
                private notificationService: NotificationService) { }

    ngOnInit() {
        this.subscriptions.push(
            this.auth.currentUser.subscribe(user => {
                this.notificationService.requestPermission(user.uid);
                this.notificationService.receiveNotification();
                this.message = this.notificationService.currentMessage;
            })
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

}

import { Component, OnInit } from '@angular/core';

// Services
import { AuthService } from "../_services/auth.service";
import { NotificationService } from "../_services/notification.service";

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    message: any;

    constructor(public auth: AuthService,
                private notificationService: NotificationService) { }

    ngOnInit() {
        this.notificationService.requestPermission(this.auth.currentUserSnapshot.uid);
        this.notificationService.receiveNotification();
        this.message = this.notificationService.currentMessage;
    }

}

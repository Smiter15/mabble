import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';

// Material
import { MaterialModule } from './material.module';

// Angular Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireMessagingModule } from '@angular/fire/messaging';

// Bootstrap
import { AlertModule } from 'ngx-bootstrap';

// Components
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { ChatComponent } from './chat/chat.component';
import { ChatInputComponent } from './chat/components/chat-input/chat-input.component';
import { ChatroomListComponent } from './chat/components/chatroom-list/chatroom-list.component';
import { ChatroomTitleBarComponent } from './chat/components/chatroom-title-bar/chatroom-title-bar.component';
import { ChatMessageComponent } from './chat/components/chat-message/chat-message.component';
import { ChatroomWindowComponent } from './chat/components/chatroom-window/chatroom-window.component';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserProfileEditComponent } from './user-profile-edit/user-profile-edit.component';

import { MabbleComponent } from './mabble/mabble.component';
import { CreateComponent } from './mabble/components/create/create.component';
import { JoinComponent } from './mabble/components/join/join.component';

// Routes
import { AppRoutingModule } from './app-routing.module';

import { environment } from '../environments/environment';

import { NgxLoadingModule } from 'ngx-loading';
import { PlayAgainComponent } from './mabble/components/play-again/play-again.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule.enablePersistence(),
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        AngularFireMessagingModule,
        AlertModule.forRoot(),
        AppRoutingModule,
        NgxLoadingModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        UserProfileComponent,
        ChatComponent,
        ChatInputComponent,
        ChatroomListComponent,
        ChatroomTitleBarComponent,
        ChatMessageComponent,
        ChatroomWindowComponent,
        UserProfileEditComponent,
        HomeComponent,
        MabbleComponent,
        CreateComponent,
        JoinComponent,
        PlayAgainComponent
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

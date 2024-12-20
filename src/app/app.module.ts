import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';
import { OauthComponent } from './oauth/oauth.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    OauthComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    IconModule,
    OverlayscrollbarsModule,
    AppComponent
  ],
  providers: [
    IconSetService
  ]
})
export class AppModule { }
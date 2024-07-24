import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { OverlayscrollbarsModule } from 'overlayscrollbars-ngx';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppComponent,
    IconModule,
    OverlayscrollbarsModule
  ],
  providers: [
    IconSetService
  ]
})
export class AppModule { }
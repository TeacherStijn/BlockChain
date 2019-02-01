import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BlockService } from '../shared/services/blockservice';





@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [BlockService],
  bootstrap: [AppComponent]
})
export class AppModule { }

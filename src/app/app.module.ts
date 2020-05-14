import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SingleBarComponent } from './single-bar/single-bar.component';
import { SafePipeModule } from 'safe-pipe';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SingleBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    SafePipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

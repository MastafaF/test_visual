import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SingleBarComponent } from './single-bar/single-bar.component';
import { SafePipeModule } from 'safe-pipe';
import { HttpClientModule } from '@angular/common/http';

// Added by Mastafa for Radio button 
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SingleBarComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    // Added by Mastafa for radio button 
    FormsModule, 
    SafePipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

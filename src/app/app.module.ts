import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgxCaptchaModule} from 'ngx-captcha';
import {AppComponent} from './components/app.component';


@NgModule({
  providers: [
  ],
  imports: [ BrowserModule, FormsModule, NgxCaptchaModule ],

  declarations: [AppComponent],

  bootstrap: [ AppComponent ]

})

export class AppModule { }

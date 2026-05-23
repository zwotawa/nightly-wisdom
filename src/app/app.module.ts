import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { HomeComponent } from './home/home.component';
import { HowIWorkComponent } from './how-i-work/how-i-work.component';
import { SymbolDictionaryComponent } from './symbol-dictionary/symbol-dictionary.component';
import { NightmareSelfHelpComponent } from './nightmare-self-help/nightmare-self-help.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent, ContactFormComponent, ContactPageComponent, HomeComponent, HowIWorkComponent, SymbolDictionaryComponent, NightmareSelfHelpComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'contact', component: ContactPageComponent },
      { path: 'how-i-work', component: HowIWorkComponent },
      { path: 'symbol-dictionary', component: SymbolDictionaryComponent },
      { path: 'nightmare-self-help', component: NightmareSelfHelpComponent }
    ], {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 80]
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

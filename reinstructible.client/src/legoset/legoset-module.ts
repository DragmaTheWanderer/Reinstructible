import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule

import { LegoSetRoutingModule } from './legoset-routing-module';
import { LegoSet } from './legoset';

@NgModule({
  declarations: [
    LegoSet
  ],
  imports: [
    BrowserModule,
    FormsModule,
    
    LegoSetRoutingModule
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [LegoSet]
})
export class LegoSetModule { }

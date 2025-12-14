import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PartsRoutingModule } from './parts-routing-module';
import { Parts } from './parts';

@NgModule({
  declarations: [
   
  ],
  imports: [
    BrowserModule, 
    PartsRoutingModule,
    Parts,
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [Parts]
})
export class PartsModule { }

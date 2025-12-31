import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { StorageRoutingModule } from './storage-routing-module';
import { Storage } from './storage';

@NgModule({
  declarations: [
   
  ],
  imports: [
    BrowserModule, 
    StorageRoutingModule,
    Storage,
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [Storage]
})
export class StorageModule { }

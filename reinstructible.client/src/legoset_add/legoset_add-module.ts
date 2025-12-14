import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule

import { LegoSet_addRoutingModule } from './legoset_add-routing-module';
import { LegoSet_add } from './legoset_add';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LegoSet_add,
    LegoSet_addRoutingModule
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [LegoSet_add]
})
export class LegoSet_AddModule { }

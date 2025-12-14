import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule

import { LegoSet_ownedRoutingModule } from './legoset_owned-routing-module';
import { LegoSet_owned } from './legoset_owned';

@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    LegoSet_owned,
    LegoSet_ownedRoutingModule,
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [LegoSet_owned]
})
export class LegoSet_OwnedModule { }

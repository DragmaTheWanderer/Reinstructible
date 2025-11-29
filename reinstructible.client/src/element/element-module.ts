import { provideHttpClient } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule

import { ElementRoutingModule } from './element-routing-module';
import { Element } from './element';

@NgModule({
  declarations: [
    Element
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ElementRoutingModule
  ],
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners()
  ],
    bootstrap: [Element]
})
export class ElementModule { }

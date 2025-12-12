import { bootstrapApplication, platformBrowser } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app/app';
bootstrapApplication(App, {
  providers: [provideHttpClient()]
});

import { LegoSet_owned } from './legoset_owned/legoset_owned';
bootstrapApplication(LegoSet_owned, {
  providers: [provideHttpClient()]
});

import { LegoSet_add } from './legoset_add/legoset_add';
bootstrapApplication(LegoSet_add, {
  providers: [provideHttpClient()]
});

import { Element } from './element/element';
bootstrapApplication(Element, {
  providers: [provideHttpClient()]
});

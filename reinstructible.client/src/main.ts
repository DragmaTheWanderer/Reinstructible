import { provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication, platformBrowser } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app/app';
bootstrapApplication(App, {
  providers: [provideZoneChangeDetection(), provideHttpClient()],
});

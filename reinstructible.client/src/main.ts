import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app-module';

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));


import { ElementModule } from './element/element-module';
platformBrowser().bootstrapModule(ElementModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

import { LegoSetModule } from './legoset/legoset-module';
platformBrowser().bootstrapModule(LegoSetModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));


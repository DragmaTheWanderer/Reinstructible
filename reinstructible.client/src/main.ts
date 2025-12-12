import { platformBrowser } from '@angular/platform-browser';

//import { AppModule } from './app/app-module';
//platformBrowser().bootstrapModule(AppModule, {
//  ngZoneEventCoalescing: true,
//})
//  .catch(err => console.error(err));


import { LegoSet_OwnedModule } from './legoset_owned/legoset_owned-module';
platformBrowser().bootstrapModule(LegoSet_OwnedModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

import { LegoSet_AddModule } from './legoset_add/legoset_add-module';
platformBrowser().bootstrapModule(LegoSet_AddModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

import { ElementModule } from './element/element-module';
platformBrowser().bootstrapModule(ElementModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

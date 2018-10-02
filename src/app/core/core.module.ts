import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CspService } from '@app/core/csp.service';
import { PwaService } from '@app/core/pwa.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [
  ],
  providers: [
    PwaService,
    CspService
  ]
})
export class CoreModule {
  constructor(pwa: PwaService, csp: CspService) {
    pwa.addManifestLink();

    // in some cases ServiceWorkerModule.register does not register service worker.
    // https://github.com/angular/angular/issues/20970
    // register it manually:
    pwa.register();

    pwa.listenForUpdate();

    csp.register();
  }

  static forRoot() {
    return {
      ngModule: CoreModule,
    };
  }
}
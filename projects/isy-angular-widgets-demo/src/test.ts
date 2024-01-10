// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/testing';
import {getTestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {ɵSharedStylesHost} from '@angular/platform-browser';

// Initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
  teardown: {destroyAfterEach: true}
});

<<<<<<< HEAD
=======
// Is Fixing the component style (very slow performance) overload after each test
>>>>>>> origin
afterEach(() => getTestBed().inject(ɵSharedStylesHost).ngOnDestroy());

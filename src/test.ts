// Este archivo es requerido por karma.conf.js y carga recursivamente todos los archivos .spec y framework.

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';


declare const __karma__: any;
declare const require: any;

// Evita que el karma se ejecute prematuramente.
__karma__.loaded = function () {};

// Se inicializa el entorno de pruebas de angular
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Se encuentra todas las pruebas
const context = require.context('./', true, /\.spec\.ts$/);
// Carga los modulos
context.keys().map(context);
// Se inicia el test
__karma__.start();

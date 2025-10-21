// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Mantener la configuración de entorno y exponer la configuración de Firebase.
// La inicialización de la app Firebase se hará desde un servicio dedicado.
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyD53Ibo-XqdGtPA53bKDeilEb4wIZAymnA",
    authDomain: "crud-533c8.firebaseapp.com",
    projectId: "crud-533c8",
    // CORRECCIÓN: storageBucket correcto (antes estaba incorrecto)
    storageBucket: "crud-533c8.appspot.com",
    messagingSenderId: "431116429133",
    appId: "1:431116429133:web:eb1b9379d8c18e6c923904",
    measurementId: "G-MBS80F40FS"
  }
};

/*
 * Nota:
 * - No inicializamos Firebase aquí para evitar efectos secundarios al importar el archivo.
 * - Crearemos un servicio (`src/app/services/firebase.service.ts`) que importe
 *   esta configuración e inicialice Firebase y Firestore de forma centralizada.
 *
 * Para debugging en desarrollo, puedes descomentar la siguiente línea:
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

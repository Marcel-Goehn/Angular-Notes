import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-21fbc","appId":"1:585578306653:web:cab2ced40e397f4cdc41b4","storageBucket":"danotes-21fbc.firebasestorage.app","apiKey":"AIzaSyB67REPnkmGa7dbMW0Ww9JkojsI9wn4Srk","authDomain":"danotes-21fbc.firebaseapp.com","messagingSenderId":"585578306653"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};

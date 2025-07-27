import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  firestore = inject(Firestore);
  items$ = collectionData(this.getNotesRef());

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }


  getNotesRef() {
    return collection(this.firestore, 'notes');
  }


  getSingleDocRef(colId: string, docId: string) {
    return doc(this.firestore, colId, docId);
  }
}

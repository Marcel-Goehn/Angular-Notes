import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  firestore = inject(Firestore);
  unsubTrash;
  unsubNote;

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNote = this.subNotesList();
  }


  async addNote(item: {}) {
    await addDoc(this.getNotesRef(), item).catch(
      (err) => console.error(err) 
    ).then(
      (docRef) => console.log("Document written with ID: ", docRef?.id)
    )
  }


  ngOnDestroy() {
    this.unsubTrash();
    this.unsubNote();
  }


  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  setNoteObject(obj: any, id: string): Note {
    return {
      id: id || '',
      type: obj.type || 'note',
      title: obj.title || '',
      content: obj.content || '',
      marked: obj.marked || false
    }
  }


  getTrashRef() {
    return collection(this.firestore, 'trash');
  }


  getNotesRef() {
    return collection(this.firestore, 'notes');
  }


  // getSingleDocRef(colId: string, docId: string) {
  //   return doc(this.firestore, colId, docId);
  // }
}

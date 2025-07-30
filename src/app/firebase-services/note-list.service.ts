import { Injectable, OnDestroy, inject } from '@angular/core';
import { Firestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where } from '@angular/fire/firestore';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService implements OnDestroy {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  markedNormalNotes: Note[] = [];

  firestore = inject(Firestore);
  unsubTrash;
  unsubNote;
  unsubMarkedNote;
  

  constructor() {
    this.unsubTrash = this.subTrashList();
    this.unsubNote = this.subNotesList();
    this.unsubMarkedNote = this.subMarkedNotesList();
  }


  ngOnDestroy() {
      this.unsubTrash();
      this.unsubNote();
      this.unsubMarkedNote();
  }


  async deleteNote(colId: 'notes' | 'trash', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => console.error(err)
    )
  }


  async updateNote(note: Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJSON(note)).catch(
        (err) => console.error(err)
      )
    }
  }


  getCleanJSON(note: Note): {} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }


  getColIdFromNote(note: Note) {
    if (note.type === 'note') {
      return 'notes';
    } else {
      return 'trash'
    }
  }


  async addNote(item: Note, colId: 'notes' | 'trash') {
    await addDoc(this.addNotesRef(colId), item).catch(
      (err) => console.error(err)
    ).then(
      (docRef) => console.log("Document written with ID: ", docRef?.id)
    )
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
    const q = query(this.getNotesRef(), limit(100));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where('marked', '==', true), limit(100));
    return onSnapshot(q, (list) => {
      this.markedNormalNotes = [];
      list.forEach(element => {
        this.markedNormalNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }


  // subNotesList() {
  //   return onSnapshot(this.getNotesRef(), (list) => {
  //     this.normalNotes = [];
  //     list.forEach(element => {
  //       this.normalNotes.push(this.setNoteObject(element.data(), element.id));
  //     })
  //   });
  // }


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


  addNotesRef(colId: 'notes' | 'trash') {
    if (colId === 'notes') {
      return collection(this.firestore, 'notes');
    } else {
      return collection(this.firestore, 'trash');
    }
  }


  getSingleDocRef(colId: string, docId: string) {
    return doc(this.firestore, colId, docId);
  }
}

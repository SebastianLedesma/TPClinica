import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Especialista } from '../clases/especialista.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private _firestore: Firestore) { }

  async agregarDoc(nuevo:any,nombre: string, id: string){
    return await setDoc(doc(this._firestore, nombre, id), nuevo);
  }

  obtenerDocs(nombreCollection:string){
    const mensajeRef = collection(this._firestore, nombreCollection);
    return collectionData(mensajeRef, {idField:'id'}) as Observable<any[]>;
  }

  async obtenerDoc(nombreCollection:string, id:string){
    const docRef = doc(this._firestore, nombreCollection, id);
    const resp =  await getDoc(docRef);

    return resp;
  }
}

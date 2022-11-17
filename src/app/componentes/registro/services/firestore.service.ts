import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, getDoc, getDocs, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Especialista } from '../clases/especialista.class';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private _firestore: Firestore) { }

  async agregarDoc(nuevo: any, nombre: string, id: string) {
    return await setDoc(doc(this._firestore, nombre, id), nuevo);
  }

  obtenerDocs(nombreCollection: string) {
    const mensajeRef = collection(this._firestore, nombreCollection);
    return collectionData(mensajeRef, { idField: 'id' }) as Observable<any[]>;
  }

  async obtenerDoc(nombreCollection: string, id: string) {
    const docRef = doc(this._firestore, nombreCollection, id);
    const resp = await getDoc(docRef);

    return resp;
  }

  async obtenerDocsPorId(nombreColeccion: string, id: string) {

    let registros: any[] = [];

    const q = query(collection(this._firestore, nombreColeccion), where("id_paciente", "==", id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      registros.push(doc.data());
    });

    return registros;
  }

  actualizar(registros:any,id:string){
    const actualizarRef = doc(this._firestore,`log_ingresos/${id}`);
    return updateDoc(actualizarRef,{...registros});
  }
  
}

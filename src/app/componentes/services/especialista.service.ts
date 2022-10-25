import { Injectable } from '@angular/core';
import { doc, Firestore } from '@angular/fire/firestore';
import { updateDoc } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  constructor(private _firestore: Firestore) { }

  async cambiarEstadoEspecialista(id:string,estado:boolean){
    const ref = doc(this._firestore,'especialistas',id);
    await updateDoc(ref,{
      habilitado:estado
    });
  }
}

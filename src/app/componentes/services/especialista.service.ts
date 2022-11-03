import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { updateDoc } from '@firebase/firestore';
import { Especialista } from '../registro/clases/especialista.class';
import { TurnoDiponible } from '../home/clases/turno-disponible.component.class';

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {

  constructor(private _firestore: Firestore) { }

  async agregarTurno(turno:TurnoDiponible){
    const docRef = await addDoc(collection(this._firestore, "turnos_disponibles"),{
      id_especialista: turno.id_especialista,
      fecha: turno.fecha,
      especialidad: turno.especialidad,
      nombreEspecialista: turno.nombreEspecialista
    });
    return docRef;
  }

  async obtenerDoc(nombreCollection:string, id:string){
    const docRef = doc(this._firestore, nombreCollection, id);
    const resp =  await getDoc<Especialista>(docRef);

    return resp;
  }

  async cambiarEstadoEspecialista(id:string,estado:boolean){
    const ref = doc(this._firestore,'especialistas',id);
    await updateDoc(ref,{
      habilitado:estado
    });
  }
}

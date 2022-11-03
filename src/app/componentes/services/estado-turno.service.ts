import { Injectable } from "@angular/core";
import { deleteDoc, doc, Firestore, setDoc, updateDoc } from "@angular/fire/firestore";



@Injectable({
    providedIn: 'root'
})
export class EstadoTurnoService {

    constructor(private _firestore: Firestore) { }

    async agregarEstadoTurno(turno: any, uid: string) {
        await setDoc(doc(this._firestore, 'estado_turnos', uid), turno);
    }

    async cambiarAReservado(id: string) {
        const docRef = doc(this._firestore,'estado_turnos', id);
        await updateDoc(docRef, {
            reservado: true,
            disponible:false
        })
    }

    async cambiarACancelado(id: string) {
        const docRef = doc(this._firestore,'estado_turnos', id);
        await updateDoc(docRef, {
            reservado: false,
            aceptado: false,
            cancelado:true
        })
    }

    async cambiarARechazado(id: string) {
        const docRef = doc(this._firestore,'estado_turnos', id);
        await updateDoc(docRef, {
            reservado: false,
            rechazado: false
        })
    }

    async cambiarACalificado(id: string) {
        const docRef = doc(this._firestore,'estado_turnos', id);
        await updateDoc(docRef, {
            calificacion:true
        })
    }

    async cambiarAFinalizado(id: string) {
        const docRef = doc(this._firestore,'estado_turnos', id);
        await updateDoc(docRef, {
            aceptado: false,
            finalizado:true
        })
    }

    async cambiarAAceptado(id: string) {
        const docRef = doc(this._firestore,'estado_turnos', id);
        await updateDoc(docRef, {
            reservado: false,
            aceptado: true,
        })
    }

    async borrarTurno(nombreColleccion:string,id: string) {
        await deleteDoc(doc(this._firestore, nombreColleccion, id));
    }
}
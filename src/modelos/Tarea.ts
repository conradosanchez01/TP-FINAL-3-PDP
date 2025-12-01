// src/modelos/Tarea.ts
import { Estado, Dificultad, EstadoLabels, DificultadLabels } from "./Tipos";

export class Tarea {
    // Al ser static funciona como un contador global dentro de la clase
    private static secuenciaId = 0;

    // Propiedades de instancia
    private _id: string; 
    private _titulo: string;
    private _descripcion: string;
    private _estado: Estado;
    private _dificultad: Dificultad;
    private _fechaCreacion: Date;
    private _fechaVencimiento: Date | null;
    private _activo: boolean; 

    constructor(
        titulo: string,
        descripcion: string,
        estado: Estado = "p",
        dificultad: Dificultad = "f",
        vencimiento: Date | null = null
    ) {
        // Cada vez que hacemos "new Tarea", sumamos 1 al contador 
        Tarea.secuenciaId++;
        this._id = Tarea.secuenciaId.toString();
        this._titulo = titulo;
        this._descripcion = descripcion;
        this._estado = estado;
        this._dificultad = dificultad;
        this._fechaVencimiento = vencimiento;
        this._fechaCreacion = new Date();
        this._activo = true; //se crea activa
    }

    // --- GETTERS
    get id() { return this._id; }
    get titulo() { return this._titulo; }
    get descripcion() { return this._descripcion; }
    get estado() { return this._estado; }
    get dificultad() { return this._dificultad; }
    get fechaCreacion() { return this._fechaCreacion; }
    get fechaVencimiento() { return this._fechaVencimiento; }
    get estaActiva() { return this._activo; }

    // --- SETTERS
    set titulo(nuevoTitulo: string) {
        if (!nuevoTitulo.trim()) throw new Error("El título no puede estar vacío");
        this._titulo = nuevoTitulo;
    }

    set estado(nuevoEstado: Estado) {
        this._estado = nuevoEstado;
    }

    set dificultad(nuevaDificultad: Dificultad) {
        this._dificultad = nuevaDificultad;
    }

    set descripcion(nuevaDesc: string) {
        this._descripcion = nuevaDesc;
    }

    // --- METODOS
    // Eliminacion logica
    eliminar(): void {
        this._activo = false;
    }

    restaurar(): void {
        this._activo = true;
    }
    // Tarea a Texto
    toString(): string {
        const estadoStr = EstadoLabels[this._estado];
        const difStr = DificultadLabels[this._dificultad];
        return `${this._titulo} [${estadoStr}] - Dificultad: ${difStr}`;
    }
}
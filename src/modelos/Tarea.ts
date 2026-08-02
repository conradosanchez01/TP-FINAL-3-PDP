// src/modelos/Tarea.ts
import { Estado, Dificultad, EstadoLabels, DificultadLabels } from "./Tipos";


/**
 * Representa una entidad de Tarea dentro del sistema.
 * Encapsula el estado, la información y el comportamiento de una tarea individual.
 */
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
/**
     * Crea una nueva instancia de Tarea.
     * @param titulo - El título descriptivo de la tarea.
     * @param descripcion - Detalles adicionales sobre lo que se debe hacer.
     * @param estado - Estado actual (por defecto "p" - Pendiente).
     * @param dificultad - Nivel de complejidad (por defecto "f" - Fácil).
     * @param vencimiento - Fecha límite opcional (Date o null).
     */
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

    set fechaVencimiento(nuevaFecha: Date | null) {
        this._fechaVencimiento = nuevaFecha;
    }
    // --- METODOS
    /**
     * Realiza un borrado lógico (Soft Delete) de la tarea, marcándola como inactiva.
     */
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
        return `Titulo: ${this._titulo} - Estado: ${estadoStr} - Dificultad: ${difStr}`;
   
    }
}
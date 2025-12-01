// src/negocio/GestorTareas.ts
import { Tarea } from "../modelos/Tarea";
import { EstrategiaOrdenamiento } from "../modelos/Ordenamiento";

export class GestorTareas {
    //lista
    private tareas: Tarea[] = [];

    // agrega tarea a la lista
    agregarTarea(tarea: Tarea): void {
        this.tareas.push(tarea);
    }

    // busca, filtra y ordena la lsita
    buscarTareas(
        //hay que pasarle una instancia de una clase que compla el contrato de ordenar
        estrategia: EstrategiaOrdenamiento, 
        //predicado opcional,
        predicado?: (t: Tarea) => boolean  
    ): Tarea[] {
        // 1 filtra las inactivas/borradas
        let resultado = this.tareas.filter(t => t.estaActiva);

        if (predicado) {
            resultado = resultado.filter(predicado);
        }

        // 2 ordena segun el tipo de instancia fecha, titulo, dificultad
        return estrategia.ordenar(resultado);
    }

    // obteniene una tarea por ID
    obtenerPorId(id: string): Tarea | undefined {
        return this.tareas.find(t => t.id === id && t.estaActiva);
    }

    // Eliminacion Logica o Soft Delete no borra solo cambia como inactivo
    eliminarTarea(id: string): boolean {
        const tarea = this.obtenerPorId(id);
        if (tarea) {
            tarea.eliminar(); // metodo definido en tarea
            return true;
        }
        return false;
    }
    
    
}
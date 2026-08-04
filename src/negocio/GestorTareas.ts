// src/negocio/GestorTareas.ts
import { Tarea } from "../modelos/Tarea";
import { EstrategiaOrdenamiento } from "../modelos/Ordenamiento";
/**
 * Administra la colección principal de tareas en memoria.
 * Es responsable de aplicar búsquedas, filtros lógicos y delegar los ordenamientos.
 */
export class GestorTareas {
    //lista
    private tareas: Tarea[] = [];

    // agrega tarea a la lista
    agregarTarea(tarea: Tarea): void {
        this.tareas.push(tarea);
    }

    // busca, filtra y ordena la lsita
    /**
     * Busca tareas activas aplicando una estrategia de ordenamiento y un filtro opcional.
     * Combina programación funcional (filter) con polimorfismo (estrategia).
     * 
     * @param estrategia - Objeto que cumple el contrato de EstrategiaOrdenamiento.
     * @param predicado - Función lógica opcional que evalúa si una tarea debe incluirse.
     * @returns Un arreglo de tareas filtrado y ordenado.
     */
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
    /**
     * Busca una tarea específica mediante su identificador único.
     * @param id - El identificador numérico (en formato string) de la tarea.
     * @returns La instancia de la Tarea si existe y está activa, o undefined en caso contrario.
     */
    obtenerPorId(id: string): Tarea | undefined {
        return this.tareas.find(t => t.id === id && t.estaActiva);
    }

    // Eliminacion Soft Delete no borra solo cambia como inactivo
    eliminarTarea(id: string): boolean {
        const tarea = this.obtenerPorId(id);
        if (tarea) {
            tarea.eliminar(); // metodo definido en tarea
            return true;
        }
        return false;
    }
    
    // Restauración de tarea eliminada lógicamente
    restaurarTarea(id: string): boolean {
        // Buscamos específicamente una que NO esté activa
        const tarea = this.tareas.find(t => t.id === id && !t.estaActiva);
        if (tarea) { //objeto con datos es considerado Truthy (tiene existencia,entra) o falsy undefined (no existe, no tiene nada, no entra)
            tarea.restaurar(); // Llama al método de Tarea.ts
            return true;
        }
        return false; // No se encontró la tarea o ya estaba activa
    }



    
}
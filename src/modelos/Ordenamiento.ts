// src/modelos/Ordenamiento.ts
import { Tarea } from "./Tarea";
import { Dificultad } from "./Tipos";

// 1 La Interfaz (es el contrato que todos deben cumplir todas las formas de ordenar)
export interface EstrategiaOrdenamiento {
    ordenar(tareas: Tarea[]): Tarea[];
}

// 2 Estrategia: ordena por titulo alfabeticamente
export class OrdenarPorTitulo implements EstrategiaOrdenamiento {
    ordenar(tareas: Tarea[]): Tarea[] {
       // usamos [...tareas] para hacer una copia y no romper el array original
        return [...tareas].sort((a, b) => a.titulo.localeCompare(b.titulo));
    }
}

// 3. Estrategia: ordena por fecha de creacion (mas viejo a mas nuevo)
export class OrdenarPorFechaCreacion implements EstrategiaOrdenamiento {
    ordenar(tareas: Tarea[]): Tarea[] {
        return [...tareas].sort((a, b) => a.fechaCreacion.getTime() - b.fechaCreacion.getTime());
    }
}

// 4. Estrategia: ordena por dificultad (facil -> intermedio -> dificil)
export class OrdenarPorDificultad implements EstrategiaOrdenamiento {
    ordenar(tareas: Tarea[]): Tarea[] {
        // le damos un valor numerico a cada dificultad para poder comparar
        const pesos: Record<Dificultad, number> = {
            'f': 1, // facil vale 1
            'i': 2, // intermedio vale 2
            'd': 3  // dificil vale 3
        };

        return [...tareas].sort((a, b) => {
            const pesoA = pesos[a.dificultad];
            const pesoB = pesos[b.dificultad];
            return pesoA - pesoB;
        });
    }
}
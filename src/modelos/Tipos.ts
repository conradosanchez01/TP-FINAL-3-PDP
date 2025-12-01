// src/modelos/Tipos.ts

// listas de valores validos y fijas (al usar as const no se pueden modificar)
export const ESTADOS = ["p", "e", "t", "c"] as const;
export const DIFICULTADES = ["f", "i", "d"] as const;

/// creamos el tipo de dato basandonos en los valores de las listas de arriba
// esto permite que typescript sepa que "Estado" solo puede ser 'p', 'e', 't' o 'c'
//como es un array entra a ver las posiciones de cada uno y el contenido es la letra por eso es [number]
export type Estado = typeof ESTADOS[number];
export type Dificultad = typeof DIFICULTADES[number];

// diccionarios para mostrar el texto completo en lugar de solo la letra codigo
export const EstadoLabels: Record<Estado, string> = {
    p: "Pendiente",
    e: "En Curso",
    t: "Terminado",
    c: "Cancelado"
};

export const DificultadLabels: Record<Dificultad, string> = {
    f: "Facil",
    i: "Intermedio",
    d: "Dificil"
};
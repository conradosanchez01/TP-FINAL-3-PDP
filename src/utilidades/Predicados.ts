// src/utilidades/Predicados.ts
import { Tarea } from "../modelos/Tarea";

// Definimos el "Tipo" de un predicado: Una funcion que recibe una tarea y dice SI o NO.
export type Predicado = (t: Tarea) => boolean;

// 1 predicados simples
//funciones flecha que chequean una sola cosa
export const esDificil: Predicado = (t) => t.dificultad === 'd';
export const esFacil: Predicado = (t) => t.dificultad === 'f';

export const estaPendiente: Predicado = (t) => t.estado === 'p';
export const estaEnCurso: Predicado = (t) => t.estado === 'e';
export const estaTerminada: Predicado = (t) => t.estado === 't';

// Este es un "Generador de Predicados" (Currying básico)
//Recibe un texto y devuelve UNA FUNCION nueva que sabe buscar ese texto
// Nos permite crear reglas dinámicas como: tieneTitulo("urgente") p/agregar en el menu de busqueda
export const tituloContiene = (texto: string): Predicado => {
    return (t) => t.titulo.toLowerCase().includes(texto.toLowerCase());
};

// 2 combinadores logicos
// Estas funciones nos permiten combinar predicados 
// Funcion "Y" (AND): Devuelve true solo si TODOS los predicados se cumplen
// Recibe una lista de funciones (...) y las prueba una por una
export const y = (...predicados: Predicado[]): Predicado => {
    return (t) => predicados.every(p => p(t));
};

// Función "O" (OR): Devuelve true si AL MENOS UNA condicion se cumple
export const o = (...predicados: Predicado[]): Predicado => {
    return (t) => predicados.some(p => p(t));
};

// Funcion "NO" (NOT): Invierte el resultado, si era TRUE devuelve FALSE
export const no = (predicado: Predicado): Predicado => {
    return (t) => !predicado(t);
};

// --- 3. REGLAS COMPLEJAS (Hechos de Negocio)
// Definimos que es una "Tarea Critica": Es Dificil Y esta Pendiente
export const esCritica = y(esDificil, estaPendiente);

// Definimos "Tareas Activas": Pendientes O En Curso
export const esActiva = o(estaPendiente, estaEnCurso);

// Definimos "Tarea Simple": NO es dificil
export const esSimple = no(esDificil);


import { ESTADOS_VALIDOS, DIFICULTADES_VALIDAS } from "./constantes";

export function esEntero(str: string): boolean {
  const n = Number(str);
  return Number.isInteger(n);
}

export function esEstadoValido(letra: string): boolean {
  for (let i = 0; i < ESTADOS_VALIDOS.length; i++) {
    if (ESTADOS_VALIDOS[i] === letra) return true;
  }
  return false;
}

export function esDificultadValida(letra: string): boolean {
  for (let i = 0; i < DIFICULTADES_VALIDAS.length; i++) {
    if (DIFICULTADES_VALIDAS[i] === letra) return true;
  }
  return false;
}

import { input } from "./io";
import { esEntero } from "./validaciones";

export type Tarea = {
  titulo: string;
  descripcion: string;
  estado: string;
  dificultad: string;
  vencimiento: string;
};

export async function leerOpcion(mensaje: string, min: number, max: number): Promise<number> {
  while (true) {
    const r = await input(mensaje);
    if (esEntero(r)) {
      const n = parseInt(r, 10);
      if (n >= min && n <= max) return n;
    }
    console.log(` Ingrese un número entre ${min} y ${max}.`);
  }
}

export function estadoTexto(c: string): string {
  switch ((c || "").toLowerCase()) {
    case "p": return "pendiente";
    case "e": return "en curso";
    case "t": return "terminada";
    case "c": return "cancelada";
    default: return "desconocido";
  }
}

export function dificultadTexto(c: string): string {
  switch ((c || "").toLowerCase()) {
    case "f": return "fácil";
    case "i": return "intermedio";
    case "d": return "difícil";
    default: return "desconocida";
  }
}

export function imprimirListado(listado: Tarea[]): void {
  if (!listado || listado.length === 0) {
    console.log("\nNo hay tareas para mostrar.");
    return;
  }
  console.log("\n#  Título (estado) - dificultad");
  console.log("---------------------------------------------");
  for (let i = 0; i < listado.length; i++) {
    const t = listado[i];
    const titulo = t.titulo.length > 40 ? t.titulo.slice(0, 37) + "..." : t.titulo;
    console.log(`${String(i + 1).padStart(2, " ")}. ${titulo} (${estadoTexto(t.estado)}) - ${dificultadTexto(t.dificultad)}`);
  }
}

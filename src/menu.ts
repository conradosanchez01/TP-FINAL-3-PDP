import { leerOpcion, imprimirListado, Tarea, estadoTexto } from "./utilidades";
import { esperarEnter, input } from "./io";
import { tareas, agregarTarea, verDetallesTarea } from "./tareas";

export function mostrarMenuPrincipal(): void {
  console.clear();
  console.log("Hola Olivia!");
  console.log("¿Qué deseas hacer?");
  console.log("1) Ver mis tareas");
  console.log("2) Agregar tarea");
  console.log("3) Buscar tarea");
  console.log("0) Salir");
}

export async function menuVerMisTareas(): Promise<void> {
  while (true) {
    console.clear();
    console.log("=== Ver mis tareas ===");
    console.log("1) Todas");
    console.log("2) Pendientes");
    console.log("3) En curso");
    console.log("4) Terminadas");
    console.log("0) Volver");

    const op = await leerOpcion("Opción: ", 0, 4);
    if (op === 0) return;

    let filtro: string | null = null;
    if (op === 2) filtro = "p";
    if (op === 3) filtro = "e";
    if (op === 4) filtro = "t";

    const listado: Tarea[] = [];
    if (filtro === null) {
      for (let i = 0; i < tareas.length; i++) listado[listado.length] = tareas[i];
    } else {
      for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].estado === filtro) listado[listado.length] = tareas[i];
      }
    }

    console.clear();
    console.log(`=== Listado (${filtro ? estadoTexto(filtro) : "todas"}) ===`);
    imprimirListado(listado);

    if (listado.length === 0) { await esperarEnter(); continue; }

    const num = await leerOpcion("Ingrese el número de tarea o 0 para volver: ", 0, listado.length);
    if (num === 0) continue;

    await verDetallesTarea(listado[num - 1]);
  }
}

export async function buscarTarea(): Promise<void> {
  while (true) {
    console.clear();
    console.log("=== Buscar tarea ===");
    const busq = await input("Buscar (0 para volver): ");
    if (busq === "0") return;

    const q = busq.trim().toLowerCase();
    if (!q) { console.log(" Debe ingresar un texto."); await esperarEnter(); continue; }

    const encontrado: Tarea[] = [];
    for (let i = 0; i < tareas.length; i++) {
      if (tareas[i].titulo.toLowerCase().indexOf(q) !== -1) {
        encontrado[encontrado.length] = tareas[i];
      }
    }

    if (encontrado.length === 0) { console.log("No se encontraron tareas."); await esperarEnter(); continue; }

    imprimirListado(encontrado);
    const num = await leerOpcion("Ingrese el número de tarea o 0 para volver: ", 0, encontrado.length);
    if (num === 0) continue;

    await verDetallesTarea(encontrado[num - 1]);
  }
}

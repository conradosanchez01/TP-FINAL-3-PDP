import { MAX_TITULO, MAX_DESC } from "./constantes";
import { esEstadoValido, esDificultadValida } from "./validaciones";
import { input, esperarEnter } from "./io";
import { Tarea, estadoTexto, dificultadTexto } from "./utilidades";

export let tareas: Tarea[] = [];

// AGREGAR
export async function agregarTarea(): Promise<void> {
  console.clear();
  console.log("=== Estás creando una tarea nueva ===\n");


  let titulo: string;
  while (true) {
    console.log(`1- Ingresa el título (máx ${MAX_TITULO} caracteres):`);
    titulo = await input("> ");
    if (!titulo) { console.log(" El título no puede estar vacío."); continue; }
    if (titulo.length > MAX_TITULO) { console.log(` Excede ${MAX_TITULO}.`); continue; }
    break;
  }

  console.log(`\n2- Ingresa la descripción (opcional, máx ${MAX_DESC} caracteres).`);
  let descripcion = await input("> ");
  if (descripcion.length > MAX_DESC) descripcion = descripcion.slice(0, MAX_DESC);

  let estado = "p";
  while (true) {
    console.log("\n3- Estado: P=pending, E=en curso, T=terminada, C=cancelada");
    let e = (await input("> ")).toLowerCase();
    if (!e) break;
    if (e.length === 1 && esEstadoValido(e)) { estado = e; break; }
    console.log(" Entrada inválida.");
  }

  let dificultad = "f";
  while (true) {
    console.log("\n4- Dificultad: F=fácil, I=intermedio, D=difícil");
    let d = (await input("> ")).toLowerCase();
    if (!d) break;
    if (d.length === 1 && esDificultadValida(d)) { dificultad = d; break; }
    console.log(" Entrada inválida.");
  }

  console.log('\n5- Vencimiento (no implementado, presione Enter).');
  await input("> ");

  tareas[tareas.length] = { titulo, descripcion, estado, dificultad, vencimiento: "" };
  console.log("\n Tarea agregada.");
  await esperarEnter();
}

// EDITAR
export async function menuEditarTarea(idx: number): Promise<void> {
  const tarea = tareas[idx];
  console.clear();
  console.log("=== Edición de tarea ===");

  while (true) {
    console.log(`Título actual: ${tarea.titulo}`);
    const entrada = await input("Nuevo título: ", false);
    if (entrada === "") break;
    const nuevo = entrada.trim();
    if (!nuevo) { console.log(" No puede quedar vacío."); continue; }
    if (nuevo.length > MAX_TITULO) { console.log(` Excede ${MAX_TITULO}.`); continue; }
    tarea.titulo = nuevo;
    break;
  }

  while (true) {
    console.log(`Descripción actual: ${tarea.descripcion || "Sin datos"}`);
    const entrada = await input("Nueva descripción: ", false);
    if (entrada === "") break;
    const nuevo = entrada.trim();
    if (nuevo.length > MAX_DESC) { console.log(` Excede ${MAX_DESC}.`); continue; }
    tarea.descripcion = nuevo;
    break;
  }

  while (true) {
    console.log(`Estado actual: ${estadoTexto(tarea.estado)} (${tarea.estado})`);
    const entrada = (await input("> ")).toLowerCase();
    if (!entrada) break;
    if (esEstadoValido(entrada)) { tarea.estado = entrada; break; }
    console.log(" Entrada inválida.");
  }

  while (true) {
    console.log(`Dificultad actual: ${dificultadTexto(tarea.dificultad)} (${tarea.dificultad})`);
    const entrada = (await input("> ")).toLowerCase();
    if (!entrada) break;
    if (esDificultadValida(entrada)) { tarea.dificultad = entrada; break; }
    console.log(" Entrada inválida.");
  }

  console.log("\n Cambios guardados.");
  await esperarEnter();
}

// DETALLES
export async function verDetallesTarea(tareaObj: Tarea): Promise<void> {
  while (true) {
    console.clear();
    console.log("=== Detalles de la tarea ===");
    console.log("Título:", tareaObj.titulo);
    console.log("Descripción:", tareaObj.descripcion || "Sin datos");
    console.log("Estado:", estadoTexto(tareaObj.estado), `(${tareaObj.estado})`);
    console.log("Dificultad:", dificultadTexto(tareaObj.dificultad), `(${tareaObj.dificultad})`);
    console.log("\nOpciones: e) Editar | 0) Volver");
    const r = (await input("Opción: ")).toLowerCase();
    if (r === "0") return;
    if (r === "e") {
      let idx = -1;
      for (let i = 0; i < tareas.length; i++) {
        if (tareas[i] === tareaObj) { idx = i; break; }
      }
      if (idx === -1) { console.log("Error."); await esperarEnter(); return; }
      await menuEditarTarea(idx);
      return;
    }
  }
}

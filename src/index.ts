import { mostrarMenuPrincipal, menuVerMisTareas, buscarTarea } from "./menu";
import { agregarTarea } from "./tareas";
import { leerOpcion } from "./utilidades";
import { closeIO } from "./io";

async function main(): Promise<void> {
  let salir = false;
  while (!salir) {
    mostrarMenuPrincipal();
    const opcion = await leerOpcion("Opción: ", 0, 3);
    switch (opcion) {
      case 1: await menuVerMisTareas(); break;
      case 2: await agregarTarea(); break;
      case 3: await buscarTarea(); break;
      case 0: salir = true; break;
    }
  }
  console.log("\n¡Hasta luego!");
  closeIO();
}

main();

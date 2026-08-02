// src/index.ts
import { input, closeIO, esperarEnter } from "./io";
import { GestorTareas } from "./negocio/GestorTareas";
import { Tarea } from "./modelos/Tarea";
import { 
    OrdenarPorTitulo, 
    OrdenarPorFechaCreacion, 
    OrdenarPorDificultad, 
    EstrategiaOrdenamiento 
} from "./modelos/Ordenamiento";
import {
    estaPendiente, 
    esDificil, 
    esCritica, 
    Predicado 
} from "./utilidades/Predicados";
import { Estado, Dificultad, EstadoLabels, DificultadLabels } from "./modelos/Tipos";

// Instancias el gestor
const gestor = new GestorTareas();

async function main() {
    let salir = false;

    while (!salir) {
        console.clear();
        console.log("=== GESTOR MULTIPARADIGMA ===");
        console.log("1. Ver Tareas (Listar/Filtrar/Ordenar)");
        console.log("2. Agregar Tarea");
        console.log("3. Eliminar Tarea");
        console.log("4. Editar Tarea");
        console.log("5. Buscar Tarea por ID");
        console.log("0. Salir");

        const opcion = await input("Seleccione una opcion: ");

        switch (opcion) {
            case "1":   await menuListar();      break;
            case "2":   await menuAgregar();     break;
            case "3":   await menuEliminar();    break;
            case "4":    await menuEditar();     break;
            case "5":    await menuBuscarPorId(); break;
            case "0":   salir = true;       break;

            default:
                console.log("Opcion no valida");
                await esperarEnter();
        }
    }
    closeIO();
    console.log("Adios!");
}

// -- submenus

async function menuListar() {
    console.clear();
    console.log("--- COMO QUERES VERLAS? ---");
    
    // 1 Elegir estrategia de ordenamiento
    console.log("Orden:");
    console.log("1. Por Título (A-Z)");
    console.log("2. Por Dificultad (Facil -> Dificil)");
    console.log("3. Por Fecha de Creación (Viejo -> Nuevo)");
    
    const opOrden = await input("Opcion de orden (Predeterminado por fecha de creacion): ");
    let estrategia: EstrategiaOrdenamiento;

    // Polimorfismo: Asignamos diferentes objetos que cumplen la misma interfaz
    switch (opOrden) { 
        
        case "1": estrategia = new OrdenarPorTitulo(); break;
        case "2": estrategia = new OrdenarPorDificultad(); break;
        case"3":
     default:  estrategia = new OrdenarPorFechaCreacion(); break;
    }

    // 2 Elegir Predicado - filtros - Programacion Logica
    console.log("\nFiltros:");
    console.log("1. Ver Todas");
    console.log("2. Solo Pendientes");
    console.log("3. Solo Difíciles");
    console.log("4. Tareas CRÍTICAS (Pendientes Y Difíciles)"); 

    const opFiltro = await input("Opción de filtro (Predeterminado muestra todo sin filtrar): ");
    let predicado: Predicado | undefined;

    switch (opFiltro) {
        case "2": predicado = estaPendiente; break;
        case "3": predicado = esDificil; break;
        case "4": predicado = esCritica; break; 
        // Sin filtro, muestra todo sin filtrar
        default: predicado = undefined; break; 
    }

    // 3 Ejecuta busqueda en el gestor-programacion funcional
    const tareas = gestor.buscarTareas(estrategia, predicado);

    // 4 Presentacion
    console.log("\n--- RESULTADOS ---");
    if (tareas.length === 0) {
        console.log("No se encontraron tareas con ese criterio.");
    } else {
        tareas.forEach(t => {
            
            console.log(`[ID: ${t.id}] ${t.toString()}`);

        });
    }
    await esperarEnter();
}

async function menuAgregar() {
    console.clear();
    console.log("--- NUEVA TAREA ---");
    
    // Validaciones simples de entrada - Estructurada
    const titulo = await input("Titulo: ");
    if (!titulo) {
        console.log("El titulo es obligatorio.");
        await esperarEnter();
        return;
    }
    const desc = await input("Descripcion: ");
    
    const estadoInput = await input("Estado (p/e/t/c) e=En curso t=Terminada c=Cancelada [p] = (predeterminado) pendiente : ");
    
    const estado = (["p","e","t","c"].includes(estadoInput) ? estadoInput : "p") as Estado;
// validacion de dificultad
    const difInput = await input("Dificultad (f/i/d) i=Intermedia d=Dificil [f] =  (predeterminado) facil : ");
    const dificultad = (["f","i","d"].includes(difInput) ? difInput : "f") as Dificultad;

// fecha de vencimiento
const vencimientoInput = await pedirFechaValida("Fecha de vencimiento (AAAA-MM-DD) o presiona Enter para omitir: ");
// Si apretó Enter (undefined) o puso 0 (null), queda en null. Sino, guarda la fecha.
    const vencimiento = vencimientoInput === undefined ? null : vencimientoInput;

  // creamos el objeto tarea 
    const nuevaTarea = new Tarea(titulo, desc, estado, dificultad,vencimiento);
    //y lo mandamos al gestor
    gestor.agregarTarea(nuevaTarea);
    console.log("Tarea agregada con exito!");
    await esperarEnter();
}

async function menuEliminar() {
    console.clear();
    console.log("--- ELIMINAR TAREA ---");
    const id = await input("Ingresa el ID exacto de la tarea: ");
    
    // buscamos la tarea por id - trabajo del gestor 
    const tarea = gestor.obtenerPorId(id);

    if (tarea) {
        const confirm = await input(`¿Eliminar "${tarea.titulo}"? (s/n): `);
        if (confirm.toLowerCase() === 's') {
            gestor.eliminarTarea(id);
            console.log("Tarea eliminada.");
        }
    } else {
        console.log("No se encontró tarea activa con ese ID.");
    }
    await esperarEnter();
}

async function menuEditar() {
    console.clear();
    console.log("--- EDITAR TAREA ---");
    const id = await input("Ingresa el ID de la tarea a editar: ");

    // buscamos la tarea por id - trabajo del gestor 
    const tarea = gestor.obtenerPorId(id);

    if (!tarea) {
        console.log("No se encontro ninguna tarea activa con ese ID.");
        await esperarEnter();
        return;
    }

    console.log(`\nEditando: ID: [${tarea.id}]- Titulo:${tarea.titulo}`);
    console.log("(Deja vacío y presiona Enter para mantener el valor actual)");

    // 1 EDITAR TITULO
    const nuevoTitulo = await input(`Título actual [${tarea.titulo}]: `);
    if (nuevoTitulo.trim() !== "") {
        tarea.titulo = nuevoTitulo; // usa el setter de tarea
    }

    // 2 EDITAR DESCRIPCION
    const nuevaDesc = await input(`Descripción actual [${tarea.descripcion}]: `);
    if (nuevaDesc.trim() !== "") {
        tarea.descripcion = nuevaDesc;
    }

    // 3 EDITAR ESTADO
  console.log(`Estado actual: ${EstadoLabels[tarea.estado]}`);
    const nuevoEstadoInput = await input("Nuevo estado (p/e/t/c): ");
    if (nuevoEstadoInput.trim() !== "") {
        if (["p", "e", "t", "c"].includes(nuevoEstadoInput)) {
            tarea.estado = nuevoEstadoInput as Estado;
        } else {
            console.log(" Estado invalido, se mantiene el anterior.");
        }
    }

    // 4 EDITAR DIFICULTAD
   console.log(`Dificultad actual: ${DificultadLabels[tarea.dificultad]}`);
    const nuevaDifInput = await input("Nueva dificultad (f/i/d): ");
    if (nuevaDifInput.trim() !== "") {
        if (["f", "i", "d"].includes(nuevaDifInput)) {
            tarea.dificultad = nuevaDifInput as Dificultad;
        } else {
            console.log(" Dificultad inválida, se mantiene la anterior.");
        }
    }

// 5 EDITAR VENCIMIENTO
const vencActual = tarea.fechaVencimiento 
        ? tarea.fechaVencimiento.toLocaleDateString() 
        : "(Sin vencimiento)";
    console.log(`Vencimiento actual: ${vencActual}`);
    
    // Le pasamos un aviso de que si presiona Enter se mantiene ,0 se borra el vencimiento.
    const nuevaFecha = await pedirFechaValida("Nuevo vencimiento (AAAA-MM-DD) o Enter para mantener, o '0' para borrar: ");
    // Actualizamos usando el setter que creamos en Tarea.ts
   // Solo actualizamos si el usuario NO apretó Enter
    if (nuevaFecha !== undefined) {
        tarea.fechaVencimiento = nuevaFecha; 
    }


    console.log("\nTarea actualizada correctamente!");
    // Mostramos como quedo
    console.log(`Resultante: ${tarea.toString()}`);
    await esperarEnter();
}

async function menuBuscarPorId() {
    console.clear();
    console.log("--- BUSCAR TAREA POR ID ---");
    const id = await input("Ingresa el ID exacto de la tarea: ");
    
    // Trabajo del gestor
    const tarea = gestor.obtenerPorId(id);
   

    if (tarea){
         const vencimientoStr = tarea.fechaVencimiento 
            ? tarea.fechaVencimiento.toLocaleDateString() 
            : "(Sin límite)";
       console.log(`=== DETALLE DE LA TAREA ===
        ID:          ${tarea.id}
        Título:      ${tarea.titulo}
        Descripción: ${tarea.descripcion || "(Sin descripción)"}
        Estado:      ${EstadoLabels[tarea.estado]}
        Dificultad:  ${DificultadLabels[tarea.dificultad]}
        Fecha Creac: ${tarea.fechaCreacion.toLocaleString()}
        Vencimiento: ${vencimientoStr}
      `);
    } else {

        console.log("\nNo se encontró ninguna tarea activa con ese ID.");
    }
    await esperarEnter();
}


// --- FUNCIÓN VALIDADORA DE FECHAS  ---
async function pedirFechaValida(mensaje: string): Promise<Date | null | undefined> {
    while (true) {
        const inputFecha = await input(mensaje);
        
        // Si aprieta Enter sin escribir nada, retorna undefined 
        if (inputFecha.trim() === "") return undefined; 

        // Si escribe un "0", retorna null (significa "quiero borrar la fecha")
        if (inputFecha.trim() === "0") return null;

        // Validamos que el texto tenga el formato AAAA-MM-DD
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(inputFecha)) {
            console.log(" Formato inválido. Por favor usa AAAA-MM-DD (ej: 2026-12-25).");
            continue;
        }

        // Le agregamos T12:00:00 para forzar el mediodía y evitar que, por zona horaria, se corra al día anterior
        const fecha = new Date(inputFecha + "T12:00:00"); 

        // Verificamos si JavaScript pudo crear una fecha real (evita que pongan 2026-15-32)
        if (isNaN(fecha.getTime())) {
            console.log(" Fecha inexistente. Intenta de nuevo.");
            continue;
        }

        return fecha; // Si pasó todas las pruebas, devolvemos el objeto Date
    }
}
// Arranca la app
main();

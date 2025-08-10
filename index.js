// -------------------------
// Guardar un nuevo fiado
// -------------------------
function guardarFiado() {
    let nombre = document.getElementById("nombreCliente").value.trim();
    let producto = document.getElementById("producto").value.trim();
    let monto = parseFloat(document.getElementById("monto").value);
    // Fecha en formato dd/mm/yyyy forzada con locale español de Argentina
    let fecha = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    if (!nombre || !producto || isNaN(monto)) {
        alert("Completa todos los campos correctamente");
        return;
    }

    let fiados = JSON.parse(localStorage.getItem("fiados")) || [];

    fiados.push({
        nombre: nombre,
        producto: producto,
        monto: monto,
        fecha: fecha
    });

    localStorage.setItem("fiados", JSON.stringify(fiados));

    alert("Fiado guardado correctamente");
    if (document.getElementById("formFiado")) {
        document.getElementById("formFiado").reset();
    }
}

// -------------------------
// Buscar cliente y mostrar fiados
// -------------------------
function buscarCliente() {
    let busqueda = document.getElementById("busqueda").value.toLowerCase();
    let fiados = JSON.parse(localStorage.getItem("fiados")) || [];
    let tbody = document.getElementById("tablaFiados");

    if (!tbody) return; // Evita errores si no existe la tabla en la página

    tbody.innerHTML = ""; // Limpiar tabla

    let filtrados = fiados.filter(f => f.nombre.toLowerCase().includes(busqueda));

    filtrados.forEach((f, index) => {
    let fila = `<tr>
        <td>${f.nombre}</td>
        <td>${f.producto}</td>
        <td>$${f.monto}</td>
        <td>${f.fecha}</td>
        <td>
          <button 
            class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" 
            onclick="eliminarFiado(${fiados.indexOf(f)})"
          >
            Eliminar
          </button>
        </td>
    </tr>`;
    tbody.innerHTML += fila;
});


    if (filtrados.length === 0 && busqueda !== "") {
        tbody.innerHTML = `<tr><td colspan="4">No se encontraron fiados para "${busqueda}"</td></tr>`;
    }
}

// -------------------------
// Cargar todos los fiados (sin buscar)
// -------------------------
function mostrarTodosFiados() {
    let fiados = JSON.parse(localStorage.getItem("fiados")) || [];
    let tbody = document.getElementById("tablaFiados");

    if (!tbody) return;

    tbody.innerHTML = "";

    fiados.forEach((f, index) => {
        let fila = `<tr>
            <td>${f.nombre}</td>
            <td>${f.producto}</td>
            <td>$${f.monto}</td>
            <td>${f.fecha}</td>
            <td>
              <button 
                class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded" 
                onclick="eliminarFiado(${index})"
              >
                Eliminar
              </button>
            </td>
        </tr>`;
        tbody.innerHTML += fila;
    });
}

function eliminarFiado(index) {
    let fiados = JSON.parse(localStorage.getItem("fiados")) || [];
    console.log("Eliminar índice:", index, fiados[index]);

    if (confirm(`¿Querés eliminar el fiado de "${fiados[index].nombre}"?`)) {
        fiados.splice(index, 1);
        localStorage.setItem("fiados", JSON.stringify(fiados));

        const busqueda = document.getElementById("busqueda").value.trim();
        if (busqueda) {
            buscarCliente();
        } else {
            mostrarTodosFiados();
        }
    }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker registrado', reg))
    .catch(err => console.log('Error al registrar Service Worker', err));
  });
}

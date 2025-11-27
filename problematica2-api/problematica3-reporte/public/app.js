// public/app.js

const API_BASE_URL = "http://localhost:3000/api/deudas";

const formFiltros = document.getElementById("form-filtros");
const btnLimpiar = document.getElementById("btn-limpiar");
const cuerpoTabla = document.querySelector("#tabla-deudas tbody");

async function cargarDeudas(filtros = {}) {
  const params = new URLSearchParams();

  if (filtros.clienteId) {
    params.append("clienteId", filtros.clienteId);
  }

  if (filtros.fechaVencimiento) {
    params.append("fechaVencimiento", filtros.fechaVencimiento);
  }

  const url = params.toString()
    ? `${API_BASE_URL}?${params.toString()}`
    : API_BASE_URL;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener las deudas");
    }

    const deudas = await response.json();
    renderTabla(deudas);
  } catch (error) {
    console.error(error);
    renderTabla([]);
    alert("Ocurrió un error al cargar las deudas.");
  }
}

function renderTabla(deudas) {
  cuerpoTabla.innerHTML = "";

  if (!deudas || deudas.length === 0) {
    const fila = document.createElement("tr");
    const celda = document.createElement("td");
    celda.colSpan = 6;
    celda.textContent = "No se encontraron deudas con los filtros aplicados.";
    fila.appendChild(celda);
    cuerpoTabla.appendChild(fila);
    return;
  }

  deudas.forEach((deuda) => {
    const fila = document.createElement("tr");

    // 👉 Formato fecha
    let fechaFormateada = "";
    if (deuda.fecha_vencimiento) {
      const fecha = new Date(deuda.fecha_vencimiento);
      fechaFormateada = fecha.toLocaleDateString("es-CL"); // ej: 01-01-2022
    }

    // 👉 Formato monto (sin .00 y con miles)
    let montoFormateado = deuda.monto_deuda;
    const montoNum = Number(deuda.monto_deuda);
    if (!isNaN(montoNum)) {
      // Opción 1: solo número con miles
      // montoFormateado = montoNum.toLocaleString("es-CL");

      // Opción 2: con símbolo $
      montoFormateado = montoNum.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      });
    }

    fila.innerHTML = `
      <td>${deuda.id_cliente}</td>
      <td>${deuda.nombre_cliente}</td>
      <td>${deuda.correo}</td>
      <td>${montoFormateado}</td>
      <td>${deuda.id_deuda}</td>
      <td>${fechaFormateada}</td>
    `;

    cuerpoTabla.appendChild(fila);
  });
}


// Eventos
formFiltros.addEventListener("submit", (event) => {
  event.preventDefault();

  const clienteId = document.getElementById("clienteId").value.trim();
  const fechaVencimiento = document.getElementById("fechaVencimiento").value;

  cargarDeudas({ clienteId, fechaVencimiento });
});

btnLimpiar.addEventListener("click", () => {
  document.getElementById("clienteId").value = "";
  document.getElementById("fechaVencimiento").value = "";
  cargarDeudas(); // recarga todo sin filtros
});

// Cargar todas las deudas al inicio
cargarDeudas();

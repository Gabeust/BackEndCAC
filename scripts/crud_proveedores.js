let URL = "http://127.0.0.1:5000/";
let divResultado = document.querySelector("#resultado-peticion");
let seccionBuscarProveedor = document.querySelector("#seccion-buscar-proveedor");
seccionBuscarProveedor.style.display = "none";
let seccionAgregarProveedor = document.querySelector("#seccion-agregar-proveedor");
seccionAgregarProveedor.style.display = "none";

function ocultarPaneles() {
    seccionBuscarProveedor.style.display = "none";
    seccionAgregarProveedor.style.display = "none";
    divResultado.innerHTML = '';
}

/* --------------------------------Listado de Proveedores-------------------------------- */
let linkListadoProveedores = document.querySelector("#listar-proveedores");

linkListadoProveedores.addEventListener("click", listarProveedores);
function listarProveedores(){
    ocultarPaneles();

    fetch(URL + 'proveedores')
        .then(respuesta => respuesta.json())
        .then(proveedores => {
            divResultado.innerHTML = '';

            let resultadoHTML = `
            <tr>
                <th>id</th>
                <th>nombre</th>
                <th>direccion</th>
                <th>email</th>
                <th>cuit</th>
                <th>telefono</th>                    
            </tr>`;
            
            for (prov of proveedores) {
                let filaProveedorHTML = `
                <tr>
                    <td>${prov.id}</td>
                    <td>${prov.nombre}</td>
                    <td>${prov.direccion}</td>
                    <td>${prov.email}</td>
                    <td>${prov.cuit}</td>
                    <td>${prov.telefono}</td>                    
                </tr>`;

                resultadoHTML += filaProveedorHTML;
            }
                
            resultadoHTML = '<h2 style="text-align:center;">Listado de Proveedores</h2>\n' + '<table>\n' + resultadoHTML + '\n</table>';
            
            divResultado.innerHTML = resultadoHTML;
        })
        .catch(error => divResultado.innerHTML = "Error al obtener el listado de proveedores")
}

/* --------------------------------Buscar Proveedor-------------------------------- */
let linkBuscarProveedor = document.querySelector("#buscar-proveedor");

linkBuscarProveedor.addEventListener('click', generarPanelBuscarProveedor);
function generarPanelBuscarProveedor() {
    ocultarPaneles();
    divResultado.innerHTML = '';
    document.querySelector("#form-buscar-proveedor #cuit-prov").value = '';
    seccionBuscarProveedor.style.display = "block";
}

let formularioBuscarProveedor = document.querySelector('#form-buscar-proveedor');
formularioBuscarProveedor.addEventListener('submit', evento => {
    evento.preventDefault();

    let cuit = document.querySelector('#cuit-prov').value;

    if (cuit != '') {
        console.log("El CUIT a buscar es:", cuit);
        fetch(URL + 'proveedor/' + cuit)
        .then(respuesta => respuesta.json())
        .then(proveedor => {
            let resultadoHTML = `
            <tr>
                <th>id</th>
                <th>nombre</th>
                <th>direccion</th>
                <th>email</th>
                <th>cuit</th>
                <th>telefono</th>                    
            </tr>`;
            
            let filaProveedorHTML = `
            <tr>
                <td>${proveedor.id}</td>
                <td>${proveedor.nombre}</td>
                <td>${proveedor.direccion}</td>
                <td>${proveedor.email}</td>
                <td>${proveedor.cuit}</td>
                <td>${proveedor.telefono}</td>                    
            </tr>`;

            resultadoHTML += filaProveedorHTML;                
            resultadoHTML = '<table>\n' + resultadoHTML + '\n</table>';
            
            divResultado.innerHTML = resultadoHTML;
        })
        .catch(error => divResultado.innerHTML = `No hallamos ningún proveedor con el CUIT: ${cuit}`)
    }
})

/* --------------------------------Agregar Proveedor-------------------------------- */
let linkAgregarProveedor = document.querySelector("#agregar-proveedor");

function limpiarFormularioAgregarProveedor() {
    document.querySelector("#form-agregar-proveedor #nombre-prov").value = '';
    document.querySelector("#form-agregar-proveedor #direccion-prov").value = '';
    document.querySelector("#form-agregar-proveedor #email-prov").value = '';
    document.querySelector("#form-agregar-proveedor #cuit-prov").value = '';
    document.querySelector("#form-agregar-proveedor #telefono-prov").value = '';
}

linkAgregarProveedor.addEventListener('click', generarPanelAgregarProveedor);
function generarPanelAgregarProveedor() {
    ocultarPaneles();
    divResultado.innerHTML = '';
    limpiarFormularioAgregarProveedor();
    seccionAgregarProveedor.style.display = "block";
    
}

let formularioAgregarProveedor = document.querySelector('#form-agregar-proveedor');
formularioAgregarProveedor.addEventListener('submit', evento => {
    evento.preventDefault();

    /* Validar el formulario para crear un nuevo proveedor */

    let datosProveedor = new FormData();
    let nombre = document.querySelector('#form-agregar-proveedor #nombre-prov').value;
    datosProveedor.append('nombre-prov', nombre);
    let direccion = document.querySelector('#form-agregar-proveedor #direccion-prov').value;
    datosProveedor.append('direccion-prov', direccion);
    let email = document.querySelector('#form-agregar-proveedor #email-prov').value;
    datosProveedor.append('email-prov', email);
    let cuit = document.querySelector('#form-agregar-proveedor #cuit-prov').value;
    datosProveedor.append('cuit-prov', cuit);
    let telefono = document.querySelector('#form-agregar-proveedor #telefono-prov').value;    
    datosProveedor.append('telefono-prov', telefono);

    /*let proveedorNuevo = {
        nombre_prov: nombre,
        direccion_prov: direccion,
        email_prov: email,
        telefono_prov: telefono};

    console.log("El nuevo proveedor es:", proveedorNuevo); */

    console.log("El nuevo proveedor es:", datosProveedor);

    fetch(URL + "proveedor" , {
            method: "POST",
            body: datosProveedor
        })
    .then(respuesta => {
        console.log("Estado del POST: ", respuesta.status);    
        if(respuesta.status == 400) {
            alert("Ya existe el proveedor con CUIT:", cuit);
            throw error;
        }
        //respuesta.json();
        //console.log("Respuesta del POST: ", respuesta);
    })
    .then(mensaje => {
        alert("Proveedor agregado exitosamente.");
        limpiarFormularioAgregarProveedor();
    })
    .catch(error => console.log("Error al agregar el proveedor:", error))
        
}
)


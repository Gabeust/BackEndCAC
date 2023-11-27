let URL = "http://127.0.0.1:5000/";
let divResultado = document.querySelector("#resultado-peticion");
let seccionBuscarProveedor = document.querySelector("#seccion-buscar-proveedor");
let seccionAgregarProveedor = document.querySelector("#seccion-agregar-proveedor");
let seccionModificarProveedor = document.querySelector("#seccion-modificar-proveedor");
let seccionEliminarProveedor = document.querySelector("#seccion-eliminar-proveedor");

function ocultarPaneles() {
    seccionBuscarProveedor.style.display = "none";
    seccionAgregarProveedor.style.display = "none";
    seccionModificarProveedor.style.display = "none";
    seccionEliminarProveedor.style.display = "none";
    divResultado.innerHTML = '';
}
ocultarPaneles();



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
                <td id="cuit-proveedor-hallado">${proveedor.cuit}</td>
                <td>${proveedor.telefono}</td>                    
            </tr>`;

            resultadoHTML += filaProveedorHTML;                
            resultadoHTML = '<table>\n' + resultadoHTML + '\n</table>';
            
            divResultado.innerHTML = resultadoHTML;

            seccionModificarProveedor.style.display = "inline-block";
            seccionEliminarProveedor.style.display = "inline-block";
        

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
    let datosValidos = true;

    let telefono = document.querySelector('#form-agregar-proveedor #telefono-prov').value;    
    if ((!telefono == '') & (!validarTelefonoProveedor(telefono))) {
        datosValidos = false;
        document.querySelector("#form-agregar-proveedor #telefono-prov").focus();
    } else {datosProveedor.append('telefono-prov', telefono);}        

    let cuit = document.querySelector('#form-agregar-proveedor #cuit-prov').value;
    if (!validarCuitProveedor(cuit)) {
        datosValidos = false;
        document.querySelector("#form-agregar-proveedor #cuit-prov").focus();
    } else {datosProveedor.append('cuit-prov', cuit);}    

    let email = document.querySelector('#form-agregar-proveedor #email-prov').value;
    if ((!email == '') & (!validarEmailProveedor(email))) {
        datosValidos = false;
        document.querySelector("#form-agregar-proveedor #email-prov").focus();
    } else {datosProveedor.append('email-prov', email);}        

    let direccion = document.querySelector('#form-agregar-proveedor #direccion-prov').value;
    if ((!direccion == '') & (!validarDireccionProveedor(direccion))) {
        datosValidos = false;
        document.querySelector("#form-agregar-proveedor #direccion-prov").focus();
    } else {datosProveedor.append('direccion-prov', direccion);}    

    let nombre = document.querySelector('#form-agregar-proveedor #nombre-prov').value;
    if (!validarNombreProveedor(nombre)) {
        datosValidos = false;
        document.querySelector("#form-agregar-proveedor #nombre-prov").focus();
    } else {datosProveedor.append('nombre-prov', nombre);}
        
    console.log("El nuevo proveedor es:", datosProveedor);

    if(datosValidos) {
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

}
)



/* --------------------------------Validar Formulario Nuevo Proveedor-------------------------------- */
function validarNombreProveedor(nombre) {
    let expreg = /^[A-Za-zÑñ]{2,}[A-Za-zÑñ ]{1,}/i; // Inicie con letra, mínimo 2 letras de longitud y puede contener ñ y espacio
    return expreg.test(nombre); 
}

function validarDireccionProveedor(direccion) {
    let expreg = /^[\wÑñ]{1,}[ ][\wÑñ ]{1,}/i; // Inicie con letra o número, mínimo 2 palabras (Calle y Nro) y puede contener ñ
    return expreg.test(direccion); 
}

function validarEmailProveedor(email) {
    let expreg = /^[A-Za-z][\w.-]+\@[A-Za-z]+[.][A-Za-z]{2,}/i; // Inicie con letra, puede contener ., -, _ y luego del @ admite sólo letras
    return expreg.test(email); 
}

function validarCuitProveedor(cuit) {
    let expreg = /[0-9]{2}[-][0-9]{8}[-][0-9]{1}/i; // Debe seguir el patrón X-XXXXXXXX-X
    return expreg.test(cuit); 
}

function validarTelefonoProveedor(telefono) {
    let expreg = /[0-9]{3,5}[- ]{0,1}[0-9]{7,9}/i; // Característica entre 3 y 5 dígitos (contemplando el 0), número entre 7 y 9 dígitos (incluyendo o no el 15) y se puede separar con espacio o guión -
    return expreg.test(telefono); 
}



/* --------------------------------Eliminar Proveedor-------------------------------- */
let botonEliminarProveedor = document.querySelector("#eliminar-proveedor");

botonEliminarProveedor.addEventListener("click", eliminarProveedor);
function eliminarProveedor(){
    let cuit = divResultado.querySelector("#cuit-proveedor-hallado").textContent;
    let eliminar = false;
    eliminar = confirm(`¿Seguro que quiere eliminar el proveedor con CUIT: ${cuit} ?`);

    if (eliminar) {
        fetch(URL + "proveedor/" + cuit, {method: "DELETE"})
        .then(respuesta => console.log(respuesta))
        .then(mensaje => {
            alert("Proveedor eliminado exitosamente.");
            generarPanelBuscarProveedor();
        })
        .catch(error => console.log("Error al eliminar el proveedor:", error))
    }
}

//let URL = "http://127.0.0.1:5000/"; # Funciona localmente
let URL = "https://matanus.pythonanywhere.com/";
let divResultado = document.querySelector("#resultado-peticion");
let seccionBuscarProveedor = document.querySelector("#seccion-buscar-proveedor");
let seccionAgregarProveedor = document.querySelector("#seccion-agregar-proveedor");
let seccionModificarProveedor = document.querySelector("#seccion-modificar-proveedor");
let seccionEditarProveedor = document.querySelector("#seccion-editar-proveedor");
let seccionEliminarProveedor = document.querySelector("#seccion-eliminar-proveedor");

function ocultarPaneles() {
    seccionBuscarProveedor.style.display = "none";
    seccionAgregarProveedor.style.display = "none";
    seccionModificarProveedor.style.display = "none";
    seccionEditarProveedor.style.display = "none";
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
    let nombre = document.querySelector('#form-agregar-proveedor #nombre-prov').value;
    let direccion = document.querySelector('#form-agregar-proveedor #direccion-prov').value;
    let email = document.querySelector('#form-agregar-proveedor #email-prov').value;
    let cuit = document.querySelector('#form-agregar-proveedor #cuit-prov').value;
    let telefono = document.querySelector('#form-agregar-proveedor #telefono-prov').value;    

    let datosProveedor = {
        nombre: nombre,
        direccion: direccion,
        email: email,
        cuit: cuit,
        telefono: telefono  
    };
    console.log("Datos de proveedor a agregar:", datosProveedor);

    let datosValidos = true;
    datosValidos = validarDatosProveedor(datosProveedor, "agregar");
    console.log("Validación de datos de proveedor nuevo:", validarDatosProveedor(datosProveedor, "agregar"));

    if(datosValidos) {
        let datosProveedorVerificado = new FormData();
        datosProveedorVerificado.append('nombre-prov', datosProveedor.nombre);        
        datosProveedorVerificado.append('direccion-prov', datosProveedor.direccion);        
        datosProveedorVerificado.append('email-prov', datosProveedor.email);        
        datosProveedorVerificado.append('cuit-prov', datosProveedor.cuit);        
        datosProveedorVerificado.append('telefono-prov', datosProveedor.telefono);        
    
        fetch(URL + "proveedor" , {
                method: "POST",
                body: datosProveedorVerificado
            })
        .then(respuesta => {
            console.log("Estado del POST: ", respuesta.status);    
            if(respuesta.status == 400) {
                alert("Ya existe el proveedor con CUIT:", cuit);
                throw error;
            }
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
    let expreg = /^[\wÑñ]{1,}[ ][\wÑñ -]{1,}/i; // Inicie con letra o número, mínimo 2 palabras (Calle y Nro) y puede contener ñ
    return expreg.test(direccion); 
}

function validarEmailProveedor(email) {
    let expreg = /^[A-Za-z][\w.-]+\@[A-Za-z]+[.][A-Za-z]{2,}/i; // Inicie con letra, puede contener ., -, _ y luego del @ admite sólo letras
    return expreg.test(email); 
}

function validarCuitProveedor(cuit) {
    let expreg = /[0-9]{2}[-][0-9]{8}[-][0-9]{1}/i; // Debe seguir el patrón XX-XXXXXXXX-X
    return expreg.test(cuit); 
}

function validarTelefonoProveedor(telefono) {
    let expreg = /[0-9]{2,5}[- ]{0,1}[0-9]{7,10}/i; // Característica entre 2 y 5 dígitos (contemplando el 0), número entre 7 y 10 dígitos (incluyendo o no el 15) y se puede separar con espacio o guión -
    return expreg.test(telefono); 
}



/* --------------------------------Modificar Proveedor-------------------------------- */
// Para modificar un proveedor desde el menú desplegable primeramente habrá que buscarlo
let linkModificarProveedor = document.querySelector("#modificar-proveedor");
linkModificarProveedor.addEventListener('click', generarPanelBuscarProveedor);

// Por otra parte programo la modificación de información del proveedor
let botonModificarProveedor = document.querySelector("#boton-modificar-proveedor");

botonModificarProveedor.addEventListener("click", modificarProveedor);
function modificarProveedor() {
    let cuit = divResultado.querySelector("#cuit-proveedor-hallado").textContent;

    fetch(URL + 'proveedor/' + cuit)
    .then(datos => datos.json())
    .then(proveedor => {
        console.log("Proveedor a editar:", proveedor);

        seccionEditarProveedor.style.display = "block";
        document.querySelector("#id-prov-igual").textContent = proveedor.id;
        document.querySelector("#nombre-prov-nuevo").value = proveedor.nombre;

        if (proveedor.direccion == "") {
            document.querySelector("#direccion-prov-nueva").value = "";
            document.querySelector("#direccion-prov-nueva").setAttribute("placeholder", "Calle 000 - Provincia");
        } else {document.querySelector("#direccion-prov-nueva").value = proveedor.direccion;};
        
        if (proveedor.email == "") {
            document.querySelector("#email-prov-nuevo").value = "";
            document.querySelector("#email-prov-nuevo").setAttribute("placeholder", "mail@dominio.ej");
        } else {document.querySelector("#email-prov-nuevo").value = proveedor.email;};

        document.querySelector("#cuit-proveedor-igual").textContent = proveedor.cuit;

        if (proveedor.telefono == "") {
            document.querySelector("#telefono-prov-nuevo").value = "";
            document.querySelector("#telefono-prov-nuevo").setAttribute("placeholder", "0333 154455666");
        } else {document.querySelector("#telefono-prov-nuevo").value = proveedor.telefono;};
    })
    .catch(error => console.log("Error al editar la información del proveedor.", error))
    
}


let formularioEditarProveedor = document.querySelector('#form-editar-proveedor');
formularioEditarProveedor.addEventListener('submit', evento => {
    evento.preventDefault();

    /* Validar el formulario para editar el proveedor */
    let nombre = document.querySelector('#form-editar-proveedor #nombre-prov-nuevo').value;
    let direccion = document.querySelector('#form-editar-proveedor #direccion-prov-nueva').value;
    let email = document.querySelector('#form-editar-proveedor #email-prov-nuevo').value;
    let cuit = document.querySelector('#form-editar-proveedor #cuit-proveedor-igual').textContent;
    let telefono = document.querySelector('#form-editar-proveedor #telefono-prov-nuevo').value;    

    let datosProveedor = {
        nombre: nombre,
        direccion: direccion,
        email: email,
        cuit: cuit,
        telefono: telefono  
    };
    console.log("Datos de proveedor:", datosProveedor);

    let datosValidos = true;
    datosValidos = validarDatosProveedor(datosProveedor, "editar");
    console.log("Validación de datos de proveedor", validarDatosProveedor(datosProveedor, "editar"));

    if(datosValidos) {
        let datosProveedorVerificado = new FormData();
        datosProveedorVerificado.append('nombre-prov-editado', datosProveedor.nombre);        
        datosProveedorVerificado.append('direccion-prov-editada', datosProveedor.direccion);        
        datosProveedorVerificado.append('email-prov-editado', datosProveedor.email);        
        datosProveedorVerificado.append('cuit-prov-editado', datosProveedor.cuit);        
        datosProveedorVerificado.append('telefono-prov-editado', datosProveedor.telefono);        
    
        fetch(URL + "proveedor" , {
                method: "PUT",
                body: datosProveedorVerificado
            })
        .then(respuesta => {
            console.log("Estado del POST: ", respuesta.status);    
            if(respuesta.status == 400) {
                alert("No se puedo actualizar la información del proveedor");
                throw error;
            }
        })
        .then(mensaje => {
            alert("Proveedor editado exitosamente.");
            generarPanelBuscarProveedor();
            //limpiarFormularioAgregarProveedor();
        })
        .catch(error => console.log("Error al editar el proveedor:", error))
    }
}
)


let botonCancelarEditarProveedor = document.querySelector("#form-editar-proveedor #cancelar-editar-proveedor");
botonCancelarEditarProveedor.addEventListener("click", cancelarEditarProveedor);
function cancelarEditarProveedor () {
    seccionEditarProveedor.style.display = "none";
}


/* --------------------------------Eliminar Proveedor-------------------------------- */
// Para eliminar un proveedor desde el menú desplegable primeramente habrá que buscarlo
let linkEliminarProveedor = document.querySelector("#eliminar-proveedor");
linkEliminarProveedor.addEventListener('click', generarPanelBuscarProveedor);

// Por otra parte programo la eliminación de la información del proveedor
let botonEliminarProveedor = document.querySelector("#boton-eliminar-proveedor");

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

function validarDatosProveedor(datosProveedor, formulario) {
    if (!validarNombreProveedor(datosProveedor['nombre'])) {
        if (formulario == "editar") {
            document.querySelector("#form-editar-proveedor #nombre-prov-nuevo").focus();
        } else if (formulario == "agregar") {
            //console.log("ACA ENTRA 1");
            document.querySelector("#form-agregar-proveedor #nombre-prov").focus();
        }
        return false;
    }

    if (datosProveedor['direccion'] != "" & (!validarDireccionProveedor(datosProveedor['direccion']))) {
        if (formulario == "editar") {
            document.querySelector("#form-editar-proveedor #direccion-prov-nueva").focus();
        } else if (formulario == "agregar") {
            //console.log("ACA ENTRA 2");
            document.querySelector("#form-agregar-proveedor #direccion-prov").focus();}
        return false;
    }

    if (datosProveedor['email'] != "" & (!validarEmailProveedor(datosProveedor['email']))) {
        if (formulario == "editar") {
            document.querySelector("#form-editar-proveedor #email-prov-nuevo").focus();
        } else if (formulario == "agregar") {
            //console.log("ACA ENTRA 3");
            document.querySelector("#form-agregar-proveedor #email-prov").focus();}
        return false;
    }

    if (!validarCuitProveedor(datosProveedor['cuit'])) {
        if (formulario == "editar") {
            console.log(datosProveedor['cuit']);
        } else if (formulario == "agregar") {
            //console.log("ACA ENTRA 4");
            document.querySelector("#form-agregar-proveedor #cuit-prov").focus();}
        return false;
    }

    if (datosProveedor['telefono'] != "" & (!validarTelefonoProveedor(datosProveedor['telefono']))) {
        if (formulario == "editar") {
            document.querySelector("#form-editar-proveedor #telefono-prov-nuevo").focus();
        } else if (formulario == "agregar") {
            //console.log("ACA ENTRA 5");
            document.querySelector("#form-agregar-proveedor #telefono-prov").focus();}
        return false;
    }

    return true;

}
/*
if(false) {
    console.log("No deberia entrar aca");
} else if (true) {console.log("SI deberia entrar aca");}
*/
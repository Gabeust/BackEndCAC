const URL = "http://127.0.0.1:5000/";

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
function listarProveedores() {
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

    if (datosValidos) {
        let datosProveedorVerificado = new FormData();
        datosProveedorVerificado.append('nombre-prov', datosProveedor.nombre);
        datosProveedorVerificado.append('direccion-prov', datosProveedor.direccion);
        datosProveedorVerificado.append('email-prov', datosProveedor.email);
        datosProveedorVerificado.append('cuit-prov', datosProveedor.cuit);
        datosProveedorVerificado.append('telefono-prov', datosProveedor.telefono);

        fetch(URL + 'proveedor', {
            method: "POST",
            body: datosProveedorVerificado
        })
            .then(respuesta => {
                console.log("Estado del POST: ", respuesta.status);
                if (respuesta.status == 400) {
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
    let expreg = /[0-9]{3,5}[- ]{0,1}[0-9]{7,9}/i; // Característica entre 3 y 5 dígitos (contemplando el 0), número entre 7 y 9 dígitos (incluyendo o no el 15) y se puede separar con espacio o guión -
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
            } else { document.querySelector("#direccion-prov-nueva").value = proveedor.direccion; };

            if (proveedor.email == "") {
                document.querySelector("#email-prov-nuevo").value = "";
                document.querySelector("#email-prov-nuevo").setAttribute("placeholder", "mail@dominio.ej");
            } else { document.querySelector("#email-prov-nuevo").value = proveedor.email; };

            document.querySelector("#cuit-proveedor-igual").textContent = proveedor.cuit;

            if (proveedor.telefono == "") {
                document.querySelector("#telefono-prov-nuevo").value = "";
                document.querySelector("#telefono-prov-nuevo").setAttribute("placeholder", "0333 154455666");
            } else { document.querySelector("#telefono-prov-nuevo").value = proveedor.telefono; };
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

    if (datosValidos) {
        let datosProveedorVerificado = new FormData();
        datosProveedorVerificado.append('nombre-prov-editado', datosProveedor.nombre);
        datosProveedorVerificado.append('direccion-prov-editada', datosProveedor.direccion);
        datosProveedorVerificado.append('email-prov-editado', datosProveedor.email);
        datosProveedorVerificado.append('cuit-prov-editado', datosProveedor.cuit);
        datosProveedorVerificado.append('telefono-prov-editado', datosProveedor.telefono);

        fetch(URL + 'proveedor', {
            method: "PUT",
            body: datosProveedorVerificado
        })
            .then(respuesta => {
                console.log("Estado del POST: ", respuesta.status);
                if (respuesta.status == 400) {
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
function cancelarEditarProveedor() {
    seccionEditarProveedor.style.display = "none";
}


/* --------------------------------Eliminar Proveedor-------------------------------- */
// Para eliminar un proveedor desde el menú desplegable primeramente habrá que buscarlo
let linkEliminarProveedor = document.querySelector("#eliminar-proveedor");
linkEliminarProveedor.addEventListener('click', generarPanelBuscarProveedor);

// Por otra parte programo la eliminación de la información del proveedor
let botonEliminarProveedor = document.querySelector("#boton-eliminar-proveedor");

botonEliminarProveedor.addEventListener("click", eliminarProveedor);
function eliminarProveedor() {
    let cuit = divResultado.querySelector("#cuit-proveedor-hallado").textContent;
    let eliminar = false;
    eliminar = confirm(`¿Seguro que quiere eliminar el proveedor con CUIT: ${cuit} ?`);

    if (eliminar) {
        fetch(URL + 'proveedor/' + cuit, { method: "DELETE" })
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
            document.querySelector("#form-agregar-proveedor #direccion-prov").focus();
        }
        return false;
    }

    if (datosProveedor['email'] != "" & (!validarEmailProveedor(datosProveedor['email']))) {
        if (formulario == "editar") {
            document.querySelector("#form-editar-proveedor #email-prov-nuevo").focus();
        } else if (formulario == "agregar") {
            //console.log("ACA ENTRA 3");
            document.querySelector("#form-agregar-proveedor #email-prov").focus();
        }
        return false;
    }

    if (!validarCuitProveedor(datosProveedor['cuit'])) {
        if (formulario == "editar") {
            console.log(datosProveedor['cuit']);
        } else if (formulario == "agregar") {
            //console.log("ACA ENTRA 4");
            document.querySelector("#form-agregar-proveedor #cuit-prov").focus();
        }
        return false;
    }

    if (datosProveedor['telefono'] != "" & (!validarTelefonoProveedor(datosProveedor['telefono']))) {
        if (formulario == "editar") {
            document.querySelector("#form-editar-proveedor #telefono-prov-nuevo").focus();
        } else if (formulario == "agregar") {
            //console.log("ACA ENTRA 5");
            document.querySelector("#form-agregar-proveedor #telefono-prov").focus();
        }
        return false;
    }

    return true;

}
/*
if(false) {
    console.log("No deberia entrar aca");
} else if (true) {console.log("SI deberia entrar aca");}
*/
// -------------------------------------GABRIEL----------------------------------------------
let listarProductosLink = document.getElementById('listado-productos');
let agregarProductosLink = document.getElementById('agregar-productos');
let buscarProductosLink = document.getElementById('buscar-productos');
let modificarProductosLink = document.getElementById('modificar-productos');
let eliminarProductosLink = document.getElementById('eliminar-productos');

let productosTable = document.getElementById('productosTable');
let addProductos = document.getElementById('addProductos');
let buscarProductos = document.getElementById('buscarProductos');
let resultadoBusqueda = document.getElementById('resultadoBusqueda');
let editarProductos = document.getElementById('editar-eliminar-productos');
let eliminarProductos = document.getElementById('eliminarProductos')

// --------------------------------------LISTAR PRODUCTOS-----------------------------

listarProductosLink.addEventListener("click", function () {
    ocultarPaneles();
    productosTable.style.display = 'table';
    addProductos.style.display = 'none';
    buscarProductos.style.display = 'none';
    eliminarProductos.style.display = 'none';

    fetch(URL + `productos`)
        .then(response => response.json())
        .then(data => {
            // Limpiar el cuerpo de la tabla antes de agregar nuevos datos
            document.getElementById('productosBody').innerHTML = '';

            // Iterar sobre los productos y agregar filas a la tabla
            data.forEach(producto => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                        <td>${producto.id}</td>
                        <td>${producto.codigo}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.cantidad}</td>
                        <td>${producto.precio_compra}</td>
                        <td>${producto.precio_venta}</td>
                        <td>${producto.proveedor}</td>
                        <td>${producto.categoria}</td>
                        <td><img src="${producto.imagen_url}"></td>
                    `;
                document.getElementById('productosBody').appendChild(newRow);
            });
        })
});

// ---------------------AGREGAR PRODUCTOS----------------------------
agregarProductosLink.addEventListener("click", function () {
    ocultarPaneles();
    addProductos.style.display = 'block';
    productosTable.style.display = 'none';
    buscarProductos.style.display = 'none';
    eliminarProductos.style.display = 'none';
});

document.getElementById('productoForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var formData = new FormData();

    formData.append('codigo', document.getElementById('codigo').value);
    formData.append('descripcion', document.getElementById('descripcion').value);
    formData.append('cantidad', document.getElementById('cantidad').value);
    formData.append('precio_compra', document.getElementById('precio_compra').value);
    formData.append('precio_venta', document.getElementById('precio_venta').value);
    formData.append('imagen_url', document.getElementById('imagen_url').value);
    formData.append('proveedor', document.getElementById('proveedor').value);
    formData.append('categoria', document.getElementById('categoria').value);

    fetch(URL + 'altaProductos', {
        method: 'POST',
        body: formData,
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Producto ya existe');
            }
            return response.json();
        })
        .then(function (data) {
            alert('Producto agregado correctamente.');

            // Limpiar el formulario
            document.getElementById('productoForm').reset();
            listarParaEliminar();
        })
        .catch(function (error) {
            alert(error.message);
        });
});

// --------------------------Buscar PRODUCTOS ------------------------------------

buscarProductosLink.addEventListener("click", function () {
    ocultarPaneles();
    buscarProductos.style.display = 'block';
    productosTable.style.display = 'none';
    addProductos.style.display = 'none';
    eliminarProductos.style.display = 'none';
    document.getElementById('buscarCod').style.display = 'block';
    document.getElementById('buscarProductosForm').reset()
    document.getElementById('resultadoBusqueda').reset()

});

const buscarProductosForm = document.getElementById('buscarProductosForm');
const resultadoBusquedaSection = document.getElementById('resultadoBusqueda');

buscarProductosForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const id = document.getElementById('buscar-id').value;
    const codigo = document.getElementById('buscar-cod').value;

    if (id) {
        buscarProductoPorId(id);
    } else if (codigo) {
        buscarProductoPorCodigo(codigo);
    }
});
function buscarProductoPorId(id) {
    fetch(URL + `productos/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Producto no existe`);
            }
            return response.json();
        })
        .then(producto => {
            actualizarCamposResultado(producto);
        })
        .catch(error => {
            alert(error.message);
        });
}
function buscarProductoPorCodigo(codigo) {
    fetch(URL + `productos/codigo/${codigo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Producto no existe`);
            }
            return response.json();
        }).catch(error => {
            alert('Error al buscar el producto por código: ' + error.message);
        });
}

function actualizarCamposResultado(producto) {
    // Actualizar los campos del formulario de resultados
    document.getElementById('b-id').value = producto.id;
    document.getElementById('b-codigo').value = producto.codigo;
    document.getElementById('b-descripcion').value = producto.descripcion;
    document.getElementById('b-cantidad').value = parseInt(producto.cantidad);
    document.getElementById('b-precio_compra').value = parseFloat(producto.precio_compra);
    document.getElementById('b-precio_venta').value = parseFloat(producto.precio_venta);
    document.getElementById('b-imagen_url').value = producto.imagen_url;
    document.getElementById('b-proveedor').value = producto.proveedor;
    document.getElementById('b-categoria').value = producto.categoria;


    document.getElementById('buscar-productos').addEventListener('click', function () {
        // Ocultar la botonera
        document.getElementById('editar-eliminar-productos').style.display = 'none';
    });

}
// --------------------------EDITAR PRODUCTOS------------------------------------

function obtenerId() {
    return document.getElementById('b-id').value;
}
document.getElementById('modificar-productos').addEventListener('click', function () {
    ocultarPaneles();
    buscarProductos.style.display = 'block';
    productosTable.style.display = 'none';
    addProductos.style.display = 'none';
    eliminarProductos.style.display = 'none';
    document.getElementById('buscarCod').style.display = 'none';


    document.getElementById('editar-eliminar-productos').style.display = 'block';
    
});

document.getElementById('b-guardar').addEventListener('click', function (event) {

    event.preventDefault();

    let id = obtenerId();
    let nuevoCodigo = document.getElementById('b-codigo').value;
    let nuevaDescripcion = document.getElementById('b-descripcion').value;
    let nuevaCantidad = document.getElementById('b-cantidad').value;
    let nuevoPrecioCompra = document.getElementById('b-precio_compra').value;
    let nuevoPrecioVenta = document.getElementById('b-precio_venta').value;
    let nuevaImagenUrl = document.getElementById('b-imagen_url').value;
    let nuevoProveedor = document.getElementById('b-proveedor').value;
    let nuevaCategoria = document.getElementById('b-categoria').value;

    fetch(URL + `productos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'id': id,
            'codigo': nuevoCodigo,
            'descripcion': nuevaDescripcion,
            'cantidad': nuevaCantidad,
            'precio_compra': nuevoPrecioCompra,
            'precio_venta': nuevoPrecioVenta,
            'imagen_url': nuevaImagenUrl,
            'proveedor': nuevoProveedor,
            'categoria': nuevaCategoria
        }),
    })
    
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Muestra la alerta y limpia el formulario
            alert('Producto editado con éxito');
            document.getElementById('buscarProductosForm').reset()
            document.getElementById('resultadoBusqueda').reset()
        .catch(error => console.error('Error al editar el producto:', error));
        });
});

// --------------------------ELIMINAR PRODUCTOS ----------------------------------------------

document.getElementById('eliminar-productos').addEventListener('click', function () {
    ocultarPaneles();
    eliminarProductos.style.display = 'table';
    buscarProductos.style.display = 'none';
    productosTable.style.display = 'none';
    addProductos.style.display = 'none';
    editarProductos.style.display = 'none';
});


// Función para listar productos y agregar botones de eliminar
function listarParaEliminar() {
    fetch(URL + 'productos')
        .then(response => response.json())
        .then(data => {
            // Limpia el cuerpo de la tabla antes de agregar nuevos datos
            document.getElementById('EliminarBody').innerHTML = '';

            data.forEach(producto => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${producto.id}</td>
                    <td>${producto.codigo}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.precio_compra}</td>
                    <td>${producto.precio_venta}</td>
                    <td>${producto.proveedor}</td>
                    <td>${producto.categoria}</td>
                    <td><img src="${producto.imagen_url}"></td>
                    <td><button class="botones" onclick="eliminarProductoXid(${producto.id})">Eliminar</button></td>
                `;
                document.getElementById('EliminarBody').appendChild(newRow);
            });
        })
        .catch(error => console.error('Error al obtener la lista de productos:', error));
}

function eliminarProductoXid(id) {
    fetch(URL + `productos/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            alert('Producto eliminado con éxito');
            // Vuelve a listar los productos después de eliminar
            listarParaEliminar();
        })
        .catch(error => console.error('Error al eliminar el producto:', error));
}
listarParaEliminar();



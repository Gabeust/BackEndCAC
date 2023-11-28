// -----------------------------------------------------------------------------------

let divResultado = document.querySelector("#resultado-peticion");
let seccionBuscarProveedor = document.querySelector("#seccion-buscar-proveedor");
seccionBuscarProveedor.style.display = "none";

/* --------------------------------Listado de Proveedores-------------------------------- */
let linkListadoProveedores = document.querySelector("#listar-proveedores");

linkListadoProveedores.addEventListener("click", listarProveedores);
function listarProveedores(){

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
    seccionBuscarProveedor.style.display = "block";
}

let formularioBuscarProveedor = document.querySelector('#form-buscar-proveedor');
formularioBuscarProveedor.addEventListener('submit', evento => {
    evento.preventDefault();

    let cuit = document.querySelector('#cuit-prov').value;

    if (cuit != '') {
        console.log("El CUIT a buscar es:", cuit);
        fetch(URL + '/proveedor/' + cuit)
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
// -----------------------------------------------------------------------------------

// Llamar a la función al cargar la página después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    listarProductos();
});
const URL = "http://127.0.0.1:5000/";

// Agregar productos
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
    })
    .catch(function (error) {
        
        alert(error.message);
    });
});

// Función para listar productos
function listarProductos() {
    // Hacer una solicitud GET a la API para obtener la lista de productos
    fetch(URL + 'productos')
        .then(response => response.json())
        .then(data => {
            // Obtener la referencia de la tabla
            let table = document.getElementById('productosTable');

            // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
            table.querySelector('tbody').innerHTML = "";

            // Iterar sobre los productos y agregar filas a la tabla
            data.forEach(producto => {
                // Crear una nueva fila
                let newRow = table.querySelector('tbody').insertRow();

                // Agregar celdas a la fila
                newRow.insertCell().textContent = producto.id;
                newRow.insertCell().textContent = producto.codigo;
                newRow.insertCell().textContent = producto.descripcion;
                newRow.insertCell().textContent = producto.cantidad;
                newRow.insertCell().textContent = producto.precio_compra;
                newRow.insertCell().textContent = producto.precio_venta;
                newRow.insertCell().textContent = producto.proveedor;
                newRow.insertCell().textContent = producto.categoria;

                // Crear una celda para la imagen y agregarla a la fila
                let imgCell = newRow.insertCell();
                let img = document.createElement('img');
                img.src = producto.imagen_url;
                imgCell.appendChild(img);
            });
        })
        .catch(error => console.error('Error al obtener la lista de productos:', error));
}

let ListadoProductos = document.querySelector("#listar-productos");

ListadoProductos.addEventListener("click", function () {
    // Mostrar la tabla al hacer clic en "Listar Productos"
    document.getElementById('productosTable').style.display = 'block';
    // Llamar a la función para listar productos
    listarProductos();
});


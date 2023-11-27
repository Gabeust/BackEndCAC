let URL = "http://127.0.0.1:5000/";
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

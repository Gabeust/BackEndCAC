
 // Función para listar productos
function listarProductos() {
    // Hacer una solicitud GET a la API para obtener la lista de productos
    fetch('http://127.0.0.1:5000/productos')
        .then(response => response.json())
        .then(data => {
            // Limpiar el cuerpo de la tabla antes de agregar nuevos datos
            document.getElementById('productosBody').innerHTML = '';

            // Iterar sobre los productos y agregar filas a la tabla
            data.forEach(producto => {
                const newRow = document.createElement('tr');
                newRow.innerHTML = `
                    <td>${producto.ID}</td>
                    <td>${producto.codigo}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.cantidad}</td>
                    <td>${producto.precioCompra}</td>
                    <td>${producto.precioVenta}</td>
                    <td>${producto.proveedor}</td>
                `;
                document.getElementById('productosBody').appendChild(newRow);
            });
        })
        .catch(error => console.error('Error al obtener la lista de productos:', error));
}

// Llamar a la función al cargar la página después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    listarProductos();
});

//agregar productos
    function agregarProducto() {
        // Obtener los valores del formulario
        const id = document.getElementById("productoId").value;
        const codigo = document.getElementById("productoCode").value;
        const descripcion = document.getElementById("productoNombre").value;
        const cantidad = document.getElementById("productoQ").value;
        const precioCompra = document.getElementById("precioCompra").value;
        const precioVenta = document.getElementById("precioVenta").value;
        const img_url = document.getElementById("img_url").value;
        const proveedor = document.getElementById("proveedor").value;

        // Crear un objeto con los datos del producto
        const producto = {
            id: id,
            codigo: codigo,
            descripcion: descripcion,
            cantidad: cantidad,
            precioCompra: precioCompra,
            precioVenta: precioVenta,
            img_url: img_url,
            proveedor: proveedor
        };

        // Hacer una solicitud POST al servidor
        fetch("http://localhost:5000/productos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(producto),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.mensaje);
            // Puedes redirigir o hacer cualquier otra acción después de agregar el producto
        })
        .catch(error => console.error('Error al agregar el producto:', error));
    }

    function cancelar() {
        // Implementa la lógica para cancelar si es necesario
        alert("Acción cancelada");
    }
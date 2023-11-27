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
                    <td><img src="${producto.imagen_url}"</td>
                `;
                document.getElementById('productosBody').appendChild(newRow);
            });
        })
        .catch(error => console.error('Error al obtener la lista de productos:', error));
}


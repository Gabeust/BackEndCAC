#--------------------------------------------------------------------
# Instalar con pip install Flask
from flask import Flask, request, jsonify
from flask import request

# Instalar con pip install flask-cors
from flask_cors import CORS

# Instalar con pip install mysql-connector-python
import mysql.connector

# Si es necesario, pip install Werkzeug
from werkzeug.utils import secure_filename

# No es necesario instalar, es parte del sistema standard de Python
import os
import time
#--------------------------------------------------------------------

app = Flask(__name__)
CORS(app)

#--------------------------------------------------------------------
class Catalogo:
    #----------------------------------------------------------------
    # Constructor de la clase
    def __init__(self, host, user, password, database):
        # Primero, establecemos una conexión sin especificar la base de datos
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()

        # Intentamos seleccionar la base de datos
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            # Si la base de datos no existe, la creamos
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        # Una vez que la base de datos está establecida, creamos la tabla si no existe
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
                id INT NOT NULL AUTO_INCREMENT,
                codigo INT,
                descripcion VARCHAR(255) NOT NULL,
                cantidad INT,
                precio_compra DECIMAL(10,2) NOT NULL,
                precio_venta DECIMAL(10,2) NOT NULL,
                imagen_url VARCHAR(255),
                proveedor INT(2),
                categoria INT(2),           
                PRIMARY KEY (ID)
                );''')
        self.conn.commit()

        # Creo la tabla proveedores
        self.cursor.execute('''
               CREATE TABLE IF NOT EXISTS proveedores(
               id INT AUTO_INCREMENT,
               nombre VARCHAR(50) NOT NULL,
               direccion VARCHAR(255),
               email VARCHAR(255),
               cuit VARCHAR(50),
               telefono VARCHAR(255),
               PRIMARY KEY (`id`)
               );''')
        self.conn.commit()

        # Cerrar el cursor inicial y abrir uno nuevo con el parámetro dictionary=True
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)
        
    #----------------------------------------------------------------
    def agregar_producto(self, codigo, descripcion, cantidad, precio_compra, precio_venta, imagen, proveedor, categoria):
        # Verificamos si ya existe un producto con el mismo código
        self.cursor.execute(f"SELECT * FROM productos WHERE codigo = {codigo}")
        producto_existe = self.cursor.fetchone()
        if producto_existe:
            return False

        sql = "INSERT INTO productos (codigo, descripcion, cantidad, precio_compra, precio_venta, imagen_url, proveedor, categoria) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        valores = (codigo, descripcion, cantidad, precio_compra, precio_venta, imagen, proveedor, categoria)

        self.cursor.execute(sql, valores)        
        self.conn.commit()
        return True
    
    #----------------------------------------------------------------
    def consultar_producto(self, codigo):
        # Consultamos un producto a partir de su código
        self.cursor.execute(f"SELECT * FROM productos WHERE id = {codigo}")
        return self.cursor.fetchone()

    #----------------------------------------------------------------
    def modificar_producto(self, id, nuevo_codigo, nueva_descripcion, nueva_cantidad, nuevo_precio_compra, nuevo_precio_venta, nueva_imagen, nuevo_proveedor, nueva_categoria):
        sql = "UPDATE productos SET  codigo = %s, descripcion = %s, cantidad = %s, precio_compra = %s, precio_venta = %s, imagen_url = %s, proveedor = %s, categoria = %s WHERE id = %s"
        valores = (nuevo_codigo, nueva_descripcion, nueva_cantidad, nuevo_precio_compra, nuevo_precio_venta, nueva_imagen, nuevo_proveedor, nueva_categoria)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    #----------------------------------------------------------------
    def listar_productos(self):
        self.cursor.execute("SELECT * FROM productos")
        productos = self.cursor.fetchall()
        return productos

    #----------------------------------------------------------------
    def eliminar_producto(self, id):
        # Eliminamos un producto de la tabla a partir de su código
        self.cursor.execute(f"DELETE FROM productos WHERE id = {id}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    
    def eliminar_prodcuto(self, codigo):
        self.cursor.execute(f"DELETE FROM productos WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0
    #----------------------------------------------------------------
    def mostrar_producto(self, id):
        # Mostramos los datos de un producto a partir de su código
        producto = self.consultar_producto(id)
        if producto:
            print("-" * 40)
            print(f"id.........: {producto['id']}")
            print(f"Código.....: {producto['codigo']}")
            print(f"Descripción: {producto['descripcion']}")
            print(f"Cantidad...: {producto['cantidad']}")
            print(f"Preciocompra: {producto['precio_compra']}")
            print(f"Precioventa {producto['precio_venta']}")
            print(f"Imagen.....: {producto['imagen_url']}")
            print(f"Proveedor..: {producto['proveedor']}")
            print(f"Categoria..: {producto['categoria']}")
            print("-" * 40)
        else:
            print("Producto no encontrado.")

    #----------------------------------------------------------------
    def listar_proveedores(self):
        self.cursor.execute("SELECT * FROM proveedores")
        listado_proveedores = self.cursor.fetchall()
        return listado_proveedores
    
    def listar_proveedor_segun_cuit(self, cuit):
        self.cursor.execute(f"SELECT * FROM proveedores WHERE cuit = '{cuit}';")
        proveedor = self.cursor.fetchone()
        return proveedor
    
    def agregar_proveedor(self, nombre_prov, direccion_prov, email_prov, cuit_prov, telefono_prov):
        if self.listar_proveedor_segun_cuit(cuit_prov):
            return False
        else:
            self.cursor.execute(f"""
                                INSERT INTO proveedores
                                (nombre, direccion, email, cuit, telefono)
                                VALUES
                                ('{nombre_prov}','{direccion_prov}','{email_prov}','{cuit_prov}','{telefono_prov}')
                                ;""")
            self.conn.commit()
            return True

    def modificar_proveedor(self, nuevo_nombre, nueva_direccion, nuevo_email, cuit_prov, nuevo_telefono):
        self.cursor.execute(f"""
                            UPDATE proveedores
                            SET nombre = '{nuevo_nombre}', direccion = '{nueva_direccion}', email = '{nuevo_email}', telefono = '{nuevo_telefono}'
                            WHERE cuit = '{cuit_prov}'
                            ;""")
        self.conn.commit()
        return self.cursor.rowcount > 0

    def borrar_proveedor(self, cuit_prov):
        if self.listar_proveedor_segun_cuit(cuit_prov):
            self.cursor.execute(f"DELETE FROM proveedores WHERE cuit = '{cuit_prov}';")
            self.conn.commit()
            return True
        else:
            return False

#--------------------------------------------------------------------
# Cuerpo del programa
#--------------------------------------------------------------------
# Crear una instancia de la clase Catalogo
catalogo = Catalogo(host='localhost', user='root', password='', database='el_cosito')
print(catalogo.agregar_proveedor("fenergy","Av.Carlos Federico Gauss 5186, Córdoba","fabrifernandezdurand@gmail.com","30-22333444-3",3512028698))
print(catalogo.agregar_proveedor("ferreteria San Luis","Av. Provincias Unidas 136, (2000) - Rosario, Santa Fe","","30-11222333-1","(0341) 4560301 / 5580022"))
print(catalogo.agregar_proveedor("Dowen Pagio-Crossmaster","Alberti 2534 Santa Fe Santa Fe","info@dowenpagiocrossmaster.com.ar","30-11232332-2",1124041088))

#print(catalogo.borrar_proveedor("30-11232332-2"))
print(catalogo.modificar_proveedor("nombre", "direccion", "email", "30-11232332-2", "telefono"))

# Carpeta para guardar las imagenes.
ruta_destino = './static/imagenes/'
#--------------------------------------------------------------------
# Ruta para listar productos
@app.route("/productos", methods=["GET"])
def obtener_productos():
    # Coloca el código dentro del contexto de la aplicación
    with app.app_context():
        productos = catalogo.listar_productos()
        return jsonify(productos)
#--------------------------------------------------------------------
@app.route("/productos/<int:id>", methods=["GET"])
def mostrar_producto(id):
    producto = catalogo.consultar_producto(id)
    if producto:
        return jsonify(producto)
    else:
        return "Producto no encontrado", 404

#--------------------------------------------------------------------

@app.route("/altaProductos", methods=["POST"])
def agregar_productos():
    codigo = request.form['codigo']
    descripcion = request.form['descripcion']
    cantidad = request.form['cantidad']
    precio_compra = request.form.get('precio_compra')
    precio_venta = request.form['precio_venta']
    imagen_url = request.form['imagen_url']
    proveedor = request.form['proveedor']
    categoria = request.form['categoria']

    # Verifica si el producto ya existe antes de intentar agregarlo
    if catalogo.agregar_producto(codigo, descripcion, cantidad, precio_compra, precio_venta, imagen_url, proveedor, categoria):
        return jsonify({"mensaje": "Producto agregado"}), 201
    else:
        return jsonify({"error": "Producto ya existe", "codigo": codigo}), 400

#--------------------------------------------------------------------

@app.route("/productos/<int:id>", methods=["PUT"])
def modificar_producto(id):
    # Datos del producto
    data = request.form
    nuevo_codigo = data.get("codigo")
    nueva_descripcion = data.get("descripcion")
    nueva_cantidad = data.get("cantidad")
    nuevo_precio_compra = data.get("precio_compra")
    nuevo_precio_venta = data.get("precio_venta")
    nueva_imagen = data.get("imagen_url")
    nuevo_proveedor = data.get("proveedor")
    nueva_categoria = data.get("categoria")

    # Actualización del producto
    if catalogo.modificar_producto(nuevo_codigo, nueva_descripcion, nueva_cantidad, nuevo_precio_compra,nuevo_precio_venta, nueva_imagen, nuevo_proveedor, nueva_categoria):
        return jsonify({"mensaje": "Producto modificado"}), 200
    else:
        return jsonify({"mensaje": "Producto no encontrado"}), 404


#--------------------------------------------------------------------

@app.route("/productos/<int:id>", methods=["DELETE"])
def eliminar_producto(id):
    # Primero, obtén la información del producto para encontrar la imagen
    producto = catalogo.consultar_producto(id)
 
        # Luego, elimina el producto del catálogo
    if catalogo.eliminar_producto(id):
            return jsonify({"mensaje": "Producto eliminado"}), 200
    else:
            return jsonify({"mensaje": "Error al eliminar el producto"}), 500

#--------------------------------------------------------------------------------
# Sección proveedores
@app.route("/proveedores", methods=["GET"])
def obtener_proveedores():
    # Coloca el código dentro del contexto de la aplicación
    proveedores = catalogo.listar_proveedores()
    return jsonify(proveedores)

@app.route("/proveedor/<string:cuit_proveedor>", methods=["GET"])
def obtener_proveedor_segun_cuit(cuit_proveedor):
    # Coloca el código dentro del contexto de la aplicación
    proveedor = catalogo.listar_proveedor_segun_cuit(cuit_proveedor)
    return jsonify(proveedor)

@app.route("/proveedor/<string:cuit_proveedor>", methods=["POST"])
def agregar_proveedor(cuit_proveedor):
    nombre = request.form['nombre_prov']
    direccion = request.form['direccion_prov']
    email = request.form['email_prov']
    cuit = cuit_proveedor
    telefono = request.form['telefono_prov']
    
    if catalogo.agregar_proveedor(nombre, direccion, email, cuit, telefono):
        return jsonify({"mensaje": "Proveedor agregado"}), 201
    else:
        return jsonify({"mensaje": f"Ya existe el proveedor con CUIT {cuit}"}), 400

@app.route("/proveedor/<string:cuit_proveedor>", methods=["PUT"])
def actualizar_proveedor(cuit_proveedor):
    nombre = request.form['nombre_prov']
    direccion = request.form['direccion_prov']
    email = request.form['email_prov']
    cuit = cuit_proveedor
    telefono = request.form['telefono_prov']
    
    if catalogo.modificar_proveedor(nombre, direccion, email, cuit, telefono):
        return jsonify({"mensaje": "Proveedor actualizado"}), 201
    else:
        return jsonify({"mensaje": "No se puedo actualizar la información del proveedor"}), 400

@app.route("/proveedor/<string:cuit_proveedor>", methods=["DELETE"])
def borrar_proveedor(cuit_proveedor):
    # Coloca el código dentro del contexto de la aplicación
    if catalogo.borrar_proveedor(cuit_proveedor):
        return jsonify({"mensaje": "Proveedor eliminado"}), 201
    else:
        return jsonify({"mensaje": f"No se puedo eliminar el proveedor"}), 400



"""
#--------------------------------------------------------------------
@app.route("/productos/<int:id>", methods=["GET"])
def mostrar_producto(id):
    producto = catalogo.consultar_producto(id)
    if producto:
        return jsonify(producto)
    else:
        return "Producto no encontrado", 404

#--------------------------------------------------------------------
"""

if __name__ == "__main__":
    app.run(debug=True)



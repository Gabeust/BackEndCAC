import mysql.connector

class Catalogo:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )

        self.cursor = self.conn.cursor(dictionary=True)
        self.cursor.execute('''
        CREATE TABLE IF NOT EXISTS productos (
                ID INT NOT NULL AUTO_INCREMENT,
                codigo INT,
                nombre VARCHAR(255) NOT NULL,
                cantidad INT,
                precioCompra DECIMAL(10,2) NOT NULL,
                precioVenta DECIMAL(10,2) NOT NULL,
                imagen_url VARCHAR(255),
                proveedor INT(2),
                PRIMARY KEY (ID)
                );'''
        )

        self.conn.commit()

    def agregar_producto(self, id, cod, nom, can, preC, preV, img, pro):
        self.cursor.execute(f"SELECT * FROM productos WHERE ID = {id}")
        resultado = self.cursor.fetchone()
        if resultado:
            return False
        else:
            aux = f"INSERT INTO productos (ID, codigo, nombre, cantidad, precioCompra, precioVenta, imagen_url, proveedor) VALUES ({id}, {cod}, '{nom}', {can}, {preC}, {preV}, '{img}', {pro})"
            self.cursor.execute(aux)
            self.conn.commit()
            return True

    def eliminar_producto(self, cod):
        self.cursor.execute(f"DELETE FROM productos WHERE ID = {cod}")
        self.conn.commit()
        return self.cursor.rowcount > 0

    def consultar_producto(self, cod):
        self.cursor.execute(f"SELECT * FROM productos WHERE ID = {cod}")
        resultado = self.cursor.fetchone()
        return resultado

# Ejemplo de uso
mi_lista1 = Catalogo('localhost', 'root', '', 'el_cosito')
print(mi_lista1.agregar_producto(1, 123, 'Producto1', 10, 20.5, 30.0, 'imagen.jpg', 1))
print(mi_lista1.consultar_producto(1))
#print(mi_lista1.eliminar_producto(1))

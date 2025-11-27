import mysql.connector
from datetime import datetime
import sys
import os


# basta con el nombre del archivo:
RUTA_ARCHIVO = "deuda_clientes.txt"

DB_CONFIG = {
    "host": "localhost",
    "user": "root",      # usuario
    "password": "1234",  # clave de MySQL
    "database": "deudas_clientes",
}

def leer_archivo():
    """Lee el archivo de texto y devuelve una lista de líneas no vacías."""
    if not os.path.exists(RUTA_ARCHIVO):
        print("ERROR: archivo no encontrado")
        sys.exit(1)  # código 1 = archivo no encontrado

    with open(RUTA_ARCHIVO, "r", encoding="utf-8") as f:
        lineas = [l.strip() for l in f if l.strip()]
    return lineas

def validar_y_parsear(linea, num_linea):
    """Valida una línea y la transforma al formato que pide la tabla."""
    partes = linea.split(";")
    if len(partes) != 6:
        raise ValueError(f"Línea {num_linea}: cantidad de campos incorrecta")

    id_cliente, nombre, correo, monto_str, id_deuda, fecha_str = partes

    # monto numérico
    try:
        monto = float(monto_str)
    except ValueError:
        raise ValueError(f"Línea {num_linea}: monto_deuda no es numérico")

    # fecha DD-MM-YYYY
    try:
        fecha = datetime.strptime(fecha_str, "%d-%m-%Y").date()
    except ValueError:
        raise ValueError(
            f"Línea {num_linea}: fecha_vencimiento inválida (use DD-MM-YYYY)"
        )

    if not id_cliente or not id_deuda:
        raise ValueError(f"Línea {num_linea}: id_cliente o id_deuda vacío")

    # orden según la tabla: id_deuda, id_cliente, nombre, correo, monto, fecha
    return (id_deuda, id_cliente, nombre, correo, monto, fecha)

def insertar_en_bd(registros):
    """Inserta todos los registros válidos en la tabla deudas."""
    conn = mysql.connector.connect(**DB_CONFIG)
    cursor = conn.cursor()

    sql = """
        INSERT INTO deudas
        (id_deuda, id_cliente, nombre_cliente, correo, monto_deuda, fecha_vencimiento)
        VALUES (%s, %s, %s, %s, %s, %s)
    """

    try:
        cursor.executemany(sql, registros)
        conn.commit()
    except mysql.connector.Error as e:
        conn.rollback()
        print(f"ERROR BD: {e}")
        sys.exit(3)  # código 3 = error en BD
    finally:
        cursor.close()
        conn.close()

def main():
    try:
        lineas = leer_archivo()
        registros = []
        for i, linea in enumerate(lineas, start=1):
            registros.append(validar_y_parsear(linea, i))

        insertar_en_bd(registros)
        print("OK: archivo cargado correctamente")
        sys.exit(0)  # código 0 = éxito

    except ValueError as e:
        print(f"ERROR de formato: {e}")
        sys.exit(2)  # código 2 = error de formato

if __name__ == "__main__":
    main()

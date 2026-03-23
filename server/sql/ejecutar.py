import os
import re
import pyodbc
from dotenv import load_dotenv

# Cargar variables de entorno desde .env
load_dotenv()

# Configuración de la conexión a SQL Server usando variables de entorno
server = os.getenv('DB_SERVER')
database = os.getenv('DB_DATABASE')
username = os.getenv('DB_USER')
password = os.getenv('DB_PASSWORD')
port = 1433
driver = '{ODBC Driver 18 for SQL Server}'

# Orden explícito para evitar ambigüedades por nombre parcial.
archivos_sql_ordenados = [
    '01 - Tablas.sql',
    '02 - Triggers.sql',
    '03 - Comics.sql',
    '04 - Users.sql',
    '05 - Review.sql',
    '06 - Suppliers.sql',
    '07 - Compras.sql',
    '08 - Orders.sql',
]


def _validar_configuracion():
    faltantes = []
    if not server:
        faltantes.append('DB_SERVER')
    if not database:
        faltantes.append('DB_DATABASE')
    if not username:
        faltantes.append('DB_USER')
    if not password:
        faltantes.append('DB_PASSWORD')

    if faltantes:
        raise ValueError(
            'Faltan variables de entorno requeridas: ' + ', '.join(faltantes)
        )


def _crear_cadena_conexion(database_name):
    return (
        f'DRIVER={driver};'
        f'SERVER={server},{port};'
        f'DATABASE={database_name};'
        f'UID={username};'
        f'PWD={password};'
        'Encrypt=yes;'
        'TrustServerCertificate=yes;'
    )


def _dividir_lotes_por_go(sql_script):
    # GO es un separador de lotes del cliente (SSMS/sqlcmd), no de SQL Server.
    lotes = re.split(r'(?im)^\s*GO\s*$', sql_script)
    return [lote.strip() for lote in lotes if lote.strip()]


def _ejecutar_archivo(cursor, ruta_archivo):
    with open(ruta_archivo, 'r', encoding='utf-8') as archivo_sql:
        contenido = archivo_sql.read()

    lotes = _dividir_lotes_por_go(contenido)
    for indice, lote in enumerate(lotes, start=1):
        try:
            cursor.execute(lote)
            while cursor.nextset():
                pass
        except pyodbc.Error as error_sql:
            raise RuntimeError(
                f'Error en lote {indice} de {os.path.basename(ruta_archivo)}: {error_sql}'
            ) from error_sql

def ejecutar_archivos_sql(carpeta):
    conn_master = None
    conn_db = None

    try:
        _validar_configuracion()

        if not os.path.isdir(carpeta):
            raise FileNotFoundError(f'No existe la carpeta SQL: {carpeta}')

        print('1) Reiniciando base desde script de tablas...')
        ruta_tablas = os.path.join(carpeta, archivos_sql_ordenados[0])
        if not os.path.isfile(ruta_tablas):
            raise FileNotFoundError(f'No se encontró el archivo: {ruta_tablas}')

        conn_master = pyodbc.connect(_crear_cadena_conexion('master'), autocommit=True)
        cursor_master = conn_master.cursor()
        _ejecutar_archivo(cursor_master, ruta_tablas)
        print(f'   OK: {archivos_sql_ordenados[0]}')

        print('2) Ejecutando triggers y datos iniciales...')
        conn_db = pyodbc.connect(_crear_cadena_conexion(database), autocommit=False)
        cursor_db = conn_db.cursor()

        for nombre_archivo in archivos_sql_ordenados[1:]:
            ruta_archivo = os.path.join(carpeta, nombre_archivo)
            if not os.path.isfile(ruta_archivo):
                raise FileNotFoundError(f'No se encontró el archivo: {ruta_archivo}')

            print(f'   Ejecutando: {nombre_archivo}')
            try:
                _ejecutar_archivo(cursor_db, ruta_archivo)
                conn_db.commit()
                print(f'   OK: {nombre_archivo}')
            except Exception:
                conn_db.rollback()
                raise

        print('\nProceso completado correctamente.')
    except Exception as e:
        print(f"Error de conexión: {str(e)}")
    finally:
        if conn_db is not None:
            conn_db.close()
        if conn_master is not None:
            conn_master.close()
        print("Conexiones cerradas.")

carpeta_sql = os.path.dirname(os.path.abspath(__file__))
ejecutar_archivos_sql(carpeta_sql)
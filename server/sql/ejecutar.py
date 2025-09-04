import os
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

orden_ejecucion = [
    'tablas',
    'triggers',
    'comics',
    'users',
    'review',
    'suppliers',
    'orders',
    'compras'
]

def ejecutar_archivos_sql(carpeta):
    try:
        conn = pyodbc.connect(
            f'DRIVER={driver};SERVER={server},{port};DATABASE={database};UID={username};PWD={password}'
        )
        cursor = conn.cursor()
        print("Conexión establecida correctamente.")

        for categoria in orden_ejecucion:
            print(f"\nProcesando archivos de la categoría: {categoria}")
            archivos = [f for f in os.listdir(carpeta)
                        if f.endswith('.sql') and categoria.lower() in f.lower()]
            if not archivos:
                print(f"No se encontraron archivos para la categoría: {categoria}")
                continue
            for archivo in archivos:
                ruta_archivo = os.path.join(carpeta, archivo)
                print(f"Ejecutando: {archivo}")
                try:
                    with open(ruta_archivo, 'r', encoding='utf-8') as f:
                        sql_script = f.read()
                    cursor.execute(sql_script)
                    conn.commit()
                    print(f"Éxito al ejecutar {archivo}")
                except Exception as e:
                    conn.rollback()
                    print(f"Error al ejecutar {archivo}: {str(e)}")
        print("\nProceso completado.")
    except Exception as e:
        print(f"Error de conexión: {str(e)}")
    finally:
        if 'conn' in locals():
            conn.close()
            print("Conexión cerrada.")

carpeta_sql = r'C:\ruta\a\tu\carpeta\sql'
ejecutar_archivos_sql(carpeta_sql)
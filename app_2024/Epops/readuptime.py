from influxdb import InfluxDBClient

# Configurar la conexión a la base de datos InfluxDB
client = InfluxDBClient(host='influxdb', port=8086, database='influx')

def con_uptime(agentes):
    """
    Permite realizar consultas a una base de datos Influxdb acerca
    del tiempo que se ha mantenido encendido un dispistivo

    Parameters:
    agentes(list):      Direcciones IP de los dipositivos que se requiere obtener información

    Return:
    infuptime(dict):    Diccionario con los tiempos de uptime
    """
    infuptime = {}
    for agente in agentes:
        query = f'SELECT last("uptime") FROM "snmp" WHERE ("agent_host" = \'{agente}\') AND time >= now() - 20s AND time <= now() fill(null)'

        # Ejecutar la consulta para el agente actual
        result = client.query(query)

        # Imprimir los resultados para el agente actual
        for point in result.get_points():
            infuptime[agente] = float(point["last"])

    # Cerrar la conexión
    client.close()
    return infuptime


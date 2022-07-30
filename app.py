from flask import (Flask, render_template, redirect, url_for, request)
from flask_mysqldb import MySQL
import json
import requests

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'eu15.tmd.cloud'
app.config['MYSQL_USER'] = 'consume5_twinERGY'
app.config['MYSQL_PASSWORD'] = 'w*}S2x1pKMM='
app.config['MYSQL_DB'] = 'consume5_twinERGY'

mysql = MySQL(app)

@app.route("/")
@app.route("/index/")
@app.route("/dashboard/")
def rout():
    cur = mysql.connection.cursor()
    # Fetch data related to the Thermal Comfort for the Dashboard.
    cur.execute('''SELECT meteo_temperature_1, meteo_humidity_2 FROM weather_data_indoor ORDER BY meteo_timestamp LIMIT 1''')
    environmental_indoor_latest = cur.fetchone()
    cur.execute('''SELECT meteo_temperature_1, meteo_humidity_2, meteo_timestamp FROM weather_data_indoor WHERE meteo_user_id=1 ORDER BY meteo_timestamp LIMIT 60''')
    environmental_indoor_list = cur.fetchall()
    # Fetch data related to the Thermal Comfort for the Dashboard.
    cur.execute('''SELECT user_co, user_tvoc, user_timestamp FROM user_well_being_air WHERE user_id=1 ORDER BY user_timestamp LIMIT 1''')
    air_indoor_latest = cur.fetchone()
    cur.execute('''SELECT user_co, user_tvoc, user_timestamp FROM user_well_being_air WHERE user_id=1 ORDER BY user_timestamp LIMIT 60''')
    air_indoor_list = cur.fetchall()
    return render_template("dashboard.html", env_indoor = environmental_indoor_latest, env_indoor_list = json.dumps(environmental_indoor_list), air_indoor = air_indoor_latest, air_indoor_list = json.dumps(air_indoor_list))

@app.route("/energy_production/")
def energy_production():
    cur = mysql.connection.cursor()
    # Fetch data related to the Energy Production.
    cur.execute('''SELECT * FROM energy_production''')
    solar_power_data = cur.fetchall()
    return render_template("energy-production.html", solar_power_data = json.dumps(solar_power_data))

@app.route("/cdmp/")
def cdmp():
    headers = {"X-API-TOKEN": '8a3cb21d-be27-466d-a797-54fae21a0d8a'}
    url = "https://twinergy.s5labs.eu/api/query/6158624e-be36-4a5f-9374-f04bb5b10e0d"
    response = requests.get(url, headers=headers)
    response1 = response.json()
    cdmp_data = json.dumps(response1, indent=4)

    return render_template("cdmp.html", cdmp_data = cdmp_data)

if __name__ == "__main__":
    app.run(debug=True)
# Import flash framework to develop a web-based application in Python 3.8
from flask import (Flask, render_template, redirect, url_for, request)
from flask_mysqldb import MySQL

import json
import requests

import pandas

import datetime
import time

# Import scan_api library to connect with iSCAN DB
from scan_api import open_api

# Import thermal_comfort library to assess the occupant's thermal comfort
from thermal_comfort import pmv_ppd, pmvDescription, tc_metabolic_rate

app = Flask(__name__)

# Credentials to connect with mySQL DB of CDT UPAT
app.config['MYSQL_HOST'] = 'eu15.tmd.cloud'
app.config['MYSQL_USER'] = 'consume5_twinERGY'
app.config['MYSQL_PASSWORD'] = 'w*}S2x1pKMM='
app.config['MYSQL_DB'] = 'consume5_twinERGY'

mysql = MySQL(app)

def prefences_importance_method():
    cur = mysql.connection.cursor()

    cur.execute('''SELECT * FROM user_pref_thermal WHERE user_id='2' ORDER BY user_pref_time DESC''')
    preference_thermal_comfort = cur.fetchone()

    cur.execute('''SELECT * FROM user_flex_loads WHERE user_id='2' ORDER BY user_pref_time DESC''')
    preference_flex_loads = cur.fetchone()

    return [preference_thermal_comfort[1]+3, preference_thermal_comfort[2]+3, preference_flex_loads[1], preference_flex_loads[4], preference_flex_loads[7], preference_flex_loads[10], preference_flex_loads[2], preference_flex_loads[3], preference_flex_loads[5], preference_flex_loads[6], preference_flex_loads[8], preference_flex_loads[9], preference_flex_loads[11], preference_flex_loads[12]]


@app.route("/")
@app.route("/index/")
@app.route("/dashboard/")
def rout():

    cur = mysql.connection.cursor()
    # Fetch data related to the Thermal Comfort for the Dashboard.
    cur.execute('''SELECT AVG(tc_temperature), AVG(tc_humidity), SUM(tc_metabolic)  FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' AND gateway_id='gr-ac1f09fffe0609a8' ''')
    thermal_comfort = cur.fetchall()

    cur.execute('''SELECT tc_temperature, tc_humidity FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' AND gateway_id='gr-ac1f09fffe0609a8' ORDER BY tc_timestamp DESC LIMIT 60 ''')
    environmental_indoor_list = cur.fetchall()

    cur.execute('''SELECT AVG(tc_temperature), AVG(tc_humidity) FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' AND gateway_id='gr-ac1f09fffe0609a8' ORDER BY tc_timestamp DESC LIMIT 60 ''')
    thermal_comfort = cur.fetchall()

    cur.execute('''SELECT tc_metabolic FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' AND gateway_id='gr-ac1f09fffe0609a8' ORDER BY tc_timestamp DESC LIMIT 60 ''')
    metabolic_rate = cur.fetchall()

    met = tc_metabolic_rate(metabolic_rate)

    print(met)

    _token = "ghmgwr.xLF7Tm50OYe6x_FudBWPW6vR0.CnhEWIll7KPQxF0deT_79OvYMlG_FlC"
    _rootURL = "https://iscan-research.azurewebsites.net/project/TwinergyAthens"

    root = open_api(_rootURL, _token)
    token_use = root.get('tokens')
    building = next(b for b in root.Buildings if b.DisplayName == "ATH-1")
    building.refresh()

    channel_list = building.get('channel-list')
    channel = next(c for c in channel_list.Channels if c.DisplayName == "Electricity Tariff")

    data = channel.get('monthly', scenario="Default", year=2021, month=11)

    tair = thermal_comfort[0][0]
    tmrt = 0.935*tair + 1.709
    rhum = thermal_comfort[0][1]
    airv = 0.1
    clo = 0.8

    pmv = round(pmv_ppd(tair, tmrt, rhum, met, 0.8, 0.1), 3)

    pmv_desc = pmvDescription(pmv)

    return render_template("dashboard.html", pmv=pmv, pmv_desc=pmv_desc, energy_tariff=data.Interpolated[0:100], env_indoor=[thermal_comfort[0][0], thermal_comfort[0][1]], met=met, env_indoor_list=json.dumps(environmental_indoor_list))

@app.route("/energy_production/")
def energy_production():
    cur = mysql.connection.cursor()
    # Fetch data related to the Energy Production.
    cur.execute('''SELECT * FROM energy_production''')
    solar_power_data = cur.fetchall()
    return render_template("energy-production.html", solar_power_data=json.dumps(solar_power_data))


@app.route("/clothing_insulation/")
def clothing_insulation():
    return render_template("clothing-insulation.html")


@app.route("/helpdesk/", methods=["GET", "POST"])
def helpdesk():
    if request.method == "POST":
        presentDate = datetime.datetime.now()
        unix_timestamp = (int(datetime.datetime.timestamp(presentDate) * 1000))

        subject = request.form.get("subject")
        message = request.form.get("message")

        cur = mysql.connection.cursor()
        cur.execute('''INSERT INTO helpdesk_tickets VALUES (%s, 1, "chrismountzou@gmail.com", "%s", "%s") ''', (
            unix_timestamp, subject, message))
        mysql.connection.commit()

        return render_template("helpdesk.html")

    return render_template("helpdesk.html")


@app.route("/preferences/", methods=["GET", "POST"])
def preferences():
    cur = mysql.connection.cursor()

    if request.method == "POST":
        presentDate = datetime.datetime.now()
        unix_timestamp = (int(datetime.datetime.timestamp(presentDate)))

        importnace_thermal_comfort = request.form.get("preference_thermal_comfort").split(';')

        importnace_electric_vehicle = request.form.get("preference_electric_vehicle")

        thermal_dict = {-3: "Cold", -2: "Cool", -1: "Slightly Cool", 0: "Neutral",
                           1: "Slightly Warm", 2: "Warm", 3: "Hot"}

        importance_dict = {1: "Not Important", 2: "Slightly Important", 3: "Important", 4: "Fairly Important",
                           5: "Very Important"}

        thermal_tolerance_list = []

        for thermal_tolerance in importnace_thermal_comfort:
            preference_thermal_comfort = (
                list(thermal_dict.keys())[list(thermal_dict.values()).index(thermal_tolerance)])
            thermal_tolerance_list.append(preference_thermal_comfort)

        importnace_ev_range = request.form.get("preference_electric_vehicle_range").split(';')
        importnace_dw_range = request.form.get("preference_range_dish_washer").split(';')
        importnace_wm_range = request.form.get("preference_range_washing_machine").split(';')
        importnace_ht_range = request.form.get("preference_range_drier").split(';')

        ev_start, ev_end = int(importnace_ev_range[0].split(":")[0]), int(importnace_ev_range[1].split(":")[0])
        dw_start, dw_end = int(importnace_dw_range[0].split(":")[0]), int(importnace_dw_range[1].split(":")[0])
        wm_start, wm_end = int(importnace_wm_range[0].split(":")[0]), int(importnace_wm_range[1].split(":")[0])
        ht_start, ht_end = int(importnace_ht_range[0].split(":")[0]), int(importnace_ht_range[1].split(":")[0])

        importance_ev = list(importance_dict.keys())[list(importance_dict.values()).index(request.form.get("preference_electric_vehicle"))] - 1
        importance_dw = list(importance_dict.keys())[list(importance_dict.values()).index(request.form.get("preference_dish_washer"))] - 1
        importance_wm = list(importance_dict.keys())[list(importance_dict.values()).index(request.form.get("preference_washing_machine"))] - 1
        importance_ht = list(importance_dict.keys())[list(importance_dict.values()).index(request.form.get("preference_tumble"))] - 1

        cur.execute('''INSERT INTO user_pref_thermal VALUES (2, "%s", "%s" , %s, '') ''', (
            thermal_tolerance_list[0], thermal_tolerance_list[1], unix_timestamp))

        cur.execute('''INSERT INTO user_flex_loads VALUES (2, "%s", "%s" , "%s", "%s", "%s", "%s", "%s", "%s" , "%s", "%s", "%s", "%s", "%s" ) ''', (
            importance_ev, ev_start, ev_end, importance_ht, ht_start, ht_end, importance_wm, wm_start, wm_end,
            importance_dw, dw_start, dw_end, unix_timestamp
        ))

        mysql.connection.commit()

    preferences_importance = prefences_importance_method()

    return render_template("preferences.html", preferences_importance=preferences_importance)


@app.route("/energy_consumption/")
def cdmp():
    headers = {"X-API-TOKEN": '8a3cb21d-be27-466d-a797-54fae21a0d8a'}
    url = "https://twinergy.s5labs.eu/api/query/6158624e-be36-4a5f-9374-f04bb5b10e0d"
    response = requests.get(url, headers=headers)
    response1 = response.json()
    cdmp_data = json.dumps(response1, indent=4)
    cdmp_data_json = json.loads(cdmp_data)

    air_condition_consumption = []
    air_condition_time = []

    for x in range(0, 168, 1):
        d = datetime.datetime.strptime(
            cdmp_data_json[1][x]['DemandMeasurement']['observedDateTime'], '%Y-%m-%dT%H:%M:%S.%fZ')
        air_condition_consumption.append(cdmp_data_json[1][x]['DemandMeasurement']['totalConsumptionHourly'][0])
        air_condition_time.append(datetime.date.strftime(d, "%d/%m/%y - %H:%M"))

    return render_template("energy-consumption.html", air_condition_time=air_condition_time, air_condition_consumption=air_condition_consumption)


if __name__ == "__main__":
    app.run(debug=True)

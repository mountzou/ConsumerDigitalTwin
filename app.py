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

from thermal_comfort import pmv_ppd

app = Flask(__name__)

# Credentials to connect with mySQL DB of CDT UPAT
app.config['MYSQL_HOST'] = 'eu15.tmd.cloud'
app.config['MYSQL_USER'] = 'consume5_twinERGY'
app.config['MYSQL_PASSWORD'] = 'w*}S2x1pKMM='
app.config['MYSQL_DB'] = 'consume5_twinERGY'

mysql = MySQL(app)

def pmvDescription(pmv):
    if (-0.5 <= pmv <= 0.5):
        return 'Neutral'
    elif (-1.5 <= pmv < -0.5):
        return 'Slightly Cool'
    elif (0.5 <= pmv < 1.5):
        return 'Slightly Warm'
    elif (-2.5 <= pmv < -1.5):
        return 'Cool'
    elif (1.5 <= pmv < 2.5):
        return 'Warm'
    elif (pmv > 2.5):
        return 'Hot'
    elif (pmv < -2.5):
        return 'Cold'
    else:
        return 'In progress..'

def prefences_importance_method():
    cur = mysql.connection.cursor()

    cur.execute('''SELECT preference_value FROM mcda_preferences WHERE(user_id='2' and preference_code = '1') ORDER BY preference_timestamp DESC''')
    preference_thermal_comfort = cur.fetchone()

    cur.execute('''SELECT preference_value FROM mcda_preferences WHERE(user_id='2' and preference_code = '2') ORDER BY preference_timestamp DESC''')
    preference_well_being = cur.fetchone()

    cur.execute('''SELECT preference_value FROM mcda_preferences WHERE(user_id='2' and preference_code = '3') ORDER BY preference_timestamp DESC''')
    preference_energy_flexibility = cur.fetchone()

    cur.execute('''SELECT preference_value FROM mcda_preferences WHERE(user_id='2' and preference_code = '4') ORDER BY preference_timestamp DESC''')
    preference_eco_friendliness = cur.fetchone()

    cur.execute('''SELECT preference_value FROM mcda_preferences WHERE(user_id='2' and preference_code = '5') ORDER BY preference_timestamp DESC''')
    preference_financial_balalnce = cur.fetchone()

    cur.execute('''SELECT preference_value FROM mcda_preferences WHERE(user_id='2' and preference_code = '6') ORDER BY preference_timestamp DESC''')
    preference_water_heater = cur.fetchone()

    cur.execute('''SELECT preference_value FROM mcda_preferences WHERE(user_id='2' and preference_code = '7') ORDER BY preference_timestamp DESC''')
    preference_freezer = cur.fetchone()

    preferences_importance = [preference_thermal_comfort[0], preference_well_being[0], preference_energy_flexibility[0],
                              preference_eco_friendliness[0], preference_financial_balalnce[0],
                              preference_water_heater[0], preference_freezer[0]]

    return preferences_importance


@app.route("/")
@app.route("/index/")
@app.route("/dashboard/")
def rout():
    cur = mysql.connection.cursor()
    # Fetch data related to the Thermal Comfort for the Dashboard.
    cur.execute('''SELECT user_temp, user_humidity FROM user_thermal_meteo WHERE user_id=2 ORDER BY user_timestamp DESC LIMIT 1''')
    environmental_indoor_latest = cur.fetchone()
    cur.execute('''SELECT user_temp, user_humidity, user_timestamp FROM user_thermal_meteo WHERE user_id=2 ORDER BY user_timestamp DESC LIMIT 60''')
    environmental_indoor_list = cur.fetchall()
    # Fetch data related to the Thermal Comfort for the Dashboard.
    cur.execute('''SELECT user_co, user_tvoc, user_iaq user_timestamp FROM user_well_being_air WHERE user_id=2 ORDER BY user_timestamp DESC LIMIT 1''')
    air_indoor_latest = cur.fetchone()
    cur.execute('''SELECT user_co, user_tvoc, user_iaq user_timestamp FROM user_well_being_air WHERE user_id=2 ORDER BY user_timestamp DESC LIMIT 60''')
    air_indoor_list = cur.fetchall()

    _token = "ghmgwr.xLF7Tm50OYe6x_FudBWPW6vR0.CnhEWIll7KPQxF0deT_79OvYMlG_FlC"
    _rootURL = "https://iscan-research.azurewebsites.net/project/TwinergyAthens"

    # root = open_api(_rootURL, _token)
    # token_use = root.get('tokens')
    # building = next(b for b in root.Buildings if b.DisplayName == "ATH-1")
    # building.refresh()

    # channel_list = building.get('channel-list')
    # channel = next(c for c in channel_list.Channels if c.DisplayName == "Electricity Tariff")

    # data = channel.get('monthly', scenario="Default", year=2021, month=11)
    # print(data.Interpolated[0:100])

    tair = environmental_indoor_latest[0]
    tmrt = 0.935*tair + 1.709
    rhum = environmental_indoor_latest[1]
    airv = 0.1
    met = 1
    clo = 0.8

    pmv = round(pmv_ppd(tair, tmrt, rhum, 1, 0.8, 0.1), 2)

    pmv_desc = pmvDescription(pmv)

    return render_template("dashboard.html", pmv=pmv, pmv_desc=pmv_desc, env_indoor=environmental_indoor_latest, env_indoor_list=json.dumps(environmental_indoor_list), air_indoor=air_indoor_latest, air_indoor_list=json.dumps(air_indoor_list))


    # return render_template("dashboard.html", pmv=pmv, energy_tariff=data.Interpolated[0:100], env_indoor=environmental_indoor_latest, env_indoor_list=json.dumps(environmental_indoor_list), air_indoor=air_indoor_latest, air_indoor_list=json.dumps(air_indoor_list))


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

        importnace_thermal_comfort = request.form.get("preference_thermal_comfort")
        importnace_well_being = request.form.get("preference_well_being")
        importnace_water_heater = request.form.get("preference_water_heater")
        importnace_freezer = request.form.get("preference_freezer")
        importnace_flexibility = request.form.get("preference_energy_flexibility")
        importnace_eco_friendliness = request.form.get("preference_eco_friendly")
        importance_financial = request.form.get("preference_financial_balance")

        importance_dict = {1: "Not Important", 2: "Slightly Important", 3: "Important", 4: "Fairly Important",
                           5: "Very Important"}

        preference_thermal_comfort = (
            list(importance_dict.keys())[list(importance_dict.values()).index(importnace_thermal_comfort)])
        preference_well_being = (
            list(importance_dict.keys())[list(importance_dict.values()).index(importnace_well_being)])
        preference_water_heater = (
            list(importance_dict.keys())[list(importance_dict.values()).index(importnace_water_heater)])
        preference_freezer = (list(importance_dict.keys())[list(importance_dict.values()).index(importnace_freezer)])
        preference_flexibility = (
            list(importance_dict.keys())[list(importance_dict.values()).index(importnace_flexibility)])
        preference_eco_friendliness = (
            list(importance_dict.keys())[list(importance_dict.values()).index(importnace_eco_friendliness)])
        preference_financial = (
            list(importance_dict.keys())[list(importance_dict.values()).index(importance_financial)])

        cur.execute('''INSERT INTO mcda_preferences VALUES (2, 'Thermal Comfort', 1, "%s" , %s) ''', (
            preference_thermal_comfort, unix_timestamp))
        cur.execute('''INSERT INTO mcda_preferences VALUES (2, 'Well-Being', 2, "%s" , %s) ''', (
            preference_well_being, unix_timestamp))
        cur.execute('''INSERT INTO mcda_preferences VALUES (2, 'Energy Flexibility', 3, "%s" , %s) ''', (
            preference_flexibility, unix_timestamp))
        cur.execute('''INSERT INTO mcda_preferences VALUES (2, 'Eco-Friendliness', 4, "%s" , %s) ''', (
            preference_eco_friendliness, unix_timestamp))
        cur.execute('''INSERT INTO mcda_preferences VALUES (2, 'Financial Balance', 5, "%s" , %s) ''', (
            preference_financial, unix_timestamp))
        cur.execute('''INSERT INTO mcda_preferences VALUES (2, 'Water Heater', 6, "%s" , %s) ''', (
            preference_water_heater, unix_timestamp))
        cur.execute('''INSERT INTO mcda_preferences VALUES (2, 'Electric Freezer', 7, "%s" , %s) ''', (
            preference_freezer, unix_timestamp))

        mysql.connection.commit()

        prefences_importance = prefences_importance_method()

        return render_template("preferences.html", preferences_importance=prefences_importance)

    prefences_importance = prefences_importance_method()

    return render_template("preferences.html", preferences_importance=prefences_importance)


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

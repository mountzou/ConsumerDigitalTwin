# Import flash framework to develop a web-based application in Python 3.8
import pandas as pd
import numpy as np

from flask import (Flask, render_template, redirect, url_for, request)
from flask_mysqldb import MySQL

import json
import requests

import pandas

import datetime
import time

from functools import reduce

# Import scan_api library to connect with iSCAN DB
from scan_api import open_api

# Import thermal_comfort library to assess the occupant's thermal comfort
from thermal_comfort import pmv_ppd, pmvDescription, tc_metabolic_rate

from simosMethod import determineWeights

from metabolic_rate import metabolic_rate_calculation

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

def prefences_simos_importance_method():
    cur = mysql.connection.cursor()

    cur.execute('''SELECT * FROM load_weight_simos WHERE user_id='2' ORDER BY weight_timestamp DESC''')
    preference_flex_loads = cur.fetchone()

    return [preference_flex_loads[1], preference_flex_loads[2], preference_flex_loads[3], preference_flex_loads[4]]


@app.route("/")
@app.route("/index/")
@app.route("/dashboard/")
def rout():

    cur = mysql.connection.cursor()
    # Fetch data related to the Thermal Comfort for the Dashboard.
    cur.execute('''SELECT AVG(tc_temperature), AVG(tc_humidity), SUM(tc_metabolic)  FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' AND gateway_id='gr-ac1f09fffe0609a8' ORDER BY tc_timestamp DESC LIMIT 60 ''')
    thermal_comfort = cur.fetchall()

    cur.execute('''SELECT tc_temperature FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' AND gateway_id='gr-ac1f09fffe0609a8' ORDER BY tc_timestamp DESC LIMIT 1 ''')
    temp_latest = cur.fetchall()

    cur.execute('''SELECT tc_temperature, tc_humidity FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' AND gateway_id='gr-ac1f09fffe0609a8' ORDER BY tc_timestamp DESC LIMIT 3600 ''')
    environmental_indoor_list = cur.fetchall()

    cur.execute('''SELECT AVG(tc_temperature), AVG(tc_humidity) FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' AND gateway_id='gr-ac1f09fffe0609a8' ORDER BY tc_timestamp DESC LIMIT 3600 ''')
    thermal_comfort = cur.fetchall()

    cur.execute('''SELECT * FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' ORDER BY tc_timestamp ASC LIMIT 3600''')
    metabolic_rate = cur.fetchall()

    met = round(metabolic_rate_calculation(metabolic_rate), 2)

    _token = "ghmgwr.xLF7Tm50OYe6x_FudBWPW6vR0.CnhEWIll7KPQxF0deT_79OvYMlG_FlC"
    _rootURL = "https://iscan-research.azurewebsites.net/project/TwinergyAthens"

    root = open_api(_rootURL, _token)
    token_use = root.get('tokens')
    building = next(b for b in root.Buildings if b.DisplayName == "ATH-2")
    building.refresh()

    channel_list = building.get('channel-list')

    electricity_tariff_channel = next(c for c in channel_list.Channels if c.DisplayName == "Electricity Tariff")
    oven_demand_channel = next(c for c in channel_list.Channels if c.DisplayName == "Oven")
    hifi_demand_channel = next(c for c in channel_list.Channels if c.DisplayName == "HiFi")
    fridge_demand_channel = next(c for c in channel_list.Channels if c.DisplayName == "FridgeFreezer")
    refrigerator_demand_channel = next(c for c in channel_list.Channels if c.DisplayName == "Refrigerator")
    washing_machine_demand_channel = next(c for c in channel_list.Channels if c.DisplayName == "WashingMachine")


    data_tariff = electricity_tariff_channel.get('monthly', scenario="Default", year=2021, month=9)
    oven_demand = oven_demand_channel.get('monthly', scenario="Default", year=2021, month=9)
    hifi_demand = hifi_demand_channel.get('monthly', scenario="Default", year=2021, month=9)
    fridge_demand = fridge_demand_channel.get('monthly', scenario="Default", year=2021, month=9)
    refrigerator_demand = refrigerator_demand_channel.get('monthly', scenario="Default", year=2021, month=9)
    washing_machine_demand = washing_machine_demand_channel.get('monthly', scenario="Default", year=2021, month=9)

    oven_demand_df = pd.DataFrame(oven_demand.Derived)
    hifi_demand_df = pd.DataFrame(hifi_demand.Derived)
    fridge_demand_df = pd.DataFrame(fridge_demand.Derived)
    refrigerator_demand_df = pd.DataFrame(refrigerator_demand.Derived)
    washing_machine_demand_df = pd.DataFrame(washing_machine_demand.Derived)

    oven_montly_demand = round((oven_demand_df.sum()/(len(oven_demand.Derived)/6))[0], 2)
    hifi_montly_demand = round((hifi_demand_df.sum()/(len(hifi_demand.Derived)/6))[0], 2)
    fridge_montly_demand = round((fridge_demand_df.sum()/(len(fridge_demand.Derived)/6))[0], 2)
    refrigerator_montly_demand = round((refrigerator_demand_df.sum()/(len(refrigerator_demand.Derived)/6))[0], 2)
    washing_machine_montly_demand = round((washing_machine_demand_df.sum()/(len(washing_machine_demand.Derived)/6))[0], 2)

    energy_tariff_df = pd.DataFrame(data_tariff.Derived)

    mean_monthly_energy_tariff = energy_tariff_df.mean().astype(float)
    mean_daily_energy_tariff = energy_tariff_df[-24:].mean().astype(float)

    pricing_df = [energy_tariff_df, washing_machine_demand_df]

    df = reduce(lambda x,y: pd.merge(x, y, left_index=True, right_index=True, how='outer'), [energy_tariff_df, oven_demand_df, fridge_demand_df, refrigerator_demand_df, refrigerator_demand_df, washing_machine_demand_df]).add_suffix('_loc')

    tair = round(thermal_comfort[0][0], 2)
    tmrt = 0.935*tair + 1.709
    rhum = round(thermal_comfort[0][1], 2)
    airv = 0.1
    clo = 0.8

    pmv = round(pmv_ppd(tair, tmrt, rhum, met, 0.8, 0.1), 2)

    pmv_desc = pmvDescription(pmv)

    return render_template("dashboard.html", energy_demand=[oven_montly_demand, hifi_montly_demand, fridge_montly_demand, refrigerator_montly_demand, washing_machine_montly_demand], pmv=pmv, pmv_desc=pmv_desc, energy_tariff=[round(mean_monthly_energy_tariff[0],2), round(mean_daily_energy_tariff[0], 2)], env_indoor=[round(thermal_comfort[0][0], 2), round(thermal_comfort[0][1], 2)], met=met, env_indoor_list=json.dumps(environmental_indoor_list), temp_latest=temp_latest)

@app.route("/energy_production/")
def energy_production():
    cur = mysql.connection.cursor()
    # Fetch data related to the Energy Production.
    cur.execute('''SELECT * FROM energy_production''')
    solar_power_data = cur.fetchall()
    return render_template("energy-production.html", solar_power_data=json.dumps(solar_power_data))

@app.route("/thermal-comfort/")
def thermal_comfort():
    cur = mysql.connection.cursor()
    # Fetch data related to the Thermal Comfort
    cur.execute('''SELECT * FROM user_thermal_comfort WHERE wearable_id='0080E1150510B276' ORDER BY tc_timestamp ASC LIMIT 3600''')
    thermal_comfort_data = cur.fetchall()

    met = metabolic_rate_calculation(thermal_comfort_data)

    timestamp, indoor_temperature, indoor_mr_temperature, indoor_humidity, indoor_temperature_time, metabolic_rate = [], [], [], [], [], []

    prev_timestamp, prev_metabolic = int(thermal_comfort_data[0][5]), int(thermal_comfort_data[0][4])

    for tc in thermal_comfort_data:
        timestamp.append(datetime.datetime.fromtimestamp(int(tc[5])))
        indoor_temperature.append(tc[2])
        indoor_mr_temperature.append(0.935*tc[2] + 1.709)
        indoor_humidity.append(tc[3])

        cur_timestamp, cur_metabolic = int(tc[5]), tc[4]

        if (int(cur_timestamp)-int(prev_timestamp))>0:
            if (cur_metabolic-prev_metabolic>0):
                met = (((cur_metabolic-prev_metabolic)/(int(cur_timestamp)-int(prev_timestamp)))/0.025)
                if (round(met,2)>=0.8):
                    metabolic_rate.append(round(met,2))
                else:
                    metabolic_rate.append(1)
            else:
                metabolic_rate.append(1)
        else:
            metabolic_rate.append(1)

        prev_timestamp, prev_metabolic = int(tc[5]), tc[4]

    df = pd.DataFrame()

    df['Time'], df['IndoorTemp'], df['MearRanTemp'], df['IndoorHum'] = pd.to_datetime(timestamp, format='%d/%m/%y - %H:%M'), indoor_temperature, indoor_mr_temperature, indoor_humidity

    df['Minute'], df['Hour'], df['Day'], df['Month'], df['Year'] = df.Time.dt.minute, df.Time.dt.hour, df.Time.dt.day, df.Time.dt.month, df.Time.dt.year

    indoor_temperature = round((df.groupby(df.Time.dt.minute)['IndoorTemp'].mean()),2).array
    indoor_humidity = round((df.groupby(df.Time.dt.minute)['IndoorHum'].mean()), 2).array
    indoor_temperature_time_arr = df.groupby(df.Time.dt.minute)['Time'].apply(lambda x: list(np.unique(x))).array

    indoor_temperature_arr, indoor_mr_temperature_arr, indoor_humidity_arr, metabolic_arr, thermal_comfort_arr, time_arr = [], [], [], [], [], []

    for temp in indoor_temperature:
        indoor_temperature_arr.append(temp)
        indoor_mr_temperature_arr.append(round(0.935*temp + 1.709,2))

    for hum in indoor_humidity:
        indoor_humidity_arr.append(round(hum,2))

    for met in metabolic_rate:
        metabolic_arr.append(met)

    for dates in indoor_temperature_time_arr:
        time_arr.append(str(dates[0])[:16])

    for i in range(0, len(time_arr)):
        pmv = round(pmv_ppd(indoor_temperature_arr[i], indoor_mr_temperature_arr[i], indoor_humidity_arr[i], metabolic_arr[i], 0.8, 0.1), 2)
        thermal_comfort_arr.append(pmv)

    print(thermal_comfort_arr)

    return render_template("thermal-comfort.html", thermal_comfort_arr=thermal_comfort_arr, metabolic_arr=metabolic_arr, indoor_humidity_arr=indoor_humidity_arr, indoor_temperature_arr=indoor_temperature_arr, indoor_mr_temperature_arr=indoor_mr_temperature_arr, time_arr=time_arr, thermal_comfort_data=json.dumps(thermal_comfort_data))


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

        preferences_loads = {"Electric Vehicle": importance_ev+1, "Dish Washer": importance_dw+1, "Washing Machine": importance_wm+1, "Tumble Drier": importance_ht+1}

        weights = determineWeights(preferences_loads)

        cur.execute('''INSERT INTO load_weight_simos VALUES (2, "%s", "%s", "%s", "%s", "%s" ) ''', (
            float(weights['Electric Vehicle'][0]), float(weights['Tumble Drier'][0]), float(weights['Washing Machine'][0]), float(weights['Dish Washer'][0]),
            unix_timestamp
        ))

        mysql.connection.commit()

    preferences_importance = prefences_importance_method()

    preferences_simos = prefences_simos_importance_method()

    return render_template("preferences.html", preferences_importance=preferences_importance, preferences_simos=preferences_simos)


@app.route("/energy_consumption/")
def getEnergyConsumption():
    headers = {"X-API-TOKEN": '8a3cb21d-be27-466d-a797-54fae21a0d8a'}
    url = "https://twinergy.s5labs.eu/api/query/6158624e-be36-4a5f-9374-f04bb5b10e0d?DemandMeasurement.relatedAirCoolingSystem.id=grTg0R06"
    response = requests.get(url, headers=headers)
    response_as_json = response.json()
    cdmp_data = json.dumps(response_as_json, indent=4)
    cdmp_data_json = json.loads(cdmp_data)

    hvac_dataframe = pd.DataFrame()

    air_condition_consumption = []
    air_condition_consumption_daily = []
    air_condition_time = []
    air_condition_time_daily = []

    for x in range(0, len(cdmp_data_json[1]), 1):
        d = datetime.datetime.strptime(
            cdmp_data_json[1][x]['DemandMeasurement']['observedDateTime'], '%Y-%m-%dT%H:%M:%S.%fZ')
        air_condition_consumption.append(cdmp_data_json[1][x]['DemandMeasurement']['totalConsumptionHourly'][0])
        air_condition_time.append(datetime.date.strftime(d, "%d/%m/%y - %H:%M"))

    hvac_dataframe['Time'] = pd.to_datetime(air_condition_time, format='%d/%m/%y - %H:%M')
    hvac_dataframe['Demand'] = air_condition_consumption

    hvac_daily_demand = (hvac_dataframe.groupby(hvac_dataframe.Time.dt.day)['Demand'].sum()).array

    day_counter = 1

    for x in hvac_daily_demand:
        air_condition_consumption_daily.append(x)
        air_condition_time_daily.append(str(day_counter)+'/03/20')
        day_counter = day_counter + 1

    mean_air_condition_consumption = round(sum(air_condition_consumption_daily) / len(air_condition_consumption_daily),2)

    return render_template("energy-consumption.html", hvac_id='grTg0R06', mean_air_condition_consumption=mean_air_condition_consumption, air_condition_consumption_daily=air_condition_consumption_daily, air_condition_time_daily=air_condition_time_daily, air_condition_time=air_condition_time, air_condition_consumption=air_condition_consumption)


if __name__ == "__main__":
    app.run(debug=True)

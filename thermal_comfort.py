import math


def tc_metabolic_rate(metabolic_rate):
    metabolic_sum = 0
    metabolic_count = 0

    met_prev = metabolic_rate[0][0]

    for met in metabolic_rate:
        if (met[0] - met_prev) > 0:
            metabolic_count += 1
            metabolic_sum += (met[0] - met_prev) * (10 / 2)
        elif (met[0] - met_prev) > 0:
            metabolic_sum += 0
            metabolic_count += 0
        else:
            metabolic_count = 0
            metabolic_sum = 0
        met_prev = met[0]

    met = 1.2

    if metabolic_count > 0 and metabolic_sum > 0.5:
        met = round(metabolic_sum / metabolic_count, 2)
    else:
        met = 1.2

    return met

# Custom function to convert PMV into literal corresponding value
def pmvDescription(pmv):
    if -0.5 <= pmv <= 0.5:
        return 'Neutral'
    elif -1.5 <= pmv < -0.5:
        return 'Slightly Cool'
    elif 0.5 <= pmv < 1.5:
        return 'Slightly Warm'
    elif -2.5 <= pmv < -1.5:
        return 'Cool'
    elif 1.5 <= pmv < 2.5:
        return 'Warm'
    elif pmv > 2.5:
        return 'Hot'
    elif pmv < -2.5:
        return 'Cold'
    else:
        return 'In progress..'


def pmv_ppd(tr, tdb, rh, met, clo, vr, wme=0):
    pa = rh * 10 * math.exp(16.6536 - 4030.183 / (tdb + 235))

    icl = 0.155 * clo  # thermal insulation of the clothing in M2K/W
    m = met * 58.15  # metabolic rate in W/M2
    w = wme * 58.15  # external work in W/M2
    mw = m - w  # internal heat production in the human body
    # calculation of the clothing area factor
    if icl <= 0.078:
        f_cl = 1 + (1.29 * icl)  # ratio of surface clothed body over nude body
    else:
        f_cl = 1.05 + (0.645 * icl)

    # heat transfer coefficient by forced convection
    hcf = 12.1 * math.sqrt(vr)
    hc = hcf  # initialize variable
    taa = tdb + 273
    tra = tr + 273
    t_cla = taa + (35.5 - tdb) / (3.5 * icl + 0.1)

    p1 = icl * f_cl
    p2 = p1 * 3.96
    p3 = p1 * 100
    p4 = p1 * taa
    p5 = (308.7 - 0.028 * mw) + (p2 * (tra / 100.0) ** 4)
    xn = t_cla / 100
    xf = t_cla / 50
    eps = 0.00015

    n = 0
    while abs(xn - xf) > eps:
        xf = (xf + xn) / 2
        hcn = 2.38 * abs(100.0 * xf - taa) ** 0.25
        if hcf > hcn:
            hc = hcf
        else:
            hc = hcn
        xn = (p5 + p4 * hc - p2 * xf ** 4) / (100 + p3 * hc)
        n += 1
        if n > 150:
            raise StopIteration("Max iterations exceeded")

    tcl = 100 * xn - 273

    # heat loss diff. through skin
    hl1 = 3.05 * 0.001 * (5733 - (6.99 * mw) - pa)
    # heat loss by sweating
    if mw > 58.15:
        hl2 = 0.42 * (mw - 58.15)
    else:
        hl2 = 0
    # latent respiration heat loss
    hl3 = 1.7 * 0.00001 * m * (5867 - pa)
    # dry respiration heat loss
    hl4 = 0.0014 * m * (34 - tdb)
    # heat loss by radiation
    hl5 = 3.96 * f_cl * (xn ** 4 - (tra / 100.0) ** 4)
    # heat loss by convection
    hl6 = f_cl * hc * (tcl - tdb)

    ts = 0.303 * math.exp(-0.036 * m) + 0.028
    pmv = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6)

    return pmv

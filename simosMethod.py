import numpy as np

from collections import defaultdict

subsets = []


def determineWeights(preferences):
    res = defaultdict(list)
    for key, val in sorted(preferences.items()):
        res[val].append(key)

    sorted_res = sorted(res.items())

    importance_levels_exists = []
    array_loc = 0
    final_dict = []
    final_list = []

    for i in range(1, 6):
        for p in sorted_res:
            if p[0] == i:
                importance_levels_exists.append(i)
                final_dict.append(p[1])

    for i in range(1, 6):
        if i in importance_levels_exists:
            final_list.append(final_dict[array_loc])
            array_loc = array_loc + 1
        else:
            final_list.append(['w'])

    subsets = np.array(final_list)

    # parameter z
    z = 6.5

    # calculate number of cards, positions, and vector c
    noCards, positions = 0, 0
    c = []

    for i in range(subsets.shape[0]):
        if subsets[i][0] != 'w':
            noCards = noCards + len(subsets[i][:])
            positions = positions + 1
            c.append(len(subsets[i][:]))

    U = round((z - 1) / positions, 6)

    e = np.ones(positions)

    counter = -1

    for i in range(subsets.shape[0]):
        if subsets[i][0] != 'w':
            counter = counter + 1
        else:
            e[counter] = e[counter] + 1

    k = np.ones(positions)
    toTalk = k[0] * c[0]

    for i in range(1, positions):
        k[i] = 1 + U * sum(e[0:i])
        toTalk = toTalk + k[i] * c[i]

    normalizedWeights = np.zeros(positions)
    for i in range(0, positions):
        normalizedWeights[i] = (100 / toTalk) * k[i]

    counter = -1

    weight_array = {"Electric Vehicle": [], "Tumble Drier": [], "Washing Machine": [], "Dish Washer": []}

    for i in range(subsets.shape[0]):
        if subsets[i][0] != 'w':
            counter = counter + 1
        else:
            continue
        for j in range(len(subsets[i][:])):
            if subsets[i][j] == "Washing Machine":
                weight_array["Washing Machine"].append(round(normalizedWeights[counter], 2))
            if subsets[i][j] == "Tumble Drier":
                weight_array["Tumble Drier"].append(round(normalizedWeights[counter], 2))
            if subsets[i][j] == "Electric Vehicle":
                weight_array["Electric Vehicle"].append(round(normalizedWeights[counter], 2))
            if subsets[i][j] == "Dish Washer":
                weight_array["Dish Washer"].append(round(normalizedWeights[counter], 2))

    return weight_array

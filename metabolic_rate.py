def metabolic_rate_calculation(thermal_comfort_data):
    metabolic_rate_counter = 0
    metabolic_rate_init = 0
    metabolic_rate_previous = 0
    timestamp_init, timestamp_end = 0, 0

    for tc in thermal_comfort_data:
        if metabolic_rate_init == 0:
            metabolic_rate_init, metabolic_rate_previous = 1, tc[4]
            timestamp_init = tc[5]
        else:
            if tc[4] == 0 or (tc[4] - metabolic_rate_previous < 0):
                metabolic_rate_counter, metabolic_rate_previous = 0, tc[4]
                timestamp_init = tc[5]
            else:
                metabolic_rate_counter += (tc[4] - metabolic_rate_previous)
                timestamp_end = tc[5]
                metabolic_rate_previous = tc[4]

    timestamp_diff = timestamp_end - timestamp_init

    met = (metabolic_rate_counter * 1000) / (25 * timestamp_diff)

    return met

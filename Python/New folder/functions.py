def megasoft(worked_hours, rate_per_hour):
    if worked_hours>40:
        extra_hours=worked_hours-40
        extra_rate=rate_per_hour*1.5
        pay=40*rate_per_hour+extra_hours*extra_rate
        return pay
    else:
        pay=worked_hours*rate_per_hour
        return pay

result=megasoft(48,18)
print(result)
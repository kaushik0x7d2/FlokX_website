from .cron import ReminderEmailCronJob

def reminder_email_cron_job():
    ReminderEmailCronJob().do()

# Generated by Django 5.1.1 on 2024-09-15 07:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('crud', '0002_alter_event_event_cnt_alter_event_trans_tms'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='location_cd',
            field=models.CharField(choices=[('DESTINATION', 'Destination'), ('CUSTOMER NUMBER', 'Customer Number'), ('OUTLET ID', 'Outlet ID')], max_length=100),
        ),
    ]

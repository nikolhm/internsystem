# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('intern', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='internrole',
            name='date_access_revoked',
            field=models.DateField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='internrole',
            name='date_removed',
            field=models.DateField(null=True, blank=True),
        ),
    ]

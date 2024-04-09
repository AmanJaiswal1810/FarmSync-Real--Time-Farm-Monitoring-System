# Generated by Django 5.0.3 on 2024-04-09 09:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_post'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactFormSubmission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254)),
                ('subject', models.CharField(max_length=200)),
                ('message', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='iotdata',
            name='location',
            field=models.CharField(default='please enter location', max_length=100000),
        ),
        migrations.AddField(
            model_name='iotdata',
            name='unique_id',
            field=models.IntegerField(default='-1'),
        ),
    ]

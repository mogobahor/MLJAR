# Generated by Django 2.1.3 on 2019-03-12 11:13

import apps.common.fields
from django.conf import settings
import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('projects', '0001_initial'),
        ('accounts', '0001_initial'),
        ('datasources', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='MLBatchPrediction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', apps.common.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                ('updated_at', apps.common.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False)),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('compute_time', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(choices=[('created', 'Created'), ('started', 'Started'), ('progress', 'In progress'), ('done', 'Done'), ('error', 'Error')], default='created', max_length=32)),
                ('errors', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('task_id', models.CharField(max_length=128)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('parent_dataframe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='input_data', to='datasources.DataFrame')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MLColumnsUsage',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', apps.common.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                ('updated_at', apps.common.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False)),
                ('title', models.TextField()),
                ('columns_usage', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('target_details', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('parent_organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.Organization')),
                ('parent_project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.Project')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MLExperiment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', apps.common.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                ('updated_at', apps.common.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False)),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('compute_time', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(choices=[('created', 'Created'), ('started', 'Started'), ('progress', 'In progress'), ('done', 'Done'), ('error', 'Error')], default='created', max_length=32)),
                ('errors', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('task_id', models.CharField(max_length=128)),
                ('title', models.TextField()),
                ('description', models.TextField(blank=True, null=True)),
                ('params', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('parent_columns_usage', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml.MLColumnsUsage')),
                ('parent_organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.Organization')),
                ('parent_project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.Project')),
                ('parent_training_dataframe', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='training', to='datasources.DataFrame')),
                ('parent_validation_dataframe', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='validation', to='datasources.DataFrame')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='MLModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', apps.common.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False)),
                ('updated_at', apps.common.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False)),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('compute_time', models.IntegerField(blank=True, null=True)),
                ('status', models.CharField(choices=[('created', 'Created'), ('started', 'Started'), ('progress', 'In progress'), ('done', 'Done'), ('error', 'Error')], default='created', max_length=32)),
                ('errors', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('task_id', models.CharField(max_length=128)),
                ('model_key', models.TextField(db_index=True)),
                ('model_type', models.CharField(max_length=128)),
                ('params', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('all_params', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('training_details', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('training_time', models.IntegerField(blank=True, null=True)),
                ('metric', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('save_details', django.contrib.postgres.fields.jsonb.JSONField(blank=True, null=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('parent_experiment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml.MLExperiment')),
                ('parent_organization', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.Organization')),
                ('parent_project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.Project')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='mlbatchprediction',
            name='parent_mlmodel',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ml.MLModel'),
        ),
        migrations.AddField(
            model_name='mlbatchprediction',
            name='parent_organization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.Organization'),
        ),
        migrations.AddField(
            model_name='mlbatchprediction',
            name='parent_project',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='projects.Project'),
        ),
        migrations.AddField(
            model_name='mlbatchprediction',
            name='result_dataframe',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='output_data', to='datasources.DataFrame'),
        ),
    ]

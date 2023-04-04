from flask.cli import AppGroup
from .users import seed_users, undo_users
from .resumes import seed_resumes, undo_resumes
from .coverletters import seed_coverletters, undo_coverletters
from .applications import seed_applications, undo_applications
from .correspondences import seed_correspondences, undo_correspondences
from .transactions import seed_transactions, undo_transactions

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_resumes()
        undo_coverletters()
        undo_applications()
        undo_correspondences()
    seed_users()
    seed_resumes()
    seed_coverletters()
    seed_applications()
    seed_correspondences()
    seed_transactions()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_resumes()
    undo_coverletters()
    undo_applications()
    undo_correspondences()
    undo_transactions()

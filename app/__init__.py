import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.resume_routes import resume_routes
from .api.cover_letter_routes import cover_letter_routes
from .api.application_routes import application_routes
from .api.correspondence_routes import correspondence_routes
from .api.payment_routes import payment_routes
from .api.job_routes import job_routes
from .api.search_history_routes import search_history_routes
from .api.prompt_routes import prompt_routes
from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-app/build', static_url_path='/')

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(resume_routes, url_prefix='/api/resumes')
app.register_blueprint(cover_letter_routes, url_prefix='/api/coverletters')
app.register_blueprint(application_routes, url_prefix='/api/applications')
app.register_blueprint(correspondence_routes, url_prefix='/api/correspondences')
app.register_blueprint(payment_routes, url_prefix='/api/payments')
app.register_blueprint(job_routes, url_prefix='/api/jobs')
app.register_blueprint(search_history_routes, url_prefix='/api/searches')
app.register_blueprint(prompt_routes, url_prefix='/api/prompts')
db.init_app(app)
Migrate(app, db)

# # Initialize CSRF protection and exempt webhook route
# csrf = CSRFProtect(app)
# csrf.exempt(payment_routes.view_functions['webhook_received'])


# Application Security
CORS(app)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

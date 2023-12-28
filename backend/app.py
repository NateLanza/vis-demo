import http
from django.http import HttpResponse
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/api')
def index():
    return 'Hello World!'
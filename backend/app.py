import http
from django.http import HttpResponse
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/api')
def index():
    response = dict()
    response['message'] = 'Hello World!'
    return response
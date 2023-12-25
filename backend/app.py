from flask import Flask, render_template

app = Flask(__name__)

@app.route('/api')
def index():
    return render_template('index.html')
from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)

# app.config['SECRET_KEY'] = 'secret_key'
# app.config['CORS_HEADERS'] = 'Content-Type'

# cors = CORS(app, resources={r"/endpoint": {"origins": "http://localhost:3000/"}})

@app.route('/predict', methods=['POST'])
# @cross_origin(origin='localhost', headers=['Content-Type', 'Authorization'])
def predict():
    file = request.files['file']
    return [
		{"Actual":134.40,"Predict":129.61},
		{"Actual":126.59,"Predict":121.55},
		{"Actual":106.86,"Predict":108.37},
		{"Actual":138.95,"Predict":125.43},
		{"Actual":119.49,"Predict":124.50}
	   ]

if __name__ == '__main__':
    app.run(debug=True)
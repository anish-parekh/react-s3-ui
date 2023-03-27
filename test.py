# Import flask and datetime module for showing date and time
from flask import Flask
import datetime
  
x = datetime.datetime.now()
  
# Initializing flask app
app = Flask(__name__)
  
  
# Route for seeing a data
@app.route('/predict')
def predict():
  
    # Returning an api for showing in reactjs
    return [
		{"Actual":134.40,"Predict":129.61},
		{"Actual":126.59,"Predict":121.55},
		{"Actual":106.86,"Predict":108.37},
		{"Actual":138.95,"Predict":125.43},
		{"Actual":119.49,"Predict":124.50}
	   ]
  
      
# Running app
if __name__ == '__main__':
    app.run(debug=True)
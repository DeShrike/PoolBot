from NeuralNetwork import NeuralNetwork
import numpy as np
from flask import Flask
from flask import request
from flask import jsonify
from flask import send_from_directory
import os
import math
import json
import Config
import Utils

jsonfolder = "json"
jsonfile = "brain-g002-0649.json"
brain = None

with open(jsonfolder + "/" + jsonfile) as json_file:
	data = json.load(json_file)
	brain = NeuralNetwork.deserialize(data)

static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), "js")
print(static_file_dir)

app = Flask(__name__)

@app.route("/postjson", methods=["POST"])
def post():
	print(request.is_json)
	content = request.get_json()
	print(content["id"])
	print(content["name"])
	return "JSON posted"

@app.route("/test", methods=["GET"])
def get():
	jso = {"angle": 1.9, "force": 7.9}
	return jsonify(jso)

@app.route("/predict", methods=["POST"])
def predict():
	content = request.get_json()
	print("-------------------")
	print(content)
	print("-------------------")
	wx = content["whiteBall"]["x"] / Config.WIDTH
	wy = content["whiteBall"]["y"] / Config.HEIGHT
	rx = content["redBall"]["x"] / Config.WIDTH
	ry = content["redBall"]["y"] / Config.HEIGHT
	hx = content["hole"]["x"] / Config.WIDTH
	hy = content["hole"]["y"] / Config.HEIGHT

	inputs = np.array([wx, wy, rx, ry, hx, hy])
	print(inputs)
	print("-------------------")
	output = brain.predict(inputs)
	angle = Utils.map(output[0], 0, 1, 0, math.pi, False)
	force = Utils.map(output[1], 0, 1, 0.5, 1, False)

	jso = {"angle": angle, "force": force}
	return jsonify(jso)

@app.route("/", methods=["GET"])
def getIndex():
	print("Root request")
	return send_from_directory(".", "index.html")

@app.route('/js/<path:path>', methods=["GET"])
def serve_file_in_dir(path):
	print("JS request")
	if not os.path.isfile(os.path.join(static_file_dir, path)):
		path = os.path.join(".", "index.html")
	return send_from_directory(static_file_dir, path)

app.run(host = "0.0.0.0", port = 5000)

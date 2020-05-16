from Vector2 import Vector2
from NeuralNetwork import NeuralNetwork
from Ball import Ball
from Hole import Hole
from Table import Table
from Que import Que
from Pool import Pool
import numpy as np
import json
from Utils import *
import Config

done = False
bestbest = 0

def callback(gen, avg_score, best_score, best_json):
	global bestbest
	global done

	line = "Generation\t%d\tAverage Score\t%f\tBest Score\t%f" % (gen, avg_score, best_score)
	write_log(Config.JSON_FOLDER + "/" + "logfile.txt", line)
	filename = "brain-g%03d-%04d.json" % (gen, best_score * 1000)

	if best_score >= bestbest:
		if best_json != None:
			write_file(Config.JSON_FOLDER + "/" + filename, best_json)
		bestbest = best_score

	if gen == Config.GENERATIONS:
		done = True

def write_log(filename, line):
	print(line)
	with open(filename, "a") as outfile:
		outfile.write(line + "\n")


def write_file(filename, data):
	with open(filename, "w") as outfile:
		outfile.write(data + "\n")

pool = Pool(Config.WIDTH, Config.HEIGHT, callback)

while done == False:
	pool.tick()

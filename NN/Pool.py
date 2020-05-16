import numpy as np
from NeuralNetwork import NeuralNetwork
from Vector2 import Vector2
from Ball import Ball
from Que import Que
from Hole import Hole
from State import State
from Table import Table
import os
import json
import time
import Utils
import Config
import math
import random 

class Pool():
	width = 0
	height = 0
	whiteBall = None
	redBall = None
	hole = None
	table = None
	ques = []
	que = None
	bestScore = 0
	generation = 0
	averageScore = 0
	tstart = 0
	tstop = 0
	training_data = None

	def __init__(self, w, h, cb):
		self.width = w
		self.height = h
		self.progress_callback = cb

		self.table = Table(self.width, self.height)
		self.place_items()
		self.new_generation()

	def tick(self):
		# print(self.state)
		if self.state == State.AIMING:
			self.que.move_to(self.whiteBall.pos.x, self.whiteBall.pos.y)
			self.que.think(self.whiteBall, self.redBall, self.hole)
			self.state = State.STRIKING
			# print("  Striking")
		elif self.state == State.STRIKING:
			self.que.force = -0.01
			if self.que.force <= 0:
				self.whiteBall.addForce(self.que.get_force())
				self.que.force = 0
				self.state = State.ROLLING
				# print("    Rolling")
		elif self.state == State.ROLLING:
			if self.whiteBall.isStopped() and self.redBall.isStopped():
				# print("      Balls Stopped")
				self.queDone()
			elif self.hole.score(self.whiteBall):
				self.que.whitePotted = True
				# print("      White Hole")
				self.queDone()
			elif self.hole.score(self.redBall):
				self.que.redPotted = True
				# print("      Red Hole")
				self.queDone()
			elif self.que.ballsHit:
				self.que.update_score(self.hole, self.redBall)

		self.whiteBall.update()
		self.redBall.update()
		self.table.check_collisions(self.whiteBall)
		self.table.check_collisions(self.redBall)

		self.checkBallCollisions()
		return False

	def place_items(self):
		padding = 50;
		y = Utils.myrandom(padding, self.height - 2 * padding)
		self.whiteBall = Ball(100, y, 10, True)
		y = Utils.myrandom(padding, self.height - 2 * padding)
		self.redBall = Ball(self.width / 2, y, 10, False)
		y = Utils.myrandom(padding, self.height - 2 * padding)
		self.hole = Hole(self.width - 100, y, 15)

	def new_generation(self):
		# print("new_generation")
		self.bestBrainJSON = None
		if self.generation == 0:
			self.loadTrainingData()
			self.ques = []
			for i in range(0, Config.GENERATIONSIZE):
				if len(self.training_data) > 0:
					randombrain = random.choice(self.training_data)
					self.que = Que(randombrain)
				else:
					self.que = Que()
				
				self.ques.append(self.que)
		else:
			self.savedQues = []

			for i in range(0, len(self.ques)):
				q = self.ques[i].copy()
				self.savedQues.append(q)

			self.calculate_fitness()
			for i in range(0, Config.GENERATIONSIZE):
				self.ques[i] = self.pickOne()

		self.generation += 1
		self.queIndex = 0
		self.que = self.ques[self.queIndex]
		self.state = State.AIMING

		self.progress_callback(self.generation, self.averageScore, self.bestScore, self.bestBrainJSON)

	def loadTrainingData(self):
		files_path = [Config.TRAINING_FOLDER + "/" + x for x in os.listdir(Config.TRAINING_FOLDER)]
		self.training_data = []
		for filepath in files_path:
			print("Loading: %s" % (filepath))
			with open(filepath) as json_file:
				data = json_file.read()
				brain = NeuralNetwork.deserialize(data)
				self.training_data.append(brain)

	def pickOne(self):
		index = 0
		r = Utils.myrandom(0, 1)
		while r > 0:
			r = r - self.savedQues[index].fitness
			index += 1

		index -= 1
		q = self.savedQues[index]
		child = Que(q.brain)
		child.mutate()
		return child

	def calculate_fitness(self):
		self.bestScore = 0
		sum = 0
		for i in range(0, len(self.savedQues)):
			q = self.savedQues[i]
			sum += q.totalScore / q.gamesPlayed
			if q.totalScore / q.gamesPlayed > self.bestScore:
				self.bestScore = q.totalScore / q.gamesPlayed
				self.bestBrainJSON = q.brain.serialize()

		self.averageScore = sum / len(self.savedQues)

		for i in range(0, len(self.savedQues)):
			q = self.savedQues[i]
			q.fitness = (q.totalScore / q.gamesPlayed) / sum

	def checkBallCollisions(self):
		ball1 = self.whiteBall
		ball2 = self.redBall

		dist = self.whiteBall.pos.dist(self.redBall.pos)
		if dist <= self.whiteBall.radius + self.redBall.radius:

			power = (abs(ball1.vel.x) + abs(ball1.vel.y)) + (abs(ball2.vel.x) + abs(ball2.vel.y))
			power = power * 0.00482

			opposite = ball1.pos.y - ball2.pos.y
			adjacent = ball1.pos.x - ball2.pos.x
			rotation = math.atan2(opposite, adjacent)

			# ball1.moving = True
			# ball2.moving = True

			velocity2 = Vector2(90.0 * math.cos(rotation + math.pi) * power, 90.0 * math.sin(rotation + math.pi) * power, 0.0)
			ball2.addForce(velocity2)
			ball2.acc.mult(0.97, 0.97, 0.97)

			velocity1 = Vector2(90.0 * math.cos(rotation) * power, 90.0 * math.sin(rotation) * power, 0.0)
			ball1.addForce(velocity1)
			ball1.acc.mult(0.97, 0.97, 0.97)

			self.que.ballsHit = True

	def queDone(self):
		self.tstop = time.clock()
		self.lastScore = self.que.apply_score()

		if self.lastScore > self.bestScore:
			self.bestScore = self.lastScore

		if self.que.gamesPlayed >= Config.GAMES:
			self.queIndex += 1

			if self.queIndex >= Config.GENERATIONSIZE:
				self.queIndex = 0
				self.new_generation()

		self.place_items()

		timetaken = int((self.tstop - self.tstart) * 1000)

		self.que = self.ques[self.queIndex]
		self.state = State.AIMING
		# print("Aiming - Gen %d Que %d Game %d - Took %d ms" % (self.generation, self.queIndex, self.que.gamesPlayed, timetaken))
		self.tstart = time.clock()

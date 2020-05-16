import numpy as np
from Vector2 import Vector2
from NeuralNetwork import NeuralNetwork
from Table import Ball, Hole
import Utils
import Config
import math

class Que():

	def __init__(self, brain = None):
		self.angle = 0
		self.force = 0
		self.initialForce = 0

		self.x = 0
		self.y = 0

		self.ballsHit = False
		self.redPotted = False
		self.whitePotted = False
		self.totalScore = 0
		self.closestDistance = Config.WIDTH
		self.gamesPlayed = 0

		if brain != None:
			self.brain = brain.copy()
		else: 
			self.brain = NeuralNetwork(6, Config.HIDDEN_LAYERS, Config.HIDDEN_NODES, 2)
			# self.brain = NeuralNetwork(3, Config.HIDDEN_LAYERS, Config.HIDDEN_NODES, 2)

	@staticmethod
	def breed(brain1, brain2): 
		newbrain1, newbrain2 = NeuralNetwork.crossover(brain1, brain2)
		return Que(newbrain1), Que(newbrain2)

	def copy(self):
		c = Que(self.brain)
		c.ballsHit = self.ballsHit
		c.redPotted = self.redPotted
		c.whitePotted = self.whitePotted
		c.totalScore = self.totalScore
		c.gamesPlayed = self.gamesPlayed
		c.closestDistance = self.closestDistance
		return c

	def think(self, whiteBall, redBall, hole):
		wx = whiteBall.pos.x / Config.WIDTH
		wy = whiteBall.pos.y / Config.HEIGHT
		rx = redBall.pos.x / Config.WIDTH
		ry = redBall.pos.y / Config.HEIGHT
		hx = hole.pos.x / Config.WIDTH
		hy = hole.pos.y / Config.HEIGHT
		inputs = np.array([wx, wy, rx, ry, hx, hy])
		# inputs = np.array([wy, ry, hy])
		# print(inputs)
		output = self.brain.predict(inputs)
		# print(output)
		self.angle = Utils.map(output[0], 0, 1, 0, math.pi, False)
		self.force = Utils.map(output[1], 0, 1, 0.5, 1, False)
		self.initialForce = self.force

	def mutate(self):
		self.brain.mutate(0.1)

	def move_to(self, x, y):
		self.x = x
		self.y = y

	def get_force(self):
		w = Vector2.fromAngle(self.angle - math.pi / 2, 1)
		w.setMag(self.initialForce * 10)
		return w

	def update_score(self, hole, ball):
		dist = ball.pos.dist(hole.pos)
		if dist < self.closestDistance:
			self.closestDistance = dist

	def apply_score(self):
		score = 0
		if self.redPotted:
			score = 1
		elif self.whitePotted:
			score = 0
		elif self.ballsHit == False:
			score = 0
		else:
			score = (1 - (self.closestDistance / Config.WIDTH)) / 2

		self.totalScore += score;
		self.gamesPlayed += 1

		self.redPotted = False
		self.whitePotted = False
		self.ballsHit = False
		self.closestDistance = Config.WIDTH

		return self.totalScore / self.gamesPlayed

	def draw(self, graphics):
		v = Vector2(self.x, self.y, 0)
		w = Vector2.fromAngle(self.angle - math.pi / 2, 1)
		w.setMag(15 + (20 if self.force > 0 else 0))
		p1 = Vector2.subv(v, w)
		w.setMag(100)
		p2 = Vector2.subv(v, w)

		graphics.line(p1.x, p1.y, p2.x, p2.y, 8, (150, 75, 0))

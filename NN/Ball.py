from Vector2 import Vector2
import Config

class Ball:

	pos = None
	vel = None
	acc = None
	mass = 1
	startx = 0
	starty = 0
	radius = 0
	isWhite = False

	def __init__(self, x, y, r, white):
		self.pos = Vector2(x, y, 0)
		self.radius = r
		self.isWhite = white
		self.vel = Vector2(0, 0, 0)
		self.acc = Vector2(0, 0, 0)
		self.friction = 0.007
		self.mass = 1.0
		self.startx = x
		self.starty = y

	def reset(self):
		self.pos.x = self.startx
		self.pos.y = self.starty
		self.vel.mult(0, 0, 0)
		self.acc.mult(0, 0, 0)

	def isStopped(self):
		return self.vel.mag() < 0.1

	def addForce(self, force):
		self.acc = force

	def update(self):
		self.vel.add(self.acc.x, self.acc.y, self.acc.z)
		self.pos.add(self.vel.x, self.vel.y, self.vel.z)
		self.acc.mult(0, 0, 0)
		self.vel.setMag(self.vel.mag() * (1 - self.friction))

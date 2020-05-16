from Vector2 import Vector2
from Ball import Ball

class Hole:

	pos = None
	radius = 0

	def __init__(self, x, y, r):
		self.pos = Vector2(x, y, 0)
		self.radius = r

	def score(self, ball):
		dist = self.pos.dist(ball.pos)
		return dist < self.radius

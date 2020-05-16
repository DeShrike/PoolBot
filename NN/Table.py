from Vector2 import Vector2
from Ball import Ball
import Config

class Table:

	lines = []
	border = 5

	def __init__(self, w, h):
		self.width = w
		self.height = h

		line = Line(self.border, self.border, self.width - self.border, self.border)
		self.lines.append(line)
		line = Line(self.width - self.border, self.height - self.border, self.width - self.border, self.border)
		self.lines.append(line)
		line = Line(self.border, self.height - self.border, self.width - self.border, self.height - self.border)
		self.lines.append(line)
		line = Line(self.border, self.height -  self.border,  self.border, self.border)
		self.lines.append(line)

	def check_collisions(self, ball):
		# horizontal lines
		part = self.lines[0]	# top
		if self.lineCircle(part.x1, part.y1, part.x2, part.y2, ball.pos.x, ball.pos.y, ball.radius):
			ball.vel.y *= -1
			ball.pos.y = part.y1 + ball.radius
			return

		part = self.lines[2]	# bottom
		if self.lineCircle(part.x1, part.y1, part.x2, part.y2, ball.pos.x, ball.pos.y, ball.radius):
			ball.vel.y *= -1
			ball.pos.y = part.y1 - ball.radius
			return

		# vertical borders
		part = self.lines[1]	# right
		if self.lineCircle(part.x1, part.y1, part.x2, part.y2, ball.pos.x, ball.pos.y, ball.radius):
			ball.vel.x *= -1
			ball.pos.x = part.x1 - ball.radius
			return

		part = self.lines[3]	# left
		if self.lineCircle(part.x1, part.y1, part.x2, part.y2, ball.pos.x, ball.pos.y, ball.radius):
			ball.vel.x *= -1
			ball.pos.x = part.x1 + ball.radius
			return

	def lineCircle(self, x1, y1, x2, y2, xc, yc, rc):
		ac = [xc - x1, yc - y1]
		ab = [x2 - x1, y2 - y1]
		ab2 = self.dot(ab, ab)
		acab = self.dot(ac, ab)
		t = acab / ab2
		t = 0 if t < 0 else t
		t = 1 if t > 1 else t
		h = [(ab[0] * t + x1) - xc, (ab[1] * t + y1) - yc]
		h2 = self.dot(h, h)
		return h2 <= rc * rc

	def dot(self, v1, v2):
		return (v1[0] * v2[0]) + (v1[1] * v2[1])

class Line:
	x1 = 0
	y1 = 0
	x2 = 0
	y2 = 0
	
	def __init__(self, x1, y1, x2, y2):
		self.x1 = x1
		self.y1 = y1
		self.x2 = x2
		self.y2 = y2


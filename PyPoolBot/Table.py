from Vector2 import Vector2
from Graphics import Graphics
import Config


class Ball:

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

	def draw(self, graphics):
		graphics.circle(self.pos.x, self.pos.y, self.radius, Config.WHITE if self.isWhite else Config.RED, 0)


class Hole:

	def __init__(self, x, y, r):
		self.pos = Vector2(x, y, 0)
		self.radius = r

	def score(self, ball):
		dist = self.pos.dist(ball.pos)
		return dist < self.radius

	def draw(self, graphics):
		graphics.circle(self.pos.x, self.pos.y, self.radius, Config.BLACK, 0)
		graphics.circle(self.pos.x, self.pos.y, self.radius, Config.WHITE, 1)
		pass


class Table:

	border = 5

	def __init__(self, w, h):
		self.width = w
		self.height = h
		self.lines = []

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

	def draw(self, graphics):
		for line in self.lines:
			graphics.line(line.x1, line.y1, line.x2, line.y2, 3, Config.GREEN2)


class Line:
	
	def __init__(self, x1, y1, x2, y2):
		self.x1 = x1
		self.y1 = y1
		self.x2 = x2
		self.y2 = y2

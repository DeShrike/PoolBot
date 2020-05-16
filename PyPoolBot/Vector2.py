import math

class Vector2:

	def __init__(self, xx, yy, zz):
		self.x = xx
		self.y = yy
		self.z = zz

	def mag(self):
		return math.sqrt(self.magSq())

	def copy(self):
		return Vector2(self.x, self.y, self.z)

	def dist(self, v):
		return v.copy().sub(self.x, self.y, self.z).mag()

	def magSq(self):
		return self.x * self.x + self.y * self.y + self.z * self.z

	def normalize(self):
		l = self.mag();
		if l != 0:
			self.mult(1.0 / l, 1.0 / l, 1.0 / l)

		return self

	def add(self, x, y, z):
		self.x += x
		self.y += y
		self.z += z
		return self

	def sub(self, x, y, z):
		self.x -= x
		self.y -= y
		self.z -= z
		return self

	def mult(self, x, y, z):
		self.x *= x
		self.y *= y
		self.z *= z
		return self

	def div(self, x, y, z):
		self.x /= x
		self.y /= y
		self.z /= z
		return self

	def setMag(self, n):
		return self.normalize().mult(n, n, n)

	@staticmethod
	def fromAngle(angle, length):
		return Vector2(length * math.cos(angle), length * math.sin(angle), 0)

	@staticmethod
	def addv(v1, v2):
		target = Vector2(v1.x, v1.y, v1.z)
		target.add(v2);
		return target;

	@staticmethod
	def subv(v1, v2):
		target = Vector2(v1.x, v1.y, v1.z)
		target.sub(v2.x, v2.y, v2. z);
		return target;

	@staticmethod
	def multv(v1, v2):
		target = Vector2(v1.x, v1.y, v1.z)
		target.mult(v2);
		return target;

	@staticmethod
	def divv(v1, v2):
		target = Vector2(v1.x, v1.y, v1.z)
		target.div(v2);
		return target;

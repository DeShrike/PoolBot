import sys
sys.path.append('../')
from NeuralNetwork import NeuralNetwork
import Utils
import numpy as np
import math
import random

net = NeuralNetwork(6, 2, 6, 2)

input = np.array([1, 1, 1, 1, 1, 1])

output = net.predict(input)

print(output)

input = np.array([-1, 2, 4, -7, 1, 10])

def f(x):
	if x < 0:
		return x / 2
	return x * 2

print(input)

vv = np.vectorize(f)
input2 = input
input = vv(input)

print(input)
print(input2)

input = np.array([-1, 2, 4, -7, 1, 10])
input2 = input.copy()
input[0] = 100
print(input)
print(input2)

print(math.pi)
print(math.sqrt(4))


ac = [1, 2]
print(ac)
print(ac[0])
print(ac[1])


class Test:
	x = 0
	def __init__(self, x):
		self.x = x

	def show(self):
		print("X: %d" % self.x)

	@staticmethod
	def stat(y = None):
		if y == None:
			print("No Y")
		else:
			print("Y: %d" % y)

t = Test(5)
t.show()
t.stat(10)
t.stat()
Test.stat(11)


print(math.cos(0))
print(math.sin(0))

print("test lambda")
input = np.array([-1, 2, 4, -7, 1, 10], dtype=np.float16)
someval = 0.1
vv = np.vectorize(lambda x : ( x if x < 0 else x * someval))
output = vv(input)
print(input)
print(output)

print("test random")
r = np.random.random()
print(r)
print(type(r))

rate = 0.1
mutate = np.vectorize(lambda x : ( x + np.random.random() / 10.0 if np.random.random() < rate else x))
input = np.array([-1, 2, 4, -7, 1, 10], dtype=np.float16)
output = mutate(input)
print(input)
print(output)


gen = 25
best_score = 0.31415
filename = "brain-g%03d-%04d" % (gen, best_score * 1000)
print(filename)

print("----------")
for i in range(0,10):
	# print(Utils.myrandom(0, 1))
	# print(Utils.randomGaussian(0, 0.1))
	print(random.random())

print("----------")
for i in range(0,10):
	# print(Utils.myrandom(0, 1))
	# print(Utils.randomGaussian(0, 0.1))
	print(np.random.random())


print("###################################################")

ff = np.vectorize(lambda x : ( x + Utils.randomGaussian(0, 0.1) if np.random.random() < rate else x))
input = np.array([-1, 2, 4, -7, 1, 10], dtype=np.float16)
print(input)
input = ff(input)
print(input)

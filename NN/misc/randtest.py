import sys
sys.path.append('../')
import Utils
import numpy as np
import math
import random

testcount = 100000
vakjes = 100
vakstep = 1.0 / float(vakjes)

baserandom = [0] * vakjes
nprandom = [0] * vakjes
gaussianrandom = [0] * vakjes
npnormal = [0] * vakjes

for i in range(0, vakjes):
	baserandom[i] = 0
	nprandom[i] = 0
	gaussianrandom[i] = 0
	npnormal[i] = 0
	
for i in range(0,testcount):
	r1 = random.random()
	r2 = np.random.random()
	r3 = Utils.randomGaussian(0, 0.1) + 0.5
	r4 = np.random.normal(0, 0.1) + 0.5

	vak = 0
	lim = 0.0
	while True:
		if r1 > lim:
			lim += vakstep
			vak += 1
		else:
			baserandom[vak - 1] += 1
			break

	vak = 0
	lim = 0.0
	while True:
		if r2 > lim:
			lim += vakstep
			vak += 1
		else:
			nprandom[vak - 1] += 1
			break

	vak = 0
	lim = 0.0
	while True:
		if r3 > lim:
			lim += vakstep
			vak += 1
		else:
			gaussianrandom[vak - 1] += 1
			break

	vak = 0
	lim = 0.0
	while True:
		if r4 > lim:
			lim += vakstep
			vak += 1
		else:
			npnormal[vak - 1] += 1
			break

print("Base Random")
for i in range(0, len(baserandom)):
	print(i, baserandom[i])

print("Numpy Random")
for i in range(0, len(nprandom)):
	print(i, nprandom[i])

print("Gaussian Random")
for i in range(0, len(gaussianrandom)):
	print(i, gaussianrandom[i])

print("Numpy Normal")
for i in range(0, len(nprandom)):
	print(i, npnormal[i])

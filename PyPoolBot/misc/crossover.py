import numpy as np

# 6 -> 6
# 6 -> 6
# 6 -> 6
# 6 -> 6
# 6 -> 2

def make_weights(n):
	# step = 0.1
	# van = step
	# tot = n[0] * n[1] * step
	# t = np.arange(van, tot + step / 10, step)
	# t = t.reshape(n)
	# return np.ones(n)
	# return t
	
	# return np.random.randn(n[0], n[1]) * 0.1
	return np.random.random((n[0], n[1]))

arr1 = make_weights((6, 2))
arr2 = make_weights((6, 2))

print("Array 1")
print(arr1)
print("Array 2")
print(arr2)

def crossover(a1, a2):
	s = a1.shape
	print(s)
	for x in range(s[1]):
		for y in range(s[0] // 2):
			a1[y][x], a2[y][x] = a2[y][x], a1[y][x]

	pass

print("Crossover")
crossover(arr1, arr2)

print("Array 1")
print(arr1)
print("Array 2")
print(arr2)


import json
import io
import sys
sys.path.append('../')
from NeuralNetwork import NeuralNetwork
import numpy as np

net = NeuralNetwork(2, 1, 20, 1)

input = np.array([1, 1])
target = np.array([1, 1])

# output = net.predict(input)

# net.learn(input, target)


# Define dataset
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

print("Training....")

# Train the neural network
errors = net.train(X, y, 0.3, 10000)
# print('Accuracy: %.2f%%' % (net.accuracy(net.predict(X), y.flatten()) * 100))
print("Predicting....")
for i in X:
	output = net.predict(i)
	print(output)

for i in range(0, 30):
	print("")

print("Saving....")

jsondata = net.serialize()

with open("brain.json", 'w') as outfile:
	json.dump(jsondata, outfile, indent = 4)

print( jsondata)

print("Reading....")

newnet = None

with open("brain.json") as json_file:
	data = json.load(json_file)
	newnet = NeuralNetwork.deserialize(data)

print("Predicting....")
for i in X:
	output = newnet.predict(i)
	print(output)


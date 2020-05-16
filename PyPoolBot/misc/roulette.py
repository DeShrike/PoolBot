import random

class Chromosome():
    def __init__(self, name, f):
        self.name = name
        self.fitness = f

    def __repr__(self):
        return f"Chromosome('{self.name}', {self.fitness})"

population = [Chromosome(chr(65 + i), i * i) for i in range(26)]
choices = { chromosome: chromosome.fitness for chromosome in population }
random.shuffle(population)

# print(population)
# print(choices)

def myrandom(min = None, max = None):
	rand = random.random()
	if min == None:
		return rand;
	elif max == None:
			return rand * min
	else:
		if min > max:
			tmp = min
			min = max
			max = tmp
		return rand * (max - min) + min

def weighted_random_choice(schoices):
    maximum = sum(choices.values())
    pick = random.uniform(0, maximum)
    current = 0
    for key, value in choices.items():
        current += value
        if current > pick:
            return key

def pickOne2():
    q = weighted_random_choice(choices)
    return q

def pickOne():
    index = 0
    r = myrandom(0, 1)
    while r > 0:
        r = r - population[index].fitness
        index += 1

    index -= 1
    q = population[index]
    return q

TESTSIZE = 500000
results = {}

def DoTest1():
    results.clear()
    for _ in range(TESTSIZE):
        c = pickOne()
        if c in results:
            results[c] += 1
        else:
            results[c] = 1

    PrintResults("Test 1")

def DoTest2():
    results.clear()
    for _ in range(TESTSIZE):
        c = pickOne2()
        if c in results:
            results[c] += 1
        else:
            results[c] = 1

    PrintResults("Test 2")

def PrintResults(title):
    print(title)
    print("-------")
    print("Name\tFitness\tCount\tPercentage")
    som = sum(results.values())
    for r in results:
        print(f"{r.name}\t{r.fitness}\t{results[r]}\t{results[r] / som * 100}")

if __name__ == "__main__":
    DoTest1()
    DoTest2()
    pass
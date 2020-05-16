import itertools

def prime_factors(n):
    for i in itertools.chain([2], itertools.count(3, 2)):
        if n <= 1:
            break
        while n % i == 0:
            n //= i
            yield i


nummer = 1234577 * 1516639 * 3291437 * 8529559 * 1111189
nummer *= 1234577 * 1516639 * 3291437 * 8529559 * 1111189

print(nummer)
print("Factors:")

for i in prime_factors(nummer):
	print(i)


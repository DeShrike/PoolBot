import timeit

def reverse(s): 
    if len(s) == 0: 
        return s 
    else: 
        return reverse(s[1:]) + s[0] 

def is_prime(number):
    """Checks if a number is prime or not"""
    # number must be integer
    if type(number) != int:
        raise TypeError("Non-integers cannot be tested for primality.")
    # negatives aren't prime
    if number <= 1:
        return False
    # 2 and 3 are prime
    elif number <= 3:
        return True
    # multiples of 2 and 3 aren't prime
    elif number % 2 == 0 or number % 3 == 0:
        return False
    # only need to check if divisible by potential prime numbers
    # all prime numbers are of form 6k +/- 1
    # only need to check up to square root of number
    for i in range(5, int(number**0.5) + 1, 6):
        if number % i == 0 or number % (i + 2) == 0:
            return False

    return True

tries = [1, 3, 7, 9]


def check(n):
	for i in tries:
		newvalue = int(str(i) + str(n) + str(i))
	
		start_time = timeit.default_timer()
		ip = is_prime(newvalue)
		elapsed = timeit.default_timer() - start_time    

		if ip:
			print("Number: " + str(newvalue) + " " + str(ip))

		if newvalue < 9999999999999:
			check(newvalue)

# check(1)




start = 9999999
stop = 99999999
current = start
while True:
	p1 = is_prime(current)
	if p1:		
		rev = int(reverse(str(current)))
		p2 = is_prime(rev)
		if p2:
			samen = int(str(current) + str(rev))
			# print(samen)
			p3 = is_prime(samen)
			if p3:
				print("%d and %d are Prime, and so is %d" % (current, rev, samen))

	current += 2
	if current > stop:
		break;

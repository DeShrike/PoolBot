def recur_fibonacci(n):
   if n <= 1:
       return n
   return(recur_fibonacci(n-1) + recur_fibonacci(n-2))

def main():
    while True:
        nterms = int(input("How many terms? "))

        if nterms <= 0:
            print("Please enter a positive integer!")
        else:
            print("Fibonacci sequence:")
            for i in range(nterms):
                print(recur_fibonacci(i))
            break

if __name__ == '__main__':
    main()

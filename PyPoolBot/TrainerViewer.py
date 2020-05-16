# http://programarcadegames.com/index.php?lang=nl&chapter=introduction_to_animation
# http://programarcadegames.com/index.php?lang=nl&chapter=controllers_and_graphics
from Pool import Pool
from Utils import *
import Config
from Graphics import Graphics
import json

class Trainer():

	def __init__(self, withGrapics = True):
		self.bestbest = 0
		self.done = False
		self.pool = Pool(Config.WIDTH, Config.HEIGHT, self.callback)
		self.graphics = Graphics()
		if withGrapics:
			self.graphics.init("PoolGame", Config.SIZE)

	def callback(self, gen, avg_score, best_score, best_json):
		line = "Generation\t%d\tAverage Score\t%f\tBest Score\t%f" % (gen, avg_score, best_score)
		self.write_log(Config.JSON_FOLDER + "/" + "logfile.txt", line)
		filename = "brain-g%03d-%04d.json" % (gen, best_score * 1000)

		if best_score >= self.bestbest:
			if best_json != None:
				self.write_file(Config.JSON_FOLDER + "/" + filename, best_json)
			self.bestbest = best_score

		if gen == Config.GENERATIONS:
			self.done = True

	def write_log(self, filename, line):
		print(line)
		with open(filename, "a") as outfile:
			outfile.write(line + "\n")

	def write_file(self, filename, data):
		with open(filename, "w") as outfile:
			outfile.write(data + "\n")

	def run(self):
		# Loop until the user clicks the close button.
		while not self.done:

			self.done = self.graphics.queryQuit()

			# Set the screen background
			self.graphics.fill(Config.GREEN)
			self.graphics.print("Clock: {}".format(self.graphics.fps()))
	
			# Do physics
			self.pool.tick()

			# Draw everything 
			self.pool.draw(self.graphics)

			# Update screen
			self.graphics.flip()

		# Exit
		self.graphics.quit()


if __name__ == "__main__":
	app = Trainer(False)
	app.run()

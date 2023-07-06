import result

class Shoot:
	def __init__(self):
		self.row = 0
		self.col = 0
		self.res = result.INITIALIZED

	def __eq__(self, other):
		return self.row == other.row and self.col == other.col

	def is_missed(self):
		return self.res == result.MISSED

	def is_wounded(self):
		return self.res == result.WOUNDED

	def is_dead(self):
		return self.res == result.DEAD

	def is_end_game(self):
		return self.res == result.END_GAME

	def is_invalid(self):
		return self.res == result.INVALID

	def make_invalid(self):
		self.res = result.INVALID

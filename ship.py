import random

MAP_SIZE = 10


class Ship:
    def __init__(self, length):
        self.length = length
        self.direction = random.randint(0, 1)
        self.rowCol = []
        self.numOfHits = 0
        self.isOnMap = False
        self.coords = []
        self.nearCellsCoords = []
        self.possiblePositions = []

    def __eq__(self, other):
        return self.length == other.length and \
               self.rowCol == other.rowCol and \
               self.isOnMap == other.isOnMap and \
               self.direction == other.direction and \
               self.numOfHits == other.numOfHits

    @property
    def nearCellsCoords(self):
        return self._nearCellsCoords

    @nearCellsCoords.setter
    def nearCellsCoords(self, value):
        value = [i for i in value if 0 <= i[0] < MAP_SIZE and 0 <= i[1] < MAP_SIZE]
        self._nearCellsCoords = value

    def was_shoot(self, sht):
        for i in self.coords:
            if sht.row == i[0] and sht.col == i[1]:
                return True
        return False

    def is_dead(self):
        return self.length == self.numOfHits

    def set_possible_positions(self):
        all_cells = [[i, j] for j in range(MAP_SIZE) for i in range(MAP_SIZE)]

        if self.direction == 0:
            freeCells = [i for i in all_cells if i[0] >= self.length - 1]
        else:
            freeCells = [i for i in all_cells if MAP_SIZE - i[1] >= self.length]

        self.possiblePositions = freeCells

    def regenerate_rowCol(self):
        self.rowCol = self.possiblePositions[random.randint(0, len(self.possiblePositions) - 1)]

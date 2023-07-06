import player
import shoot


class Game:
    def __init__(self):
        self.player1 = player.Player(0)
        self.player2 = player.Player(1)
        self.active_player = 0
        self.message = {}

    def get_board1(self):
        return self.player2.enemyMap.mtrx.tolist()

    def get_board2(self):
        return self.player1.enemyMap.mtrx.tolist()

    def get_opened_board1(self):
        return self.player2.myMap.mtrx.tolist()

    def get_opened_board2(self):
        return self.player1.myMap.mtrx.tolist()

    def get_message(self):
        return self.message

    def get_active_player(self):
        return self.active_player

    def regenerate_board1(self):
        self.player2.generate_layout()

    def regenerate_board2(self):
        self.player1.generate_layout()

    def handle_shoot(self, row, column, active_player):
        new_shoot = shoot.Shoot()
        new_shoot.row, new_shoot.col = row, column

        if active_player == 0:
            new_shoot, self.message = self.player1.handle_shoot(new_shoot, self.player1)
        elif active_player == 1:
            new_shoot, self.message = self.player2.handle_shoot(new_shoot, self.player2)

        if new_shoot.res == 0:
            self.active_player += 1
            self.active_player %= 2

        return new_shoot

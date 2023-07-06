import map


class Player:
    def __init__(self, playerNumber):
        self.playerNumber = playerNumber
        self.myMap = map.Map()
        self.myMap.regenerate_ships()
        self.enemyMap = map.Map()
        self.myShoots = []

    def generate_layout(self):
        self.myMap.regenerate_ships()

    def handle_shoot(self, sht, other):
        if sht not in self.myShoots and not self.enemyMap.is_shot_into_used_cell(sht):
            self.myShoots.append(sht)
            sht = self.myMap.handle_shoot(sht)
        else:
            sht.make_invalid()

        dictionary = self.update_enemy_map(sht, other)

        return sht, dictionary

    def update_enemy_map(self, sht, other_player):
        to_return = {'message': ''}

        if sht.is_invalid():
            to_return['message'] = "You've already shot into that cell!"
            return to_return

        if sht.is_missed():
            self.enemyMap.mark_as_missed(sht)
            to_add = other_player.playerNumber
            if other_player.playerNumber == 0:
                to_add += 2
            to_return['message'] = "Missed! Player " + str(to_add) + ", please shoot!"
            return to_return

        if sht.is_wounded():
            self.enemyMap.mark_as_wounded(sht)
            to_return['message'] = "You hit a ship! Player " + str(self.playerNumber + 1) + " continue!"

        if sht.is_dead() or sht.is_end_game():
            self.enemyMap.mark_as_wounded(sht)
            self.enemyMap.increment_dead_ships_count()

            found_ship = self.enemyMap.find_ship(sht, other_player.myMap.ships)
            self.enemyMap.mark_cells(found_ship)
            to_return['message'] = "The ship is sank! Player " + str(self.playerNumber + 1) + " continue!"

        if sht.is_end_game():
            to_return['message'] = "The game is ended! Player " + str(self.playerNumber + 1) + " won the game!"

        return to_return

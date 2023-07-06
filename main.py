from flask import Flask, render_template, request, jsonify
import game

app = Flask(__name__)

g_new = game.Game()



@app.route('/')
@app.route('/home')
def home():
    return render_template('index.html')


@app.route('/new_game', methods=['GET'])
def new_game():
    global g_new
    g_new = game.Game()
    game_state = {'board1': g_new.get_board1(),
                  'board2': g_new.get_board2(),
                  'openedBoard1': g_new.get_opened_board1(),
                  'openedBoard2': g_new.get_opened_board2(),
                  'activePlayer': g_new.active_player,
                  'message': 'New Game Started!'}
    return jsonify(game_state)

@app.route('/regenerateBoard1', methods=['GET'])
def regenerate_board1():
    g_new.regenerate_board1()
    to_return = {'board1': g_new.get_board1(),
                 'openedBoard1': g_new.get_opened_board1(),
                 'openedBoard2': g_new.get_opened_board2()}
    return jsonify(to_return)


@app.route('/regenerateBoard2', methods=['GET'])
def regenerate_board2():
    g_new.regenerate_board2()
    to_return = {'board2': g_new.get_board2(),
                 'openedBoard1': g_new.get_opened_board1(),
                 'openedBoard2': g_new.get_opened_board2()}
    return jsonify(to_return)


@app.route('/handleShoot')
def handle_shoot():
    row, column = int(request.args.get('row')), int(request.args.get('column'))
    new_shoot = g_new.handle_shoot(row, column, g_new.active_player)

    result = {'row': new_shoot.row,
              'col': new_shoot.col,
              'res': new_shoot.res,
              'message': g_new.get_message()}

    return jsonify(result)



@app.route('/process', methods=['GET'])
def process_data():
    game_state = {'board1': g_new.get_board1(),
                  'board2': g_new.get_board2(),
                  'openedBoard1': g_new.get_opened_board1(),
                  'openedBoard2': g_new.get_opened_board2(),
                  'message': g_new.get_message(),
                  'activePlayer': g_new.active_player}
    return jsonify(game_state)



if __name__ == '__main__':
    app.run(debug=True, port=5000)




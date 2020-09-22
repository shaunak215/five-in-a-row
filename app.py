from flask import Flask, render_template
from flask_socketio import SocketIO, send, emit, ConnectionRefusedError
from flask import request, jsonify, Response
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'secret!'
app.debug = True
socketio = SocketIO(app, cors_allowed_origins="*")

users = 0
accepted_users = ['one', 'two', 'three']
secret_key = 1234567890
winner = False
player = 'White'

@app.route('/auth', methods = ['POST'])
def new_user():
    global accepted_users
    global secret_key
    global player
    new_str = request.data.decode('utf-8')
    str_json = json.loads(new_str)
    username = str_json['username']
    if username not in accepted_users or player == 'Full':
        return {'Key': 0, 'Player' : player}, 401
    play = player
    if (play == 'White') :
        player = 'Black'
    else :
        player = 'Full'
    return {'Key': secret_key, 'Player': play}, 201

@socketio.on('message')
def handle_message(message):
    global secret_key
    global winner
    if (message['secret'] != secret_key):
        return False
    valid = valid_move(message['iPos'], message['jPos'], message['boardState'])
    if not valid:
        return False
    player = message['currPlayer']
    if (player == 'W') :
        retPlayer = 'B'
    else :
        retPlayer = 'W'
    send((message['iPos'], message['jPos'], retPlayer), broadcast=True)
    return None

def valid_move(iPos, jPos, squares):
    if (iPos < 0 or iPos >= 19 or jPos < 0 or jPos >= 19):
        return False
    if (squares[iPos][jPos] is 'W' or squares[iPos][jPos] is 'B'):
        return False
    else:
        return True

# def calculate_winner(i, j, squares):
#     iReset = i
#     jReset = j
#     #left & right
#     count = 0
#     curr = squares[i][j]
#     #left
#     while (j >= 0) :
#         if (squares[i][j] == curr) :
#             count = count + 1
#             if (count == 5) :
#                 return True
#             j = j - 1
#         else :
#             #no more going left
#             break
#
#     #right
#     j = jReset + 1
#     while (j < len(squares)) :
#         if (squares[i][j] == curr) :
#             count = count + 1
#             if (count == 5) :
#                 return True
#             j = j + 1
#         else :
#             break
#
#     #up & down
#     j = jReset
#     count = 0
#     #up
#     while (i >= 0) :
#         if (squares[i][j] == curr) :
#             count = count + 1
#             if (count == 5):
#                 return True
#             i = i - 1
#         else :
#             #no more going up
#             break
#     #down
#     i = iReset + 1
#     while (i < len(squares)) :
#         if (squares[i][j] == curr) :
#             count = count + 1
#             if (count == 5) :
#                 return True
#             i = i + 1
#         else :
#             break
#
#     #diagonal1
#     j = jReset
#     i = iReset
#     count = 0
#     #up left
#     while (i >= 0 and j >= 0) :
#         if (squares[i][j] == curr) :
#             count = count + 1
#             if (count == 5) :
#                 return True
#             i = i - 1
#             j = j - 1
#         else :
#             #no more going left & up
#             break
#     #down right
#     i = iReset + 1
#     j = jReset + 1
#     while (i < len(squares) and j < len(squares)) :
#         if (squares[i][j] == curr) :
#             count = count + 1
#             if (count == 5) :
#                 return True
#             i = i + 1
#             j = j + 1
#         else :
#             break
#
#     #diagonal2
#     j = jReset
#     i = iReset
#     count = 0
#     #up right
#     while (i >= 0 and j < len(squares)) :
#         if (squares[i][j] == curr) :
#             count = count + 1
#             if (count == 5) :
#                 return True
#             i = i - 1
#             j = j - 1
#         else :
#             #no more going up & right
#             break
#     #down left
#     i = iReset + 1
#     j = jReset - 1
#     while (i < len(squares) and j >= 0) :
#         if (squares[i][j] == curr) :
#             count = count + 1
#             if (count == 5) :
#                 return True
#             i = i + 1
#             j = j + 1
#         else :
#             break
#     return False
#

if __name__ == '__main__':
    socketio.run(app)

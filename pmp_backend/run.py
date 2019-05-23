# Run the server.
from app import socketio, app


if __name__ == '__main__':
    socketio.run(app, host='127.0.0.1', port=5005, debug=True)
    # app.run(host='0.0.0.0', port=5005, debug=True)

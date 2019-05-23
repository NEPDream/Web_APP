from flask import jsonify
from flask_socketio import emit, join_room, leave_room, rooms

# Import module models (i.e. ChatRoom, Message, Employee)
from app.api_module.models import ChatRoom, Message, Employee

# Import the token_required for auth
from app.api_module.user_controllers import token_required
from app.api_module.helpers import parse_date

from .. import socketio, db
from datetime import datetime


@socketio.on('message', namespace="/api/chat")
def handle_my_custom_event(json):
    print('received my event: ' + str(json))
    emit('message', json, room='test_room')


@socketio.on('connect', namespace="/api/chat")
def test_connect():
    print("client connected:", rooms()[0])


@socketio.on('joined', namespace='/api/chat')
def joined(message):
    """Sent by clients when they enter a room.
    A status message is broadcast to all people in the room."""
    room = message.get('room')
    join_room(room)
    emit('status', {'msg': message.get('name') + ' has entered the room: '+room}, room=room)


@socketio.on('text', namespace='/api/chat')
def text(message):
    """Sent by a client when the user entered a new message.
    The message is sent to all people in the room."""
    room_name = message.get('room')
    emp_id = message.get('employee_id')
    room_id = message.get('room_id')
    sending_date = parse_date(message.get('sending_date', ''))
    message = message.get('message')
    room = ChatRoom.query.filter_by(id=room_id).first()
    employee = Employee.query.filter_by(id=emp_id).first()

    if not (employee and room):
        emit('message', 'not employee nor room', room=room)
    json_message = {'message': message, 'sending_date': sending_date, 'employee': employee, 'chatroom': room}
    msg = Message(json_message)
    db.session.add(msg)
    db.session.flush()
    out = {'id': msg.id, 'date': str(msg.sending_date), 'chatroom_id': msg.chatroom_id,
           'value': msg.message, 'employee_id': msg.employee.id,
           'employee_name': msg.employee.user.name}
    db.session.commit()
    emit('message', out, room=room_name)


@socketio.on('left', namespace='/api/chat')
def left(message):
    """Sent by clients when they leave a room.
    A status message is broadcast to all people in the room."""
    room = message.get('room')
    leave_room(room)
    emit('status', {'msg': message.get('name') + ' has left the room '+room+'...'}, room=room)


from datetime import datetime
from flask import Blueprint, jsonify, request

# Import the token_required for auth
from app.api_module.user_controllers import token_required

# Import the database object from the main app module
from app import app, db

# Import module models (i.e. ChatRoom, Message, Employee)
from app.api_module.models import ChatRoom, Message, Employee

# Define the blueprint: 'api', set its url prefix: app.url/${path}
chat_mod = Blueprint('chat', __name__, url_prefix='/api/chat')


@chat_mod.route('/room', methods=['POST'])
@token_required
def create_chat_room(current_user):
    if not current_user:
        return jsonify({'message': 'Cannot perform that function without login first!'}), 401

    data = request.get_json()
    name = data.get('name', 'DM')
    chat_type = data.get('type', 'DM')

    json_chat_room = {'name': name, 'type': chat_type}
    new_chat_room = ChatRoom(json_chat_room=json_chat_room)
    db.session.add(new_chat_room)
    db.session.flush()
    id_ = new_chat_room.id
    db.session.commit()

    return jsonify({'message': 'New chat_room created!', 'id': id_})


@chat_mod.route('/room/<room_id>/', methods=['POST'])
@token_required
def add_employee_to_room(current_user, room_id):
    if not current_user:
        return jsonify({'message': 'Cannot perform that function without login first!'}), 400
    room = ChatRoom.query.filter_by(id=room_id).first()
    # print(room.employees, room.name, room.type)
    data = request.get_json()
    emp_id = data.get('employee_id')
    employee = Employee.query.filter_by(id=emp_id).first()
    if room and employee:
        room.employees = room.employees + [employee]
        db.session.merge(room)
        db.session.commit()
        return jsonify({'message': 'employee added to the room'})


@chat_mod.route('/room/<room_id>/message/', methods=['POST'])
@token_required
def add_message_to_room(current_user, room_id):
    if not current_user:
        return jsonify({'message': 'Cannot perform that function without login first!'}), 400
    room = ChatRoom.query.filter_by(id=room_id).first()
    data = request.get_json()
    emp_id = data.get('employee_id')
    message = data.get('message')
    sending_date = data.get('sending_date', datetime.now())
    employee = Employee.query.filter_by(id=emp_id).first()
    if not (employee and room):
        return jsonify({'message': 'Insufficient informations to create a message'}), 400

    json_message = {'message': message, 'sending_date': sending_date, 'employee': employee, 'chatroom': room}
    new_message = Message(json_message)
    db.session.add(new_message)
    db.session.commit()
    return jsonify({'message': 'new_message added to the room'})


@chat_mod.route('/messages/<emp_id>/', methods=['GET'])
@token_required
def get_employee_messages(current_user, emp_id):
    if not current_user:
        return jsonify({'message': 'Cannot perform that function without login first!'}), 400

    out = []
    rooms = db.session.query(ChatRoom).filter(ChatRoom.employees.any(Employee.id.in_([emp_id]))).all()
    # get messages for each room
    for room in rooms:
        messages = Message.query.filter_by(chatroom=room).all()
        room_data = {'room_type': room.type, 'room_name': room.name, 'room_id': room.id,
                     'room_messages': [{'id': msg.id, 'date': str(msg.sending_date), 'chatroom_id': msg.chatroom_id,
                                        'value': msg.message, 'employee_id': msg.employee.id,
                                        'employee_name': msg.employee.user.name}
                                       for msg in messages],
                     'room_users': [{'employee_id': employee.id, 'employee_name': employee.user.name}
                                    for employee in room.employees]
                     }
        out = out + [room_data]

    return jsonify({'data': out})

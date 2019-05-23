from flask import Blueprint, jsonify

# Import the token_required for auth
from app.api_module.user_controllers import token_required

# Import the database object from the main app module
from app import db

# Import module models (i.e. Role)
from app.api_module.models import Project, Task, Issue, Sprint, Employee

# Define the blueprint: 'api', set its url prefix: app.url/${path}
stats_mod = Blueprint('stats', __name__, url_prefix='/api/stats')


@stats_mod.route('/sprint/<project_id>', methods=['GET'])
@token_required
def get_stats_sprint(current_user, project_id):

    categories = ['Input Queue', 'Requirements Gathering', 'Work In Progress', 'Quality Assurance', 'Done']
    output = []

    if not current_user:
        return jsonify({'message': 'Cannot perform that function!'})

    project = Project.query.filter_by(id=project_id).first()

    if not project:
        return jsonify({'message': 'project not found'}), 404

    sprints_list = project.sprint

    for item in sprints_list:
        name = item.name
        item_data =[]
        for cat in categories:
            count_cat = db.session.query(Task).join(Sprint).filter(Sprint.id == item.id, Task.status == cat).count()
            item_data.append(count_cat)
        output.append({'name': name, 'data': item_data})

    return jsonify({'projects': output})


@stats_mod.route('/issue/<project_id>', methods=['GET'])
@token_required
def get_stats_issue(current_user, project_id):

    categories = ['Input Queue', 'Requirements Gathering', 'Work In Progress', 'Quality Assurance', 'User Acceptance',
                  'Done']
    output = []

    if not current_user:
        return jsonify({'message': 'Cannot perform that function!'})

    project = Project.query.filter_by(id=project_id).first()

    if not project:
        return jsonify({'message': 'project not found'}), 404

    name = project.name
    item_data =[]
    for cat in categories:
        count_cat = db.session.query(Issue).join(Project).filter(Project.id == project_id, Issue.status == cat).count()
        item_data.append(count_cat)
    output.append({'name': name, 'data': item_data})

    return jsonify({'projects': output})


# @stats_mod.route('/users/<project_id>', methods=['GET'])
# @token_required
# def get_stats_user(current_user, project_id):
#     output = []
#
#
#     list_task = db.session.query(Task).filter(Task.sprint.project_id == int(project_id)).all()
#     for item in list_task:
#         print(item.employee.user.name)
#
#     return jsonify({'projects': ''})

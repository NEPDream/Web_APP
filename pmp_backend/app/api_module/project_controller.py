from flask import Blueprint, jsonify, request

# Import the token_required for auth
from app.api_module.user_controllers import token_required

# Import the database object from the main app module
from app import db
from app.api_module.helpers import parse_date

# Import module models (i.e. Role)
from app.api_module.models import Project, Company, Team

# Define the blueprint: 'api', set its url prefix: app.url/${path}
project_mod = Blueprint('project', __name__, url_prefix='/api/project')


@project_mod.route('/', methods=['POST'])
@token_required
def create_project(current_user):
    if not current_user:
        return jsonify({'message': 'Cannot perform that function!'})

    data = request.get_json()
    print(data)
    name = data.get('name')
    start_date = parse_date(data.get('start_date', ''))
    due_date = parse_date(data.get('due_date', ''))
    comment = data.get('comment', None)
    teams = data.get('teams', [])
    company = Company.query.filter_by(id=data.get('company_id')).first()

    json_project = {'name': name, 'start_date': start_date, 'due_date': due_date, 'comment': comment, 'company': company}
    new_project = Project(json_project=json_project)
    for item in teams:
        team = Team.query.filter_by(id=item['id']).first()
        new_project.teams = new_project.teams + [team]
    db.session.add(new_project)
    db.session.commit()

    return jsonify({'message': 'New project created!'})


@project_mod.route('/', methods=['GET'])
@token_required
def get_all_projects(current_user):

    if not current_user:
        return jsonify({'message': 'Cannot perform that function!'})

    projects = Project.query.all()
    output = []

    for project in projects:
        project_data = {}
        project_data['id'] = project.id
        project_data['name'] = project.name
        project_data['comment'] = project.comment
        project_data['start_date'] = str(project.start_date)
        project_data['due_date'] = str(project.due_date)
        project_data['company'] = {'id': project.company.id, 'name': project.company.name}
        project_data['teams'] = [{'id': item.id, 'name': item.name} for item in project.teams]
        output.append(project_data)

    return jsonify({'projects': output})


@project_mod.route('/<project_id>/', methods=['GET'])
@token_required
def get_one_project(current_user, project_id):

    if not current_user:
        return jsonify({'message': 'Cannot perform that function!'})

    project = Project.query.filter_by(id=project_id).first()

    if not project:
        return jsonify({'message': 'No project found!'})

    project_data = {}
    project_data['id'] = project.id
    project_data['name'] = project.name
    project_data['start_date'] = project.start_date
    project_data['due_date'] = project.due_date
    project_data['due_date'] = project.comment
    project_data['company'] = {'id': project.company.id, 'name': project.company.name}

    return jsonify({'project': project_data})


@project_mod.route('/company/<company_id>/', methods=['GET'])
@token_required
def get_all_projects_of_a_company(current_user, company_id):

    if not current_user:
        return jsonify({'message': 'Cannot perform that function!'})

    projects = Project.query.filter_by(company_id=company_id)
    output = []

    for project in projects:
        project_data = {}
        project_data['id'] = project.id
        project_data['name'] = project.name
        project_data['start_date'] = project.start_date
        project_data['due_date'] = project.due_date
        project_data['comment'] = project.comment
        project_data['company'] = {'id': project.company.id, 'name': project.company.name}
        output.append(project_data)

    return jsonify({'projects': output})


@project_mod.route('/<project_id>/', methods=['PUT'])
@token_required
def update_project(current_user, project_id):
    if not current_user:
        return jsonify({'message': 'Cannot perform that function!'}), 401

    project = Project.query.filter_by(id=project_id).first()
    data = request.get_json()
    name = data.get('name')
    start_date = parse_date(data.get('start_date', ''))
    due_date = parse_date(data.get('due_date', ''))
    comment = data.get('comment', None)
    if not project:
        return jsonify({'message': 'Project not found'}), 400
    project.name = name
    project.start_date = start_date
    project.due_date = due_date
    project.comment = comment
    db.session.merge(project)
    db.session.commit()

    return jsonify({'message': 'project updated!'})

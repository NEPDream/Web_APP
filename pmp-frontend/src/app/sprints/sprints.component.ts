import { Component, OnInit, ElementRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IssuetrackerService} from '../services/issuetracker.service';
import {TaskService} from '../services/task.service';
import {AuthService} from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TeamService } from '../services/team.service';

@Component({
  selector: 'app-sprints',
  templateUrl: './sprints.component.html',
  styleUrls: ['./sprints.component.scss']
})
export class SprintsComponent implements OnInit {

  closeResult: string;

  newTaskForm: FormGroup;
  newSprintForm: FormGroup;
  commentForm: FormGroup;
  loading = false;
  submitted = false;
  turn_to_issue = false;
  show_create = true;
  returnUrl: string;
  error = '';
  project_list=[];
  employee_list=[];
  task_list=[];
  task_list_filtered=[];
  sprint_list=[];
  detail_task={};
  task_to_delete={};

  user_filter='';
  project_filter='';
  sprint_filter='';

  // init the list to classify task
  inputqueue = [];
  requirementsgathering = [];
  workinprogress = [];
  qualityassurance = [];
  done =[];
  list_team =[];
  dropdownSettings = {};

  constructor(private _auth:AuthService, private toast: ToastrService, private modalService: NgbModal, 
              private _teamServ: TeamService,private formBuilder: FormBuilder, private eleRef: ElementRef, 
              private issueTracker: IssuetrackerService, private taskService: TaskService) { }

  ngOnInit() {

    this.newTaskForm = this.formBuilder.group({
      name: ['', Validators.required],
      start_date: ['', Validators.required],
      due_date: ['', Validators.required],
      priority: ['', [Validators.required, Validators.minLength(2)]],
      employee_id: ['', [Validators.required, Validators.minLength(5)]],
      sprint_id: ['', [Validators.required, Validators.minLength(5)]],
      task_id: [''],
      turn_issue: [''],
      issue_status: ['']
    });

    this.newSprintForm = this.formBuilder.group({
      name: ['', Validators.required],
      start_date: ['', Validators.required],
      due_date: ['', Validators.required],
      teams: [[], Validators.required],
      project_id: ['', [Validators.required, Validators.minLength(5)]],      
      sprint_id: ['']
    });

    // init the globals arrays of list
    this.issueTracker.listProject().subscribe(data => {
      this.project_list = data['projects']
    });

    this.issueTracker.listEmployee().subscribe(data => {
      this.employee_list = data['employees']
    });

    this.issueTracker.listSprints().subscribe(data => {
      this.sprint_list = data['sprints']
    });

    this.refresh_lists();

    this._teamServ.listTeams().subscribe(
      data => {
        this.list_team = data['teams'];
      },
      error => { console.log('unable to retrieve the list of teams')}
    );

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  refresh_lists(){
    this.taskService.listTask().subscribe(data => {
      this.task_list = data['tasks'];
      this.task_list_filtered = data['tasks'];
  
      //filter for each arrray
      this.inputqueue = this.task_list_filtered.filter(issue => issue['status']=='Input Queue');
      this.requirementsgathering = this.task_list_filtered.filter(issue => issue['status']=='Requirements Gathering');
      this.workinprogress = this.task_list_filtered.filter(issue => issue['status']=='Work In Progress');
      this.qualityassurance = this.task_list_filtered.filter(issue => issue['status']=='Quality Assurance');
      this.done = this.task_list_filtered.filter(issue => issue['status']=='Done');
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    // first check if it was moved within the same list or moved to a different list
    if (event.previousContainer === event.container) {
      // change the items index if it was moved within the same list
      console.log(event.item.element)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {      
      var task_id = event.item.element.nativeElement.id
      var stage_name = event.container.element.nativeElement.id

      // update the stage of the issue
      // call the service to create the issue: 
    this.taskService.changeTaskStage(task_id, stage_name).subscribe(
      data => {
        // remove item from the previous list and add it to the new array
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        console.log('task stage updated');
      },
      error => {
        console.log(error)
    });
    }
  }

  // convenience getter for easy access to form fields
  get i() { return this.newTaskForm.controls; }


  // create/update new task
  onSubmitTask(modal:any) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.newTaskForm.invalid) {
        return;
    }
    //console.log(this.i);
    var task = {id: null, name : this.i.name.value, start_date : this.i.start_date.value['year']+"-"+this.i.start_date.value['month']+"-"+this.i.start_date.value['day']+" 00:00:00",
      due_date : this.i.due_date.value['year']+"-"+this.i.due_date.value['month']+"-"+this.i.due_date.value['day']+" 23:59:59", status : "Input Queue",
      priority : this.i.priority.value, sprint_id : JSON.parse(this.i.sprint_id.value)['id'], employee_id : JSON.parse(this.i.employee_id.value)['id']}
    if(this.i.task_id.value > 0){
      task.id = this.i.task_id.value;
      if (this.i.turn_issue.value != '' && this.i.turn_issue.value == 'true'){
        console.log('turn into issue');
        this.taskService.createIssueFromTask(this.i.task_id.value, task).subscribe(
          data => {
            this.refresh_lists();
            this.normal_ops_ending(modal, 'Task turned in issue');
          },
          error => { this.error_occur(modal, error); }
        );
      }else{
        console.log('update task parameters');
        this.taskService.updateTask(this.i.task_id.value, task).subscribe(
          data => { 
            this.refresh_lists();
            this.normal_ops_ending(modal, 'Task Well updated');
           },
          error => { this.error_occur(modal, error); }
        );  
      }

    }else{ // create new task
      console.log('create new task');
      this.taskService.createTask(task).subscribe(
        data => {
          this.refresh_lists();
          this.normal_ops_ending(modal, 'New Task created');
        },
        error => { this.error_occur(modal, error); }
      );
    }

  }

  // modal for details on task
  openTaskDetails(content:any, task: any) {
    // init the comment form
    var is_id = task.id;
    this.commentForm = this.formBuilder.group({
      comment : ['', [Validators.required, Validators.minLength(5)]],
      task_id : [is_id]
    });
    // retreive the issue details and push it to the detail_issue varialble
    this.taskService.getOnetask(is_id).subscribe(data => {
      this.detail_task = data['task']
    });
    this.modalService.open(content, { size: 'lg' });
  }

  // convenience getter for easy access to form fields
  get c() { return this.commentForm.controls; }

  onSubmitComment(modal:any){
    this.submitted = true;
    // stop here if form is invalid
    if (this.commentForm.invalid) {
        return;
    }
    if (this._auth.getUserEmployeeId != false){
      var comment_obj = {
        comment: this.c.comment.value,
        date: new Date().toString().split('-')[0],
        employee_id: this._auth.getUserEmployeeId,
        employee_name: this._auth.getusername,
        id: null
      }
      this.taskService.addCommentToTask(this.c.task_id.value, comment_obj).subscribe(
        data => {
          this.detail_task['tracking'].push(comment_obj);
          this.commentForm.reset();
          this.submitted = false;
          this.toast.success('Success',  'comment added to the task', {
            closeButton: true
          });
        },
        error =>{
          this.toast.error('Error',  'Fail to add comment on issue'+ error, {
            closeButton: true
          });
          modal.dismiss('Submitting the form');
        }
      );
    }else{
      console.log('Not And Employee, Login as an employee before adding comment on issue');
      
    }
  }

  open(content, id?:any, name?:any) {
    this.show_create = true;
    if (id != null && name !=null){
      this.newTaskForm.controls['sprint_id'].setValue('{ "id": '+id+', "name": "'+name+'" }');
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  open_edit_task(content, task) {
    console.log(task);
    this.show_create = false;
    this.newTaskForm = this.formBuilder.group({
      name: [task.name, [Validators.required, Validators.minLength(2)]],
      start_date: [{year: parseInt(task.start_date.split('-')[0]), month: parseInt(task.start_date.split('-')[1]), day: parseInt(task.start_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
      due_date: [{year: parseInt(task.due_date.split('-')[0]), month: parseInt(task.due_date.split('-')[1]), day: parseInt(task.due_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
      priority: [task.priority, Validators.required],
      sprint_id: ['{ "id": '+task.sprint.id+', "name": "'+task.sprint.name+'" }', Validators.required],
      employee_id: ['{ "id": '+task.employee.id+', "name": "'+task.employee.name+'" }', Validators.required],
      task_id: [task.id],
      task_status : [task.status],
      turn_issue: ['']
    });
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_edit_sprint(content, sprint?:any) {
    if(sprint != null){
      this.show_create = false;
      this.newSprintForm = this.formBuilder.group({
        name: [sprint.name, [Validators.required, Validators.minLength(2)]],
        start_date: [{year: parseInt(sprint.start_date.split('-')[0]), month: parseInt(sprint.start_date.split('-')[1]), day: parseInt(sprint.start_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
        due_date: [{year: parseInt(sprint.due_date.split('-')[0]), month: parseInt(sprint.due_date.split('-')[1]), day: parseInt(sprint.due_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
        project_id: ['{ "id": '+sprint.project.id+', "name": "'+sprint.project.name+'" }', Validators.required],
        teams: [[{id:0, name:"name"}], Validators.required],
        sprint_id: [sprint.id]
      });
    }else{
      this.show_create = true;
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  onSubmitSprint(modal:any){
    this.submitted = true;
    // stop here if form is invalid
    if (this.newSprintForm.invalid) {
        return;
    }
    var sprint = {
      id: this.s.sprint_id.value, name : this.s.name.value, 
      start_date : this.s.start_date.value['year']+"-"+this.s.start_date.value['month']+"-"+this.s.start_date.value['day']+" 00:00:00",
      due_date : this.s.due_date.value['year']+"-"+this.s.due_date.value['month']+"-"+this.s.due_date.value['day']+" 23:59:59",
      project_id : JSON.parse(this.s.project_id.value)['id'], teams : this.s.teams.value}
    if(this.s.sprint_id.value > 0){ // update
      this.taskService.updateSprint(this.s.sprint_id.value, sprint).subscribe(
        data => {
          this.issueTracker.listSprints().subscribe(
            data => {
              this.sprint_list = data['sprints'];
              this.newTaskForm.reset();
              modal.dismiss('Submitting the form');
              this.submitted = false;
              this.toast.success('Success',  'Sprint Data updated', {
                closeButton: true
              });
            },
            error => {
              this.toast.error('Success',  error, {
                closeButton: true
              });
            }
          );
        },
        error => {
          this.toast.error('Success',  error, {
            closeButton: true
          });
        }
      );
    }else{ // create
      this.taskService.createSprint(sprint).subscribe(
        data => {
          this.issueTracker.listSprints().subscribe(
            data => {
              this.sprint_list = data['sprints'];
              this.newTaskForm.reset();
              modal.dismiss('Submitting the form');
              this.submitted = false;
              this.toast.success('Success',  'New Sprint Created', {
                closeButton: true
              });
            },
            error => {
              this.toast.error('Success',  error, {
                closeButton: true
              });
            }
          );
        },
        error => {
          this.toast.error('Success',  error, {
            closeButton: true
          });
        }
      );
    }
  }

  // }

  // convenience getter for easy access to form fields
  get s() { return this.newSprintForm.controls; }

  normal_ops_ending(modal:any, message:any){
    this.newTaskForm.reset();
    modal.dismiss('Submitting the form');
    this.submitted = false;
    this.refresh_lists();
    this.toast.success('Success',  message, {
      closeButton: true
    });
  }
  
  error_occur(modal:any, error:any){
    this.newTaskForm.reset();
    modal.dismiss('Submitting the form');
    this.submitted = false;
    this.toast.error('Error occur', error, {
      closeButton: true
    });
  }

  show_turn_to_issue(){
    this.turn_to_issue = ! this.turn_to_issue;
  }

  // modal to delete issue
  showTaskModalDelete(content:any, issue: any) {
    // init the comment form
    this.task_to_delete = {id : issue.id, name: issue.name}
    this.modalService.open(content);
  }

  deleteTask(modal:any){
    console.log(this.task_to_delete)
    var task_id = this.task_to_delete['id'].toString()
    this.taskService.deleteTask(task_id).subscribe(
      data => {
        this.refresh_lists();
        this.normal_ops_ending(modal, 'Task Deleted')
      },
      error => {
        this.error_occur(modal, error);
      }
    );
  }

  filter_spring(sprint_name?:string){
    console.log(sprint_name);
    if(sprint_name != null){
      this.sprint_filter = sprint_name;
    }else{
      this.sprint_filter = '';
    }
  }

}

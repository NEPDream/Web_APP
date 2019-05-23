import { Component, OnInit, ElementRef } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {Issue} from '../models/issue'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IssuetrackerService} from '../services/issuetracker.service';
import {AuthService} from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-issues',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.scss']
})
export class IssuesComponent implements OnInit {

  closeResult: string;

  newIssueForm: FormGroup;
  commentForm: FormGroup;
  loading = false;
  submitted = false;
  add_to_sprint = false;
  show_create = true;
  returnUrl: string;
  error = '';
  project_list=[];
  employee_list=[];
  issue_list=[];
  sprint_list=[];
  detail_issue={};
  issue_to_delete={};

  user_filter='';
  project_filter='';
  // init the list to classify issues
  done =[]
  inputqueue = [];
  requirementsgathering = [];
  workinprogress = [];
  qualityassurance = [];
  useracceptance = [];


  constructor(private _auth:AuthService, private toast: ToastrService, private modalService: NgbModal, private formBuilder: FormBuilder, private eleRef: ElementRef, private issueTracker: IssuetrackerService) { }
  
  ngOnInit() {
    this.newIssueForm = this.formBuilder.group({
      name: ['', Validators.required],
      start_date: ['', Validators.required],
      due_date: ['', Validators.required],
      priority: ['', [Validators.required, Validators.minLength(2)]],
      project_id: ['', [Validators.required, Validators.minLength(5)]],
      employee_id: ['', [Validators.required, Validators.minLength(5)]],
      sprint_id: [''],
      issue_id:[''],
      issue_status: ['']
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
  
  }

  refresh_lists(){
    this.issueTracker.listIssues().subscribe(data => {
      this.issue_list = data['issues']
  
      //filter for each arrray
      this.inputqueue = this.issue_list.filter(issue => issue['status']=='Input Queue');
      this.requirementsgathering = this.issue_list.filter(issue => issue['status']=='Requirements Gathering');
      this.workinprogress = this.issue_list.filter(issue => issue['status']=='Work In Progress');
      this.qualityassurance = this.issue_list.filter(issue => issue['status']=='Quality Assurance');
      this.useracceptance = this.issue_list.filter(issue => issue['status']=='User Acceptance');
      this.done = this.issue_list.filter(issue => issue['status']=='Done');
    });
  
  }
  // convenience getter for easy access to form fields
  get i() { return this.newIssueForm.controls; }

  // create new issue
  onSubmitIssue(modal) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.newIssueForm.invalid) {
        return;
    }

    // the issue is valid and we can push it to the rest api
    var new_issue:Issue = {id: null, dateAdded: new Date().toString(), 
      name : this.i.name.value, start_date : this.i.start_date.value['year']+"-"+this.i.start_date.value['month']+"-"+this.i.start_date.value['day']+" 00:00:00",
      due_date : this.i.due_date.value['year']+"-"+this.i.due_date.value['month']+"-"+this.i.due_date.value['day']+" 23:59:59", status : "Input Queue",
      priority : this.i.priority.value, project : JSON.parse(this.i.project_id.value), employee : JSON.parse(this.i.employee_id.value), sprint:''}
    console.log(this.i)
    if(this.i.issue_id.value>0){
      var is_id = this.i.issue_id.value.toString()
      new_issue.status = this.i.issue_status.value.toString();
      // call the service to update the issue:
      console.log('update starting')
      if (this.i.sprint_id.value != ''){
        console.log('change to task')
        // create the task first, then delete the issue
        new_issue.sprint = JSON.parse(this.i.sprint_id.value);
        this.issueTracker.createTaskFromIssue(new_issue).subscribe(
          data =>{ 
            this.issueTracker.deleteIssue(is_id).subscribe(
              data => { 
                console.log('from issue to task completed'); 
                this.normal_ops_ending(modal, 'from issue to task completed');
            },
              error => {
                console.log('Problem when deleting the issue'); 
                this.error_occur(modal, 'Problem when deleting the issue'+error);
              }
            );
          },
          error => {
            this.error = error;
            console.log('fail to create issue from task');
            this.error_occur(modal, 'fail to create issue from task'+error);
          }
        );

      }else{ // simple update
        console.log('simple update')
        // put the issue directly
        this.issueTracker.updateIssue(is_id, new_issue).subscribe(
          data => {
            console.log('update issue done');
            this.normal_ops_ending(modal, 'Issue well updated ');            
          },
          error => {
            console.log('fail to update issue');
            this.error_occur(modal, 'fail to update issue'+error);
          }
        );
      }
    }else{
      // call the service to create the issue: 
      this.issueTracker.createIssue(new_issue).subscribe(
        data => {
          this.normal_ops_ending(modal, 'new issue created');
        },
        error => {
          this.error = error;
          console.log('fail to create issue');
          console.log(new_issue);
          this.error_occur(modal, 'fail to create issue'+error);
    });
  }
}

normal_ops_ending(modal:any, message:any){
  this.newIssueForm.reset();
  modal.dismiss('Submitting the form');
  this.submitted = false;
  this.refresh_lists();
  this.toast.success('Success',  message, {
    closeButton: true
  });
}

error_occur(modal:any, error:any){
  this.newIssueForm.reset();
  modal.dismiss('Submitting the form');
  this.submitted = false;
  this.toast.error('Error occur', error, {
    closeButton: true
  });
}

addItem(list: string, todo: Issue) {
  if(todo == null){
    return;
  }
  else{
    var new_issue = todo;
  }
  if (list === 'inputqueue') {
    this.inputqueue.push(new_issue);
  } else {
    this.workinprogress.push(new_issue);
  }
}


  drop(event: CdkDragDrop<Issue[]>) {
    // first check if it was moved within the same list or moved to a different list
    if (event.previousContainer === event.container) {
      // change the items index if it was moved within the same list
      console.log(event.item.element)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {      
      var issue_id = event.item.element.nativeElement.id
      var stage_name = event.container.element.nativeElement.id

      // update the stage of the issue
      // call the service to create the issue: 
    this.issueTracker.changeIssueStage(issue_id, stage_name).subscribe(
      data => {
        // remove item from the previous list and add it to the new array
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        console.log('issue stage updated');
      },
      error => {
        console.log(error)
    });
    }
  }

  open(content) {
    this.show_create = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_edit_issue(content, issue) {
    console.log(issue);
    this.show_create = false;
    this.newIssueForm = this.formBuilder.group({
      name: [issue.name, [Validators.required, Validators.minLength(2)]],
      start_date: [{year: parseInt(issue.start_date.split('-')[0]), month: parseInt(issue.start_date.split('-')[1]), day: parseInt(issue.start_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
      due_date: [{year: parseInt(issue.due_date.split('-')[0]), month: parseInt(issue.due_date.split('-')[1]), day: parseInt(issue.due_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
      priority: [issue.priority, Validators.required],
      project_id: ['{ "id": '+issue.project.id+', "name": "'+issue.project.name+'" }', Validators.required],
      employee_id: ['{ "id": '+issue.employee.id+', "name": "'+issue.employee.name+'" }', Validators.required],
      sprint_id: [''],
      issue_id: [issue.id],
      issue_status : [issue.status]
    });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  show_add_sprint(){
    this.add_to_sprint = ! this.add_to_sprint;
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

  // modal for details on issue
  openIssueDetails(content:any, issue: any) {
    // init the comment form
    var is_id = issue.id;
    this.commentForm = this.formBuilder.group({
      comment : ['', [Validators.required, Validators.minLength(5)]],
      issue_id : [is_id]
    });
    // retreive the issue details and push it to the detail_issue varialble
    this.issueTracker.getOneIssue(is_id).subscribe(data => {
      this.detail_issue = data['issue']
    });
    this.modalService.open(content, { size: 'lg' });
  }

  // modal to delete issue

  showIssueModalDelete(content:any, issue: any) {
    // init the comment form
    this.issue_to_delete = {id : issue.id, name: issue.name}
    this.modalService.open(content);
  }

  deleteIssue(modal:any){
    console.log(this.issue_to_delete)
    var issue_id = this.issue_to_delete['id'].toString()
    this.issueTracker.deleteIssue(issue_id).subscribe(
      data => {
        this.refresh_lists();
        modal.dismiss('Submitting the form');
        this.toast.warning('Success',  'issue deleted', {
          closeButton: true
        });
      },
      error => {
        modal.dismiss('Submitting the form');
        this.toast.error('Error',  'Fail to delete the issue', {
          closeButton: true
        });
      }
    );
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
      this.issueTracker.addCommentToIssue(this.c.issue_id.value, comment_obj).subscribe(
        data => {
          this.detail_issue['tracking'].push(comment_obj);
          this.commentForm.reset();
          this.submitted = false;
          modal.dismiss('Submitting the form');
          this.toast.success('Success',  'comment added to the issue', {
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
      this.toast.warning('warning',  'Login as an employee before adding comment on issue', {
        closeButton: true
      });
    }
    
  }
}

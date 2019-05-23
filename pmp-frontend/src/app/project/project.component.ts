import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../services/project.service';
import { CompanyService } from '../services/company.service';
import { TeamService } from '../services/team.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  list_project = [];
  list_companies =[];
  list_team =[];
  list_team_filter=[];
  filterText='';
  show_create = true;
  newProjectForm: FormGroup;
  closeResult: string;
  submitted = false;
  filterName ='project';
  dropdownSettings = {};

  constructor(private _projServ: ProjectService,
              private _compServ: CompanyService,
              private _teamServ: TeamService,
              private toast: ToastrService,
              private modalService: NgbModal, 
              private formBuilder: FormBuilder
            ) { }

  ngOnInit() {
    //init the form 
    this.newProjectForm = this.formBuilder.group({
        name: ['', Validators.required],
        start_date: ['', Validators.required],
        due_date: ['', Validators.required],
        comment: ['', [Validators.required, Validators.minLength(2)]],
        company: ['', [Validators.required, Validators.minLength(5)]],
        teams: [[], Validators.required],
        id:['']
    });
    
    //init the lists needed
    this._projServ.listProjects().subscribe(
      data => {
        this.list_project = data['projects'];
      },
      error =>{
        console.log('unable to retrieve project list');
      }
    );

    this._compServ.listCompanies().subscribe(
      data => {
        this.list_companies = data['companies'];
      },
      error => {console.log('unable to retrieve companies list')}
    );

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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
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

  // convenience getter for easy access to form fields
  get i() { return this.newProjectForm.controls; }

  onSubmitProject(modal:any){
    this.submitted = true;
    // stop here if form is invalid
    if (this.newProjectForm.invalid) {
      console.log('INVALID : ', this.i);
      return;
    }
    const data = {
      name: this.i.name.value,
      start_date : this.i.start_date.value['year']+"-"+this.i.start_date.value['month']+"-"+this.i.start_date.value['day']+" 00:00:00",
      due_date : this.i.due_date.value['year']+"-"+this.i.due_date.value['month']+"-"+this.i.due_date.value['day']+" 23:59:59",
      comment: this.i.comment.value,
      company_id:JSON.parse(this.i.company.value)['id'],
      teams : this.i.teams.value,
      id : this.i.id.value
    };
    if(this.i.id.value > 0){ // update project
      this._projServ.updateProject(data).subscribe(
        data => {
          // refresh the project list
          this._projServ.listProjects().subscribe(
            data => {
              this.list_project = data['projects'];
              // show toast  notification success
              this.newProjectForm.reset();
              this.submitted = false;
              modal.dismiss('Submitting the form');
              this.toast.success('Success',  'Project well Updated', {
                closeButton: true
              });
            },
            error =>{
              console.log('unable to retrieve project list');
            }
          );
        },
        error => {
          console.log('fail to update project');
        }
      );

    }else{ // create project
      this._projServ.createNewProject(data).subscribe(
        data => {
          // refresh the project list
          this._projServ.listProjects().subscribe(
            data => {
              this.list_project = data['projects'];
              // show toast  notification success
              this.newProjectForm.reset();
              this.submitted = false;
              modal.dismiss('Submitting the form');
              this.toast.success('Success',  'New Project well Created', {
                closeButton: true
              });
            },
            error =>{
              console.log('unable to retrieve project list');
            }
          );
        },
        error =>{
          console.log('fail to create new project');
        }
      );
      }
  }

  open_edit_project(content:any, project:any) {
    this.show_create = false;
    this.newProjectForm = this.formBuilder.group({
      name: [project.name, Validators.required],
      start_date: [{year: parseInt(project.start_date.split('-')[0]), month: parseInt(project.start_date.split('-')[1]), day: parseInt(project.start_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
      due_date: [{year: parseInt(project.due_date.split('-')[0]), month: parseInt(project.due_date.split('-')[1]), day: parseInt(project.due_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
      comment: [project.comment, [Validators.required, Validators.minLength(2)]],
      company: ['{ "name":"nullname", "id":0}', [Validators.required, Validators.minLength(5)]],
      teams: [[{id:0, name:"name"}], Validators.required],
      id:[project.id]
    });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_delete_project(content:any, project:any){
    console.log('project to delete : ', project);
  }

  onCompanyChange(){    
    var comp = this.i.company.value;
    if(comp.length > 0){
      try {
        var id_company = JSON.parse(comp)['id'];
        this.list_team_filter = this.list_team.filter((team) => team.company.id == id_company);
      } catch (error) {
        console.log('something went wrong ',  error);
      }
    }
  }

}

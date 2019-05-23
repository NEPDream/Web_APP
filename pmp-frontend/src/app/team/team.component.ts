import { Component, OnInit } from '@angular/core';
import {TeamService} from '../services/team.service'
import {CompanyService} from '../services/company.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  filterText = '';
  show_create = true;
  newTeamForm: FormGroup;
  closeResult: string;
  submitted = false;
  filterName ='team';
  list_team = [];
  list_companies = [];

  constructor(private _companyServ: CompanyService, private  _teamServ: TeamService, private toast: ToastrService, private modalService: NgbModal, private formBuilder: FormBuilder) {  }

  ngOnInit() {
    this.newTeamForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
      company : ['', [Validators.required, Validators.minLength(2)]],
      id : ['']
    });

    this._companyServ.listCompanies().subscribe(
      data => {
        this.list_companies = data['companies'];
      },
      error => {
        console.log('Something went wrong while retrieving company list');
      }
    ); 
    this._teamServ.listTeams().subscribe(
      data => {
        this.list_team = data['teams'];
      },
      error => {
        console.log('Something went wrong while retrieving team list');
      }
    );

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
  get i() { return this.newTeamForm.controls; }

  onSubmitTeam(modal:any){
    this.submitted = true;
    // stop here if form is invalid
    if (this.newTeamForm.invalid) {
      return;
    }
    if(this.i.id.value>0){ // update team
      this._teamServ.updateTeam(this.i.id.value, this.i.name.value, this.i.comment.value).subscribe(
        data => {
          this._teamServ.listTeams().subscribe(
            data => {
              this.list_team = data['teams'];
              this.toast.success('Success',  'Team data well updated', {
                closeButton: true
              });
            },
            error => {
              console.log('Something went wrong while retrieving team list');
            }
          );
          this.newTeamForm.reset();
          this.submitted = false;
          modal.dismiss('Submitting the form');
        },
        error => {
          this.toast.error('Error',  'Fail to update team '+ error, {
            closeButton: true
          });
          modal.dismiss('Submitting the form');
        }
      );
    
    }else{ // create new team
      var company_id = JSON.parse(this.i.company.value)['id'];
      this._teamServ.createNewTeam(this.i.name.value, this.i.comment.value, company_id).subscribe(
        data => {
          this._teamServ.listTeams().subscribe(
            data => {
              this.list_team = data['teams'];
              this.toast.success('Success',  'Team data well created', {
                closeButton: true
              });
            },
            error => {
              console.log('Something went wrong while retrieving team list');
            }
          );
          this.newTeamForm.reset();
          this.submitted = false;
          modal.dismiss('Submitting the form');
        },
        error  =>{
          this.toast.error('Error',  'Fail to update team '+ error, {
            closeButton: true
          });
          modal.dismiss('Submitting the form');
        }
      );

    }

  }

  open_edit_team(content:any, team:any){
    console.log(team);
    this.show_create = false;
    this.newTeamForm = this.formBuilder.group({
        name: [team.name, [Validators.required, Validators.minLength(2)]],
        comment: [team.comment, [Validators.required, Validators.minLength(2)]],
        company : ['{ "id": '+team.company.id+', "name": "'+team.company.name+'" }', [Validators.required, Validators.minLength(2)]],
        id: [team.id]
    });
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  open_delete_team(content, team){
    console.log('delete team : ', team);
  }
}

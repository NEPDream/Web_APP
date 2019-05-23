import { Component, OnInit } from '@angular/core';
import { CompanyService } from '../services/company.service';
import { TeamService } from '../services/team.service';
import { RoleService } from '../services/role.service';
import { EmployeeService } from '../services/employee.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit {

  list_companies =[];
  list_team =[];
  list_team_filter=[];
  list_employee=[];
  list_unemployed=[];
  list_roles=[];
  filterText='';
  show_create = true;
  newEmployeeForm: FormGroup;
  closeResult: string;
  submitted = false;
  filterName ='employee';
  dropdownSettings = {};

  constructor(
              private _roleServ: RoleService,
              private _compServ: CompanyService,
              private _teamServ: TeamService,
              private _empServ: EmployeeService,
              private toast: ToastrService,
              private modalService: NgbModal, 
              private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    //init the form 
    this.newEmployeeForm = this.formBuilder.group({
        name: [''],
        badge: ['', Validators.required],
        start_date: ['', Validators.required],
        due_date: ['', Validators.required],
        is_full_time: ['', [Validators.required, Validators.minLength(2)]],
        user_id: ['', [Validators.required]],
        role_id: ['', Validators.required],
        company_id : ['', Validators.required],
        team_id: [[], Validators.required],
        id:[''],
        active:['true', Validators.required]
    });

    this._empServ.listEmployees().subscribe(
      data => {
        this.list_employee = data['employees'];
      },
      error => {}
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

    this._empServ.listUnEmployed().subscribe(
      data => {
        this.list_unemployed = data['users'];
      },
      error => { console.log('unable to retrieve the list of unemployed users')}
    );

    this._roleServ.listRoles().subscribe(
      data => {
        this.list_roles = data['roles'];
      },
      error => { console.log('unable to retrieve the list of unemployed users')}
    );

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
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
  get i() { return this.newEmployeeForm.controls; }

  onSubmitEmployee(modal:any){
    this.submitted = true;
    // stop here if form is invalid
    if (this.newEmployeeForm.invalid) {
      console.log('INVALID : ', this.i);
      return;
    }
    const data_emp = {
      badge: this.i.badge.value,
      start_date : this.i.start_date.value['year']+"-"+this.i.start_date.value['month']+"-"+this.i.start_date.value['day']+" 00:00:00",
      end_date : this.i.due_date.value['year']+"-"+this.i.due_date.value['month']+"-"+this.i.due_date.value['day']+" 23:59:59",
      is_full_time: this.i.is_full_time.value=="true",
      user_id: +this.i.user_id.value,
      role_id : +this.i.role_id.value,
      company_id:JSON.parse(this.i.company_id.value)['id'],
      team_id : this.i.team_id.value[0]['id'],
      id : this.i.id.value,
      active : this.i.active.value == "true"
    };
    console.log('submit', data_emp);
    if(this.i.id.value > 0){ // update employee
      this._empServ.updateEmployee(data_emp).subscribe(
        data => {
          this._empServ.listEmployees().subscribe(
            data => {
              this.list_employee = data['employees'];
              // show toast  notification success
              this.newEmployeeForm.reset();
              this.submitted = false;
              modal.dismiss('Submitting the form');
              this.toast.success('Success',  'Employee well Updated', {
                closeButton: true
              });
            },
            error => {
              console.log('fail to retreive enployees list');
            }
          );
        },
        error => {
          console.log('fail to update enployee ', data_emp);
        }
      );

    }else{ // create employee
      this._empServ.createNewEmployee(data_emp).subscribe(
        data => {
          this._empServ.listEmployees().subscribe(
            data => {
              this.list_employee = data['employees'];
              // show toast  notification success
              this.newEmployeeForm.reset();
              this.submitted = false;
              modal.dismiss('Submitting the form');
              this.toast.success('Success',  'Employee well Created', {
                closeButton: true
              });
            },
            error => {
              console.log('fail to retreive enployees list');
            }
          );
        },
        error => {
          console.log('error when creating employee', data_emp)
        }
      );

    }
  }

  open_edit_employee(content:any, employee:any) {
    this.show_create = false;
    var end_date ={};
    if(employee.due_date != 'None'){
      end_date = {year: parseInt(employee.due_date.split('-')[0]), month: parseInt(employee.due_date.split('-')[1]), day: parseInt(employee.due_date.split('-')[2])}
    }    
    this.newEmployeeForm = this.formBuilder.group({
        name: [employee.name],
        badge: [employee.badge, Validators.required],
        start_date: [{year: parseInt(employee.start_date.split('-')[0]), month: parseInt(employee.start_date.split('-')[1]), day: parseInt(employee.start_date.split('-')[2])}, [Validators.required, Validators.minLength(5)]],
        due_date: [end_date, [Validators.required, Validators.minLength(5)]],
        is_full_time: [String(employee.is_full_time), [Validators.required, Validators.minLength(2)]],
        user_id: [String(employee.user_id), [Validators.required]],
        role_id: [String(employee.role_id), Validators.required],
        company_id : ['{ "name":"nullname", "id":0}', Validators.required],
        team_id: [[{id:0, name:"name"}], Validators.required],
        active:[String(employee.active), Validators.required],
        id:[employee.id]
    });


    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

  open_delete_employee(content:any, employee:any){
    console.log('employee to delete : ', employee);
  }

  onCompanyChange(){    
    var comp = this.i.company_id.value;
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

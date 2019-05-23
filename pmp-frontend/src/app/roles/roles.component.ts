import { Component, OnInit } from '@angular/core';
import {RoleService} from '../services/role.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  filterText = '';
  show_create = true;
  newRoleForm: FormGroup;
  closeResult: string;
  submitted = false;
  filterName ='role';
  list_roles = [];

  constructor(private  _roleServ: RoleService, private toast: ToastrService, private modalService: NgbModal, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.newRoleForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
      id : ['']
    });

    this._roleServ.listRoles().subscribe(
      data => {
        this.list_roles = data['roles'];
      },
      error => {
        console.log('Something went wrong while retrieving roles list');
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
  get i() { return this.newRoleForm.controls; }

  onSubmitRole(modal:any){
    this.submitted = true;
    // stop here if form is invalid
    if (this.newRoleForm.invalid) {
      return;
    }
    if(this.i.id.value>0){ // update role
      this._roleServ.updateRole(this.i.id.value, this.i.name.value, this.i.comment.value).subscribe(
        data => {
          this._roleServ.listRoles().subscribe(
            data => {
              this.list_roles = data['roles'];
              this.toast.success('Success',  'Role data well updated', {
                closeButton: true
              });
            },
            error => {
              console.log('Something went wrong while retrieving roles list');
            }
          ); 
          this.newRoleForm.reset();
          this.submitted = false;
          modal.dismiss('Submitting the form');
        },
        error => {
          console.log('Something went wrong while updating new role');
          this.newRoleForm.reset();
          this.submitted = false;
          modal.dismiss('Submitting the form');
        }
      );
    }else{ // create new role
      this._roleServ.createNewRole(this.i.name.value, this.i.comment.value).subscribe(
        data => {
          this._roleServ.listRoles().subscribe(
            data => {
              this.list_roles = data['roles'];
              this.toast.success('Success',  'New Role created', {
                closeButton: true
              });
            },
            error => {
              console.log('Something went wrong while retrieving roles list');
              this.newRoleForm.reset();
              this.submitted = false;
              modal.dismiss('Submitting the form');
            }
          ); 
          this.newRoleForm.reset();
          this.submitted = false;
          modal.dismiss('Submitting the form');
        },
        error => {
          console.log('Something went wrong while creating new role');
          this.newRoleForm.reset();
          this.submitted = false;
          modal.dismiss('Submitting the form');
        }
      );
    }

  }

  open_edit_role(content:any, role:any){
    this.show_create = false;
    this.newRoleForm= this.formBuilder.group({
        name: [role.name, [Validators.required, Validators.minLength(2)]],
        comment: [role.comment, [Validators.required, Validators.minLength(2)]],
        id: [role.id]
    });
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  open_delete_role(content, role){
    console.log('delete team : ', role);
  }

}

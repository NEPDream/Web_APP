import { Component, OnInit } from '@angular/core';
import {CompanyService} from '../services/company.service'
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  list_companies = [];
  filterText = '';
  show_create = true;
  newCompanyForm: FormGroup;
  closeResult: string;
  submitted = false;
  filterName ='company';

  constructor(private _companyServ: CompanyService, private toast: ToastrService, private modalService: NgbModal, private formBuilder: FormBuilder) { 
  }

  ngOnInit() {
    this.newCompanyForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      comment: ['', [Validators.required, Validators.minLength(2)]],
      company_id : ['']
  });

    this._companyServ.listCompanies().subscribe(
      data => {
        this.list_companies = data['companies'];
      },
      error => {
        console.log('Something went wrong while retrieving company list');
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
  get c() { return this.newCompanyForm.controls; }

  onSubmitCompany(modal:any){
    this.submitted = true;
    // stop here if form is invalid
    if (this.newCompanyForm.invalid) {
      return;
    }
    if(this.c.company_id.value>0){ // update company
      this._companyServ.updateCompany(this.c.company_id.value, this.c.name.value, this.c.comment.value).subscribe(
        data => {
          this._companyServ.listCompanies().subscribe(
            data => {
              this.list_companies = data['companies'];
              this.newCompanyForm.reset();
              this.submitted = false;
              modal.dismiss('Submitting the form');
              this.toast.success('Success',  'Company data well updated', {
                closeButton: true
              });
            },
            error => {
              modal.dismiss('Submitting the form');
              console.log('Something went wrong while retrieving company list');
            }
          ); 
        },
        error =>{
          this.toast.error('Error',  'Fail to update company '+ error, {
            closeButton: true
          });
          modal.dismiss('Submitting the form');
        }
      );
    }
    else{ // create new
      this._companyServ.createNewCompany(this.c.name.value, this.c.comment.value).subscribe(
        data => {
          this._companyServ.listCompanies().subscribe(
            data => {
              this.list_companies = data['companies'];
              this.newCompanyForm.reset();
              this.submitted = false;
              modal.dismiss('Submitting the form');
              this.toast.success('Success',  'New Company Created', {
                closeButton: true
              });
            },
            error => {
              modal.dismiss('Submitting the form');
              console.log('Something went wrong while retrieving company list');
            }
          );         
        },
        error =>{
          this.toast.error('Error',  'Fail to create company '+ error, {
            closeButton: true
          });
          modal.dismiss('Submitting the form');
        }
      );
    }
  }

  open_edit_company(content:any, company:any) {
    console.log(company);
    this.show_create = false;
    this.newCompanyForm = this.formBuilder.group({
        name: [company.name, [Validators.required, Validators.minLength(2)]],
        comment: [company.comment, [Validators.required, Validators.minLength(2)]],
        company_id : [company.id]
    });

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  open_delete_issue(content:any, company:any){
    console.log('delete company : ', company);
  }

}

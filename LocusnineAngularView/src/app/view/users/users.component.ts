import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserDetails } from 'src/app/model/user-details';
import { UserService } from 'src/app/service/user.service';
import *  as  messageData from 'src/assets/JSON/messages.json';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public userDetailsList: UserDetails[] = new Array<UserDetails>();
  public userDetails: UserDetails;
  public newUserForm: FormGroup;
  public submitted = false;
  public addConfirmation = false;
  public updateConfirmation = false;
  public deleteConfirm = false;
  public userExistFlag: boolean = false;

  private message: any = (messageData as any).default;
  successMessage = '';
  errorMessage = '';
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
      previousLabel: '<',
      nextLabel: '>',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`
  };

  config = {
    itemsPerPage: 8,
    currentPage: 1,
    totalItems: this.userDetailsList.length
  };

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.getUserDetailsList(); 
  }

  onPageChange(event){
    console.log(event);
    this.config.currentPage = event;
  }
  

  ngOnInit(): void {
    this.deleteConfirm = false;
    this.newUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: [],
      roleType: ['', Validators.required],
      status:['A']
    });


  }

  private getUserDetailsList(){
    this.userService.getAllUserDetails().subscribe((data: any[]) => {
          this.userDetailsList = data;
        },
        error => {
          this.message = this.message['server.error'];
        }
    );
  }

  get newUserFormValues() { return this.newUserForm.controls; }

  addNewUser(){
    this.deleteConfirm = false;
    this.updateConfirmation = false;
    this.addConfirmation = true;
    this.submitted = false;
    this.successMessage = "";
    this.errorMessage = "";
    this.newUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      mobileNumber: [],
      roleType: ['', Validators.required],
      status:['A']
    });
  }

  addUserConfirmation(newUserForm){
    this.submitted = true;
    if (this.newUserForm.invalid) {
      return;
    }
    this.newUserForm = this.formBuilder.group({
      name: [this.newUserFormValues.name.value],
      email: [this.generateUniqueMailId(this.newUserFormValues.name.value)],
      mobileNumber: [this.newUserFormValues.mobileNumber.value],
      roleType: [this.newUserFormValues.roleType.value],
      status:[this.newUserFormValues.status.value]
    });
  }

  //Added by Gaurav Srivastava
  generateUniqueMailId(name: string): string{
    let newMailIdKey = "";
    name.toLowerCase().split(' ').forEach(e => { newMailIdKey += e;});
    for(let userDetails of this.userDetailsList) {
      if(userDetails.name.toLowerCase() == name.toLowerCase() || userDetails.email.includes(newMailIdKey + "@locusnine.com")){
        let pos = userDetails.email.split('@')[0].toLowerCase().split(newMailIdKey)[1];
        if(pos == ''){
          newMailIdKey += 1;         
        }else{
          newMailIdKey += Number(pos) + 1;
        }
        break;
      }
    }
    return newMailIdKey + '@locusnine.com';
  }

  initiateUpdateUserDetails(id: number){
    this.deleteConfirm = false;
    this.addConfirmation = false;
    this.updateConfirmation = true;
    this.errorMessage = "";
    this.successMessage = "";
    this.userDetailsList.forEach(element => {
      if(element.id == id){
        this.newUserForm = this.formBuilder.group({
          id: [element.id],
          name: [element.name],
          email: [element.email],
          mobileNumber: [element.mobileNumber],
          roleType: [element.roleType],
          status:[element.status]
        });
      }
    });
  }

  initiateDeleteUser(){
    this.addConfirmation = false;
    this.updateConfirmation = false;
    this.deleteConfirm = true;
  }

  updateUserConfirmation(newUserForm){
    this.submitted = true;
    if (this.newUserForm.invalid) {
      return;
    }
    this.newUserForm = this.formBuilder.group({
      id: [this.newUserFormValues.id.value],
      name: [this.newUserFormValues.name.value],
      email: [this.newUserFormValues.email.value],
      mobileNumber: [this.newUserFormValues.mobileNumber.value],
      roleType: [this.newUserFormValues.roleType.value],
      status:[this.newUserFormValues.status.value]
    });
  }

  confirmation(){
    this.userDetails = new UserDetails();
    this.userDetails.name = this.newUserFormValues.name.value;
    this.userDetails.email = this.newUserFormValues.email.value;
    this.userDetails.roleType = this.newUserFormValues.roleType.value;
    if(this.newUserFormValues.mobileNumber.value == null){
      this.userDetails.mobileNumber = '';
    }else{
      this.userDetails.mobileNumber = String(this.newUserFormValues.mobileNumber.value);
    }
    this.userDetails.status = this.newUserFormValues.status.value;

    if(this.updateConfirmation){
      this.userDetails.id = this.newUserFormValues.id.value;
      this.updateUserDetails(this.userDetails);
    }else if(this.addConfirmation){
      this.saveUserDetails(this.userDetails);
    }else if(this.deleteConfirm){
      this.deleteUserDetails(this.newUserFormValues.id.value);
    }
  }

  updateUserDetails(userDetails: UserDetails){
    this.userService.updateUserDetails(userDetails).subscribe(
        data => {
          if (data == false) {
            this.successMessage = "";
            this.errorMessage = this.message['update.failed'];
            return;
          }
          this.errorMessage = "";
          this.getUserDetailsList();
          this.successMessage = this.message['update.successfull'];
        },
        error => {
          this.errorMessage = this.message['server.error'];
        }
      );
  }

  saveUserDetails(userDetails: UserDetails){
    let id: number = 0;
    this.userExistFlag = false;
    this.errorMessage = "";
    this.successMessage = "";
    this.addConfirmation = false;
    this.userDetailsList.forEach(element => {
      if(element.id > id){
        id = element.id
      }
    });
    this.userDetailsList.forEach(element => {
      if(element.email == userDetails.email){
        this.userExistFlag = true;
        return;
      }
    });

    if(this.userExistFlag){
        this.successMessage = "";
        this.addNewUser();
        this.errorMessage = this.message['user.already.exist'];
        return;
    }
    userDetails.id = id + 1;
    this.userService.saveUserDetails(userDetails).subscribe(data => {
          if (data == false) {
            this.successMessage = "";
            this.errorMessage = this.message['add.user.failed'];
            return;
          }
          this.errorMessage = "";
          this.addNewUser();
          this.getUserDetailsList();
          this.successMessage = this.message['add.user.successfull'];
        },
        error => {
          this.errorMessage = this.message['server.error'];
        }
      );
  }

  deleteUserDetails(id: number){
    this.userService.deleteUserDetails(id).subscribe(
      data => {
        if (data == false) {
          this.successMessage = "";
          this.errorMessage = this.message['delete.failed'];
          return;
        }
        this.errorMessage = "";
        this.getUserDetailsList();
        this.addNewUser();
        this.deleteConfirm = true;
        this.successMessage = this.message['delete.successfull'];
      },
      error => {
        this.errorMessage = this.message['server.error'];
      }
    );
  }

}

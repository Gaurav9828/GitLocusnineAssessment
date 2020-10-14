import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  mobileNumberPattern =  "^[0-9_-]{10,12}";
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
    itemsPerPage: 9,
    currentPage: 1,
    totalItems: this.userDetailsList.length
  };

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
    this.getUserDetailsList();
  }

  onPageChange(event) {
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
      status: ['A']
    });


  }

  private getUserDetailsList() {
    this.userService.getAllUserDetails().subscribe((data: any[]) => {
      this.userDetailsList = data;
    },
      error => {
        this.message = this.message['server.error'];
      }
    );
  }

  get newUserFormValues() { return this.newUserForm.controls; }

  addNewUser() {
    this.serviceConfigurationByServiceType('addUser');
    this.submitted = false;
    this.successMessage = "";
    this.errorMessage = "";
    this.newUserForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      mobileNumber: ['', Validators.pattern(this.mobileNumberPattern)],
      roleType: ['', Validators.required],
      status: ['A']
    });
  }

  checkMobileNumberValidity(min: number, max: number){
    if(min == 0 || max == 10){
      return true;
    }else{
      return false;
    }
  }

  addUserConfirmation(newUserForm) {
    this.submitted = true;
    if (this.newUserForm.invalid) {
      return;
    }
    this.newUserForm = this.formBuilder.group({
      name: [this.newUserFormValues.name.value],
      email: [this.generateUniqueMailId(this.newUserFormValues.name.value)],
      mobileNumber: [this.newUserFormValues.mobileNumber.value],
      roleType: [this.newUserFormValues.roleType.value],
      status: [this.newUserFormValues.status.value]
    });
  }

  //Added by Gaurav Srivastava
  generateUniqueMailId(newUserName: string): string {
    let newMailIdKey = "";
    let num = 0;
    newUserName = newUserName.toLowerCase();
    newUserName.split(' ').forEach(e => { newMailIdKey += e; });
    newUserName = newMailIdKey;
    for (let userDetails of this.userDetailsList) {
      if (userDetails.email.includes(newUserName)) {
        let pos = userDetails.email.split('@')[0].toLowerCase().split(newUserName)[1];
        let userName = newUserName;
        num = (Number(pos) == 0 && num == 0) ? 0 : num;
        if(!(Number(pos) == 0 && num != 0)){
          num = Number(pos);
          newMailIdKey = (num != 0) ? userName += num + 1  : userName += 1;
        }
      }
    }
    return newMailIdKey + '@locusnine.com';
  }

  initiateUpdateUserDetails(id: number) {
    this.serviceConfigurationByServiceType('updateUser');
    this.errorMessage = "";
    this.successMessage = "";
    this.userDetailsList.forEach(element => {
      if (element.id == id) {
        this.newUserForm = this.formBuilder.group({
          id: [element.id],
          name: [element.name, Validators.required],
          email: [element.email],
          mobileNumber: [element.mobileNumber, Validators.pattern(this.mobileNumberPattern)],
          roleType: [element.roleType],
          status: [element.status]
        });
      }
    });
  }

  updateUserConfirmation(newUserForm) {
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
      status: [this.newUserFormValues.status.value]
    });
  }

  confirmation() {
    this.userDetails = new UserDetails();
    this.userDetails.name = this.newUserFormValues.name.value;
    this.userDetails.email = this.newUserFormValues.email.value;
    this.userDetails.roleType = this.newUserFormValues.roleType.value;
    if (this.newUserFormValues.mobileNumber.value == null) {
      this.userDetails.mobileNumber = '';
    } else {
      this.userDetails.mobileNumber = String(this.newUserFormValues.mobileNumber.value);
    }
    this.userDetails.status = this.newUserFormValues.status.value;

    if (this.updateConfirmation) {
      this.userDetails.id = this.newUserFormValues.id.value;
      this.updateUserDetails(this.userDetails);
    } else if (this.addConfirmation) {
      this.saveUserDetails(this.userDetails);
    } else if (this.deleteConfirm) {
      this.deleteUserDetails(this.newUserFormValues.id.value);
    }
  }

  updateUserDetails(userDetails: UserDetails) {
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

  saveUserDetails(userDetails: UserDetails) {
    let id: number = 0;
    this.userExistFlag = false;
    this.errorMessage = "";
    this.successMessage = "";
    this.addConfirmation = false;
    this.userDetailsList.forEach(element => {
      if (element.id > id) {
        id = element.id
      }
    });
    this.userDetailsList.forEach(element => {
      if (element.email == userDetails.email) {
        this.userExistFlag = true;
        return;
      }
    });

    if (this.userExistFlag) {
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

  deleteUserDetails(id: number) {
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

  serviceConfigurationByServiceType(serviceType: string) {
    this.deleteConfirm = false;
    this.addConfirmation = false;
    this.updateConfirmation = false;
    switch (serviceType) {
      case 'updateUser': {
        this.updateConfirmation = true;
        break;
      }
      case 'addUser': {
        this.addConfirmation = true;
        break;
      }
      case 'deleteUser': {
        this.deleteConfirm = true;
        break;
      }
    }
  }

}

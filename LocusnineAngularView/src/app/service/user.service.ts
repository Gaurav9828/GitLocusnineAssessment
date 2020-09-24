import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UserDetails } from 'src/app/model/user-details';


@Injectable()
export abstract class UserService {

    constructor(){}

    abstract getAllUserDetails(): Observable<UserDetails[]>;


    abstract saveUserDetails(userDetails: UserDetails): Observable<Boolean>;

    abstract updateUserDetails(userDetails: UserDetails): Observable<Boolean>;

    abstract deleteUserDetails(id: number): Observable<Boolean>;


}
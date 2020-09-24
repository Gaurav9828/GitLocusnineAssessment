import { Injectable } from '@angular/core';
import { UserDetails } from 'src/app/model/user-details';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as data from 'src/assets/JSON/serverProperties.json';
import { UserService } from './user.service';



@Injectable({ providedIn: 'root' })
export class UserServiceImpl implements UserService {
    private baseUrl: string = ""; 

    constructor(private http: HttpClient) { 
        this.baseUrl = 'https://localhost:44363/api/LoucsnineHome';
    }  
    httpOptions = {  
      headers: new HttpHeaders({  
        'Content-Type': 'application/json'  
      })  
    }   

    private serverDetails: any = (data as any).default;

    getAllUserDetails(): Observable<UserDetails[]> {
        let url = this.baseUrl;
        return this.http.get<UserDetails[]>(url);
    }

    saveUserDetails(userDetails: UserDetails): Observable<Boolean> {
        let url = this.baseUrl + "/add/new/user/details";
        return this.http.post<boolean>(url, userDetails);
    }

    updateUserDetails(userDetails: UserDetails): Observable<Boolean> {
        let url = this.baseUrl + "/update/user/details";
        return this.http.post<boolean>(url, userDetails);
    }
    
    deleteUserDetails(id: number): Observable<Boolean> {
        let url = this.baseUrl + "/delete/user/details";
        return this.http.post<boolean>(url,id);
    }

}
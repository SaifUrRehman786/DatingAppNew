import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';


const httpOptions = {
 
  headers: new HttpHeaders({

    Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('user'))?.token

    // Authorization: 'Bearer ' + (JSON.parse(localStorage.getItem('user')).user).currentUser.accessToken

})
}

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  constructor(private http: HttpClient) { }

  getMembers(){
    if(this.members.length>0) return of(this.members); 
    return this.http.get<Member[]>(this.baseUrl +'users', httpOptions).pipe(
      map(members =>{
        this.members = members;
        return members;
      })
    )

  }

  getMember(username: string){
    const member = this.members.find(x=>x.username === username);
    if(member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl +'users/' + username, httpOptions);

  }

  updateMember(member: Member){

    return this.http.put(this.baseUrl+'users', member, httpOptions).pipe(
      map(() =>{
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    )

  }

  setMainPhoto(photoId: number)
  {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {}, httpOptions);
  }

  deletePhoto(photoId: number)
  {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId, httpOptions);
  }
}

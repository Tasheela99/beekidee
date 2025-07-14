import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AttentionService {

  private http = inject(HttpClient);
  apiUrl = API_URL;

  trackAttention(studentId: any, sessionId: any) {
    const data = {
      student_id: studentId,
      session_id: sessionId
    };
    return this.http.post(this.apiUrl + 'start_tracking', data);
  }


  getAttentionData(){
    return this.http.get(this.apiUrl + '/data');
  }

}

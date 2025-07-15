import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../../environments/environment";
import {Observable} from "rxjs";

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


  getStudentAttentionLevel(studentName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_attention_data/${studentName}`);
  }

}

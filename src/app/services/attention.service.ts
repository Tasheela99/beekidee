import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {API_URL} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AttentionService {

  private http = inject(HttpClient);
  apiUrl = API_URL;

  trackAttention(){
    return this.http.get(this.apiUrl + '/start');
  }

  getAttentionData(){
    return this.http.get(this.apiUrl + '/data');
  }

}

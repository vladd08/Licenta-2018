import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';
import { Project } from './project.model';

@Injectable()
export class HourService {
  putHoursTrackingPath = '';
  requests: any[] = [];
  constructor(private httpService: HttpService,
    private http: HttpClient,
    private router: Router) {
    this.http.get('../../assets/config.json').subscribe(
      data => {
        this.putHoursTrackingPath = data['putHours'];
      },
      err => { console.log(err); }
    );
  }

  insertTracking(id, data) {
    return this.httpService.put(this.putHoursTrackingPath, id, localStorage.getItem('tfatoken'), data);
  }

  getTrackingsForMonth(id) {
    return this.httpService.get(this.putHoursTrackingPath, localStorage.getItem('tfatoken'), id);
  }

  getRequests(id) {
    return this.httpService.get(this.putHoursTrackingPath + '/requests', localStorage.getItem('tfatoken'), id);
  }

}

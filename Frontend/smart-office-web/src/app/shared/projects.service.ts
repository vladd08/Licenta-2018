import { HttpService } from './http.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';
import { Project } from './project.model';

@Injectable()
export class ProjectService {
  getAllPath = '';
  updatePath = '';
  getUsersPath = '';
  addAssignmentPath = '';
  constructor(private httpService: HttpService,
    private http: HttpClient,
    private router: Router) {
    this.http.get('../../assets/config.json').subscribe(
      data => {
        this.getAllPath = data['getAllProjects'];
        this.updatePath = data['updateProject'];
        this.getUsersPath = data['getUsersForProject'];
        this.addAssignmentPath = data['addAssignment'];
      },
      err => { console.log(err); }
    );
  }

  getAllProjects() {
    return this.httpService.get(this.getAllPath, localStorage.getItem('tfatoken'));
  }

  updateProject(id, body) {
    return this.httpService.put(this.updatePath, id, localStorage.getItem('tfatoken'), body);
  }

  getUsersForProject(id) {
    return this.httpService.get(this.getUsersPath, localStorage.getItem('tfatoken'), id);
  }

  insertProject(projectData) {
    return this.httpService.post(this.updatePath, localStorage.getItem('tfatoken'), projectData);
  }

  addAssignment(assignmentData) {
    return this.httpService.post(this.addAssignmentPath, localStorage.getItem('tfatoken'), assignmentData);
  }
}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '../../shared/users.service';
import { ProjectService } from '../../shared/projects.service';
import { Project } from '../../shared/project.model';
import { MatSnackBar } from '@angular/material';
import { User } from '../../shared/user.model';
import { Chart } from 'chart.js';
import { ChartsModule } from 'ng2-charts';

@Component({
  selector: 'so-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  chartOptions = {
    responsive: true
  };
  chart = [];
  project: Project;
  projectData = {};
  projectLabels = {};
  users: User[] = [];
  assigneeToAdd = '';
  projectId: String = '';
  extrahours = 0;
  loading = false;
  unauthorized = false;
  showDetailForm = false;
  addProjectForm = false;
  addAssigneeForm = false;
  nothingToAdd = false;
  addedSuccess = false;
  alreadyExists = false;
  addProjectError = false;
  noProjects = false;
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {

    this.loading = true;
    setTimeout(() => {
      this.getAll();
    }, 2000);
  }

  getAll() {
    this.projects = [];
    this.project = {};
    this.users = [];
    this.projectService.getAllProjects().subscribe(
      (data: any) => {
        this.userService.getAllUsers().subscribe(
          (dt: User[]) => {
            this.users = dt;
            if (data.result.length === 0) {
              this.noProjects = true;
              this.loading = false;
            } else {
              this.noProjects = false;
              for (const project of data.result) {
                const today = new Date();
                const deadline = new Date(project.deadline);
                project.assignees = [];
                today.setHours(0, 0, 0, 0);
                if (today > deadline) {
                  project.finished = true;
                }
                const timeDiff = Math.abs(deadline.getTime() - today.getTime());
                const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                project.daystodeadline = diffDays;
                this.projects.push(project);
              }
              for (const project of this.projects) {
                this.projectService
                  .getUsersForProject(project._id)
                  .subscribe((d: any) => {
                    for (const assignment of d.result) {
                      const user: User = this.users.find(
                        x => x._id === assignment.userId
                      );
                      project.assignees.push(user);
                    }
                    this.loading = false;
                  });
              }
              this.projects.sort((p1: Project, p2: Project) => {
                if (p1.deadline < p2.deadline) {
                  return 1;
                } else {
                  return 0;
                }
              });
            }
          },
          err => {
            this.loading = false;
            this.unauthorized = true;
          }
        );
      },
      err => {
        this.unauthorized = true;
        this.loading = false;
      }
    );
  }

  showProject(index) {
    if (index !== '') {
      this.project = this.projects[index];
      let hourstotalData = [];
      let estimatedhoursData = [];
      for ( let i = 0 ; i <= this.project.hourstotal ; i++ ) {
        hourstotalData.push(i);
      }
      for ( let i = 0 ; i <= this.project.estimated ; i++ ) {
          estimatedhoursData.push(i);
      }
      this.projectData = [
        {data: hourstotalData, label: 'Total Hours'},
        {data: estimatedhoursData, label: 'Estimated Hours'}
      ];
      this.projectLabels = estimatedhoursData;
    }
    this.showDetailForm = !this.showDetailForm;
  }

  addHoursToProject() {
    const body = {
      estimated: Number(this.project.estimated) + Number(this.extrahours)
    };
    this.projectService.updateProject(this.project._id, body).subscribe(
      (data: any) => {
        this.showProject('');
        this.snackBar.open(data.message, 'Okay', { duration: 3000 });
        this.loading = true;
        this.extrahours = 0;
        setTimeout(() => {
          this.getAll();
          this.loading = false;
        }, 2000);
      },
      err => {
        console.log(err);
        this.unauthorized = true;
      }
    );
  }

  endProject(index) {
    const body = {
      deadline: new Date(Date.now() - 864e5)
    };
    this.projectService.updateProject(this.projects[index]._id, body).subscribe(
      (data: any) => {
        this.snackBar.open(data.message, 'Okay', { duration: 3000 });
        this.loading = true;
        setTimeout(() => {
          this.getAll();
          this.loading = false;
        }, 2000);
      },
      err => {
        console.log(err);
        this.unauthorized = true;
      }
    );
  }

  showProjectForm() {
    this.addProjectForm = !this.addProjectForm;
  }

  showAssigneeForm(index) {
    this.addedSuccess = false;
    if (index !== '') {
      this.projectId = this.projects[index]._id;
      this.project = this.projects[index];
    }
    this.addAssigneeForm = !this.addAssigneeForm;
  }

  onSubmitProject(form) {
    this.addProjectError = false;
    const body = {
      name: form.value.projectname,
      description: form.value.description,
      estimated: form.value.estimated,
      started: new Date(Date.now()),
      deadline: form.value.deadline,
      documentationlink: form.value.documentation,
      gitlink: form.value.git,
      issuetrackinglink: form.value.issue
    };
    this.projectService.insertProject(body).subscribe(
      (data: any) => {
        this.snackBar.open(data, 'Okay', { duration: 3000 });
        this.loading = true;
        this.showProjectForm();
        setTimeout(() => {
          this.getAll();
          this.loading = false;
        }, 2000);
      },
      (err: any) => {
        console.log(err);
        if (err.status === 400) {
          this.addProjectError = true;
        } else {
          this.unauthorized = true;
        }
      }
    );
  }

  addAssignee() {
    this.alreadyExists = false;
    this.nothingToAdd = false;
    this.addedSuccess = false;
    if (this.assigneeToAdd === '' || this.assigneeToAdd === 'Please select an employee') {
      this.nothingToAdd = true;
    } else {
      this.nothingToAdd = false;
      for (const assignee of this.project.assignees) {
        if (assignee._id === this.assigneeToAdd) {
          this.alreadyExists = true;
        }
      }
      if (!this.alreadyExists) {
        const body = {
          userId: this.assigneeToAdd,
          projectId: this.projectId
        };
        this.projectService.addAssignment(body).subscribe(
          (data: any) => {
            this.addedSuccess = true;
            this.snackBar.open(data.message, 'Okay', { duration: 3000 });
            this.loading = true;
            this.showAssigneeForm('');
            setTimeout(() => {
              this.assigneeToAdd = 'Please select an employee';
              this.getAll();
              this.loading = false;
            }, 2000);
          },
          err => {
            console.log(err);
            this.unauthorized = true;
          }
        );
      }
    }
  }
}

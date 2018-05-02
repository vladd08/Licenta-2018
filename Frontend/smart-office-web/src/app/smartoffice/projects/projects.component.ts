import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/users.service';
import { ProjectService } from '../../shared/projects.service';
import { Project } from '../../shared/project.model';
import { MatSnackBar } from '@angular/material';
import { User } from '../../shared/user.model';

@Component({
  selector: 'so-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  project: Project;
  users: User[] = [];
  loading = false;
  unauthorized = false;
  showDetailForm = false;
  extrahours = 0;
  constructor(private projectService: ProjectService,
    private userService: UserService,
    public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      this.getAll();
      this.loading = false;
    }, 2000);
  }

  getAll() {
    this.projects = [];
    this.project = {};
    this.users = [];
    this.projectService.getAllProjects().subscribe((data: any) => {
      console.log(data);
      this.userService.getAllUsers().subscribe((dt: User[]) => {
        this.users = dt;
        console.log(this.users);
      },
        err => {
          this.unauthorized = true;
        });
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
      let cont = 0;
      for (const project of this.projects) {
        this.projectService.getUsersForProject(project._id).subscribe((d: any) => {
          for (const assignement of d.result) {
            for (const p of this.projects) {
              if (p._id === assignement.projectId) {
                console.log(assignement);
                p.assignees.push(this.users.find(x => x._id === assignement.userId));
              }
            }
          }

          cont += 1;
        });
      }
      console.log(this.projects);
      this.projects.sort((p1: Project, p2: Project) => {
        if (p1.deadline < p2.deadline) {
          return 1;
        } else {
          return 0;
        }
      });
    },
      (err) => {
        this.unauthorized = true;
      });
  }

  showProject(index) {
    if (index !== '') {
      this.project = this.projects[index];
    }
    this.showDetailForm = !this.showDetailForm;
  }

  addHoursToProject() {
    const body = {
      estimated: Number(this.project.estimated) + Number(this.extrahours)
    };
    this.projectService.updateProject(this.project._id, body).subscribe((data: any) => {
      this.showProject('');
      this.snackBar.open(data.message, 'Okay', { duration: 3000 });
      this.loading = true;
      this.extrahours = 0;
      setTimeout(() => {
        this.getAll();
        this.loading = false;
      }, 2000);
    },
      (err) => {
        console.log(err);
        this.unauthorized = true;
      });
  }

  endProject(index) {
    const body = {
      deadline: new Date(Date.now() - 864e5)
    };
    console.log(body);
    this.projectService.updateProject(this.projects[index]._id, body).subscribe((data: any) => {
      this.snackBar.open(data.message, 'Okay', { duration: 3000 });
      this.loading = true;
      setTimeout(() => {
        this.getAll();
        this.loading = false;
      }, 2000);
    },
      (err) => {
        console.log(err);
        this.unauthorized = true;
      });
  }
}

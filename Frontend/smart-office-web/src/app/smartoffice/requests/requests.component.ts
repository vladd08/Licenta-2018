import { Component, OnInit } from '@angular/core';
import { HourService } from '../../shared/hours.service';
import { UserService } from '../../shared/users.service';
import { ProjectService } from '../../shared/projects.service';
import { Report } from '../../shared/report.model';
import { Project } from '../../shared/project.model';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'so-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  loading: Boolean = false;

  reportList: Report[] = [];
  requests: any[] = [];
  projects: Project[] = [];

  mondays: Date[] = [];
  sundays: Date[] = [];

  constructor(private hourService: HourService,
    private userService: UserService,
    private projectService: ProjectService,
    public snackBar: MatSnackBar,
    public router: Router) { }

  ngOnInit() {
    this.loading = true;
    if (this.hourService.requests.length !== 0) {
      this.requests = this.hourService.requests;
      for (const request of this.requests) {
        const report = new Report();
        report.id = request._id;
        for (const user of this.userService.users) {
          if (user._id === request.userId) {
            report.Firstname = user.firstname;
            report.Lastname = user.lastname;
          }
        }

        this.hourService.getTrackingsForMonth(request.userId).subscribe((data: any) => {
          const trackings = data.result;
          const month = request.month;
          let stringMonth = '';
          switch (month) {
            case 1: stringMonth = 'Jan'; break;
            case 2: stringMonth = 'Feb'; break;
            case 3: stringMonth = 'Mar'; break;
            case 4: stringMonth = 'Apr'; break;
            case 5: stringMonth = 'May'; break;
            case 6: stringMonth = 'Jun'; break;
            case 7: stringMonth = 'Jul'; break;
            case 8: stringMonth = 'Aug'; break;
            case 9: stringMonth = 'Sep'; break;
            case 10: stringMonth = 'Oct'; break;
            case 11: stringMonth = 'Nov'; break;
            case 12: stringMonth = 'Dec'; break;
          }
          report.Month = stringMonth;
          report.Year = new Date(Date.now()).getFullYear().toString();

          const dateString = month + '/01/' + new Date(Date.now()).getFullYear();
          this.mondays = this.getMondays(dateString);
          this.sundays = this.getNextSundays();
          for (const tracking of trackings) {
            // tslint:disable-next-line:max-line-length
            if (this.sameDay(this.mondays[0], new Date(tracking.date)) || ((this.mondays[0] < new Date(tracking.date)) && (new Date(tracking.date) < this.sundays[3]))) {
              report.TrackingData.push(tracking);
            }
          }
          if (report.TrackingData.length > 0) { // only if there is tracking data
            for (const tracking of report.TrackingData) {
              report.TotalHours += tracking.hours;
              report.TotalMinutes += tracking.minutes;
              if (report.TotalMinutes >= 60) {
                report.TotalHours += 1;
                report.TotalMinutes = report.TotalMinutes - 60;
              }
            }
            if (report.TotalHours > 160) {
              report.Overtime = report.TotalHours - 160;
            }
            let projectsWorked = [];
            setTimeout(() => {
              this.projectService.getAllProjects().subscribe((d: any) => {
                this.projects = d.result;
                projectsWorked = this.checkProjects(report.TrackingData);
                for (const project of this.projects) {
                  for (const aux of projectsWorked) {
                    if (project._id === aux) {
                      report.Projects.push(project);
                    }
                  }
                }
                for (const project of report.Projects) {
                  let totalhours = 0;
                  let totalminutes = 0;
                  for (const tracking of report.TrackingData) {
                    if (project._id === tracking.projectId) {
                      totalhours += tracking.hours;
                      totalminutes += tracking.minutes;
                      if (totalminutes >= 60) {
                        totalhours += 1;
                        totalminutes = totalminutes - 60;
                      }
                    }
                  }
                  report.Hours.push(totalhours);
                  report.Minutes.push(totalminutes);
                }
                this.reportList.push(report);
                this.loading = false;
              });
            }, 2000);
          } else {
            this.loading = false;
          }
        });
      }
    } else {
      this.loading = false;
    }
  }

  sameDay(d1, d2) {
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
      d1.getUTCMonth() === d2.getUTCMonth() &&
      d1.getUTCDate() === d2.getUTCDate();
  }

  getMondays(date: string) {
    const d = new Date(date),
      month = d.getMonth(),
      mondays = [];
    d.setDate(1);
    // Get the first Monday in the month
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }
    // Get all the other Mondays in the month
    while (d.getMonth() === month) {
      mondays.push(new Date(d.getTime()));
      d.setDate(d.getDate() + 7);
    }
    return mondays;
  }

  getNextSundays() {
    const sundays: Date[] = [];
    let nextSunday = this.getSundayOfWeek(this.mondays[0]);
    sundays.push(new Date(nextSunday));
    for (let i = 0; i < 3; i++) {
      nextSunday = new Date(nextSunday.setDate(nextSunday.getDate() + 7));
      sundays.push(new Date(nextSunday));
    }
    return sundays;
  }

  getSundayOfWeek(date: Date) {
    const day = date.getDay();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + (day === 0 ? 0 : 7) - day);
  }

  checkProjects(trackings) {
    const projs = [];
    projs.push(trackings[0].projectId);
    for (const tracking of trackings) {
      for (const comparedProject of this.projects) {
        if (tracking.projectId === comparedProject._id) {
          if (!projs.includes(tracking.projectId)) {
            projs.push(tracking.projectId);
          }
        }
      }
    }
    return projs;
  }

  acceptTracking(index) {
    const body = {
      status: 'approved'
    };
    this.hourService.acceptTracking(this.reportList[index].id, body).subscribe((data: any) => {
      for (let i = 0; i < this.reportList[index].Projects.length; i++) {
        this.projectService.updateProject(this.reportList[index].Projects[i]._id, {
          hourstotal: this.reportList[index].Hours[i] + this.reportList[index].Projects[i].hourstotal
        }).subscribe((d: any) => {
          this.snackBar.open('Hours added to project(s)', 'Okay', { duration: 3000 });
          this.hourService.requests.splice(this.hourService.requests.indexOf(this.reportList[index]), 1);
          setTimeout(() => {
            location.reload();
          }, 1500);
        }, (err) => {
          console.log(err);
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';
import { Project } from '../../shared/project.model';
import { Tracking } from '../../shared/tracking.model';
import { ProjectTracking } from '../../shared/project-tracking.model';
import { WeekTracking } from '../../shared/week-tracking.model';
import { MonthTracking } from '../../shared/month-tracking.model';
import { ControlMatrix } from '../../shared/control-matrix.model';
import { HoursForProject } from '../../shared/hours-for-projects.model';
import { MonthlyHoursForProjects } from '../../shared/monthly-hours-for-projects.model';
import { ProjectService } from '../../shared/projects.service';
import { HourService } from '../../shared/hours.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'so-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.css']
})
export class HoursComponent implements OnInit {
  projects: any[] = [];

  todayDate: Date = new Date(Date.now());
  today: string = this.todayDate.toDateString();
  mondays: Date[];
  sundays: Date[];
  selectedWeekStart: string;
  selectedWeekEnd: string;
  currentWeek = 1;

  unauthorized: Boolean = false;
  noProjects: Boolean = false;
  loading: Boolean = false;
  trackingDisabled: Boolean = false;
  currentWeekNumber: Number = 0;
  monthLowerLimit: Boolean = false;
  monthUpperLimit: Boolean = false;
  formatError: Boolean = false;
  overtimeAlert: Boolean = false;

  weekTracking: WeekTracking = new WeekTracking([]);
  monthTracking: MonthTracking = new MonthTracking([], [], [], []);
  monthValueErrorMatrix: ControlMatrix[] = [];
  monthlyHoursForProjects: MonthlyHoursForProjects = new MonthlyHoursForProjects([]);
  trackings: any[] = [];
  numberOfProjects = 0;
  overtimeHours = 0;
  overtimeMinutes = 0;
  totalHoursForAllProjects = 0;
  totalMinutesForAllProjects = 0;
  totalOvertimeHours = 0;
  totalOvertimeMinutes = 0;

  overtime: number[] = [];
  overtimeMins: number[] = [];

  previousValue: string;
  constructor(private projectService: ProjectService,
    private hourService: HourService,
    public snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit() {
    const currentDay = this.todayDate.getDay();
    if (currentDay === 6 || currentDay === 0) {
      this.trackingDisabled = false;
    }
    this.loading = true;
    setTimeout(() => {
      this.projectService.getUsersProject(localStorage.getItem('uId')).subscribe((data: any) => {
        if (data.result.length === 0) {
          this.noProjects = true;
        } else {
          const proj = data.result;
          this.numberOfProjects = proj.length;
          for (let i = 0; i < this.numberOfProjects; i++) {
            this.projectService.getProjectById(proj[i].projectId).subscribe((d: any) => {
              if (!(new Date(d.result[0].deadline) < new Date(this.todayDate))) {
                this.projects.push(d.result[0]);
                this.numberOfProjects = this.projects.length;
              }
            }, (err) => {
              console.log(err);
              this.unauthorized = true;
            });
          }
          this.hourService.getTrackingsForMonth(localStorage.getItem('uId')).subscribe((d: any) => {
            for (let i = 0; i < 4; i++) {
              const controlValueMatrix: ControlMatrix = new ControlMatrix(this.numberOfProjects, 5);
              this.monthValueErrorMatrix.push(controlValueMatrix);
            }
            this.splitMonthInWeeks();
            for (let k = 0; k < 4; k++) {
              this.monthlyHoursForProjects[k] = [];
              for (let i = 0; i < this.numberOfProjects; i++) { // initialize total hours for projects
                const totalHoursForProjects: HoursForProject[] = [];
                totalHoursForProjects[i] = new HoursForProject(0, 0);
                this.monthlyHoursForProjects[k][i] = totalHoursForProjects[i];
              }
              this.monthlyHoursForProjects[k][this.numberOfProjects] = 0;
              this.monthlyHoursForProjects[k][this.numberOfProjects + 1] = 0;
            }
            this.trackings = d.result;
            if (this.trackings.length !== 0) {
              for (const tracking of this.trackings) {
                for (const project of this.projects) {
                  if (tracking.projectId === project._id) {
                    const index = this.projects.indexOf(project);
                    if ((new Date(tracking.date) > new Date(this.mondays[0])) && (new Date(tracking.date) < new Date(this.sundays[3]))) {
                      console.log('a');
                      if (this.sameDay(this.mondays[0], new Date(tracking.date))
                        || ((this.mondays[0] < new Date(tracking.date)) && (new Date(tracking.date) < this.sundays[0]))) {
                        // tslint:disable-next-line:max-line-length
                        this.monthTracking.weekOneTracking[0].projectTracking[index].trackingList[new Date(tracking.date).getDay() - 1].hours = tracking.hours;
                        // tslint:disable-next-line:max-line-length
                        this.monthTracking.weekOneTracking[0].projectTracking[index].trackingList[new Date(tracking.date).getDay() - 1].minutes = tracking.minutes;
                        // tslint:disable-next-line:max-line-length
                        this.monthValueErrorMatrix[0].controlValueMatrix[index][new Date(tracking.date).getDay() - 1] = tracking.hours + ':' + tracking.minutes;
                        this.monthlyHoursForProjects[0][index].hours += tracking.hours;
                        this.monthlyHoursForProjects[0][index].minutes += tracking.minutes;
                        if (this.monthlyHoursForProjects[0][index].minutes >= 60) {
                          this.monthlyHoursForProjects[0][index].hours += 1;
                          this.monthlyHoursForProjects[0][index].minutes = this.monthlyHoursForProjects[1][index].minutes - 60;
                        }
                        let totalHours = 0;
                        let totalMinutes = 0;
                        for (let i = 0; i < this.numberOfProjects; i++) {
                          totalHours += this.monthlyHoursForProjects[0][i].hours;
                          totalMinutes += this.monthlyHoursForProjects[0][i].minutes;
                          if (totalMinutes >= 60) {
                            totalHours += 1;
                            totalMinutes -= 60;
                          }
                        }
                        this.monthlyHoursForProjects[0][this.numberOfProjects] = totalHours;
                        this.monthlyHoursForProjects[0][this.numberOfProjects + 1] = totalMinutes;
                      }
                      if (this.sameDay(this.mondays[1], new Date(tracking.date))
                        || ((this.mondays[1] < new Date(tracking.date)) && (new Date(tracking.date) < this.sundays[1]))) {
                        // tslint:disable-next-line:max-line-length
                        this.monthTracking.weekTwoTracking[0].projectTracking[index].trackingList[new Date(tracking.date).getDay() - 1].hours = tracking.hours;
                        // tslint:disable-next-line:max-line-length
                        this.monthTracking.weekTwoTracking[0].projectTracking[index].trackingList[new Date(tracking.date).getDay() - 1].minutes = tracking.minutes;
                        // tslint:disable-next-line:max-line-length
                        // tslint:disable-next-line:max-line-length
                        this.monthValueErrorMatrix[1].controlValueMatrix[index][new Date(tracking.date).getDay() - 1] = tracking.hours + ':' + tracking.minutes;
                        this.monthlyHoursForProjects[1][index].hours += tracking.hours;
                        this.monthlyHoursForProjects[1][index].minutes += tracking.minutes;
                        if (this.monthlyHoursForProjects[1][index].minutes >= 60) {
                          this.monthlyHoursForProjects[1][index].hours += 1;
                          this.monthlyHoursForProjects[1][index].minutes = this.monthlyHoursForProjects[1][index].minutes - 60;
                        }
                        let totalHours = 0;
                        let totalMinutes = 0;
                        for (let i = 0; i < this.numberOfProjects; i++) {
                          totalHours += this.monthlyHoursForProjects[1][i].hours;
                          totalMinutes += this.monthlyHoursForProjects[1][i].minutes;
                          if (totalMinutes >= 60) {
                            totalHours += 1;
                            totalMinutes -= 60;
                          }
                        }
                        this.monthlyHoursForProjects[1][this.numberOfProjects] = totalHours;
                        this.monthlyHoursForProjects[1][this.numberOfProjects + 1] = totalMinutes;
                      }
                      if (this.sameDay(this.mondays[2], new Date(tracking.date))
                        || ((this.mondays[2] < new Date(tracking.date)) && (new Date(tracking.date) < this.sundays[2]))) {
                        // tslint:disable-next-line:max-line-length
                        this.monthTracking.weekThreeTracking[0].projectTracking[index].trackingList[new Date(tracking.date).getDay() - 1].hours = tracking.hours;
                        // tslint:disable-next-line:max-line-length
                        this.monthTracking.weekThreeTracking[0].projectTracking[index].trackingList[new Date(tracking.date).getDay() - 1].minutes = tracking.minutes;
                        // tslint:disable-next-line:max-line-length
                        this.monthValueErrorMatrix[2].controlValueMatrix[index][new Date(tracking.date).getDay() - 1] = tracking.hours + ':' + tracking.minutes;
                        this.monthlyHoursForProjects[2][index].hours += tracking.hours;
                        this.monthlyHoursForProjects[2][index].minutes += tracking.minutes;
                        if (this.monthlyHoursForProjects[2][index].minutes >= 60) {
                          this.monthlyHoursForProjects[2][index].hours += 1;
                          this.monthlyHoursForProjects[2][index].minutes = this.monthlyHoursForProjects[1][index].minutes - 60;
                        }
                        let totalHours = 0;
                        let totalMinutes = 0;
                        for (let i = 0; i < this.numberOfProjects; i++) {
                          totalHours += this.monthlyHoursForProjects[2][i].hours;
                          totalMinutes += this.monthlyHoursForProjects[2][i].minutes;
                          if (totalMinutes >= 60) {
                            totalHours += 1;
                            totalMinutes -= 60;
                          }
                        }
                        this.monthlyHoursForProjects[2][this.numberOfProjects] = totalHours;
                        this.monthlyHoursForProjects[2][this.numberOfProjects + 1] = totalMinutes;
                      }
                      if (this.sameDay(this.mondays[3], new Date(tracking.date))
                        || ((this.mondays[3] < new Date(tracking.date)) && (new Date(tracking.date) < this.sundays[3]))) {
                        // tslint:disable-next-line:max-line-length
                        this.monthTracking.weekFourTracking[0].projectTracking[index].trackingList[new Date(tracking.date).getDay() - 1].hours = tracking.hours;
                        // tslint:disable-next-line:max-line-length
                        this.monthTracking.weekFourTracking[0].projectTracking[index].trackingList[new Date(tracking.date).getDay() - 1].minutes = tracking.minutes;
                        // tslint:disable-next-line:max-line-length
                        this.monthValueErrorMatrix[3].controlValueMatrix[index][new Date(tracking.date).getDay() - 1] = tracking.hours + ':' + tracking.minutes;
                        this.monthlyHoursForProjects[3][index].hours += tracking.hours;
                        this.monthlyHoursForProjects[3][index].minutes += tracking.minutes;
                        if (this.monthlyHoursForProjects[3][index].minutes >= 60) {
                          this.monthlyHoursForProjects[3][index].hours += 1;
                          this.monthlyHoursForProjects[3][index].minutes = this.monthlyHoursForProjects[1][index].minutes - 60;
                        }
                        let totalHours = 0;
                        let totalMinutes = 0;
                        for (let i = 0; i < this.numberOfProjects; i++) {
                          totalHours += this.monthlyHoursForProjects[3][i].hours;
                          totalMinutes += this.monthlyHoursForProjects[3][i].minutes;
                          if (totalMinutes >= 60) {
                            totalHours += 1;
                            totalMinutes -= 60;
                          }
                        }
                        this.monthlyHoursForProjects[3][this.numberOfProjects] = totalHours;
                        this.monthlyHoursForProjects[3][this.numberOfProjects + 1] = totalMinutes;
                      }
                    }
                  }
                }
              }
            }
            this.loading = false;
          }, (err) => {
            console.log(err);
          });

        }
      }, (err) => {
        this.unauthorized = true;
        this.loading = false;
        this.noProjects = true;
        console.log(err);
      });
    }, 2000);
    this.mondays = this.getMondays(); // get the Mondays of the current month
    this.sundays = this.getNextSundays(); // get the next 4 Sundays of the month
    for (let i = 0; i < 4; i++) { // setting the current week of the moth - 1,2,3,4
      if (this.sameDay(this.mondays[i], this.todayDate) || ((this.mondays[i] < this.todayDate) && (this.todayDate < this.sundays[i]))) {
        this.currentWeek = i + 1;
      }
    }
    this.selectedWeekStart = this.mondays[this.currentWeek - 1].toDateString();
    this.selectedWeekEnd = this.sundays[this.currentWeek - 1].toDateString();
    this.checkMonthLimits();


  }

  sameDay(d1, d2) {
    return d1.getUTCFullYear() === d2.getUTCFullYear() &&
      d1.getUTCMonth() === d2.getUTCMonth() &&
      d1.getUTCDate() === d2.getUTCDate();
  }

  getMondays() {
    let d = new Date();
    let month = d.getMonth();
    const mondays = [];
    const y = d.getFullYear(), m = d.getMonth();
    const firstDay = new Date(y, m, 1);
    if (firstDay.getDate() === this.todayDate.getDate()) {
      month -= 1;
    }
    d = new Date(y, month);
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

  nextWeek() {
    this.currentWeek += 1;
    this.checkMonthLimits();
    this.selectedWeekStart = this.mondays[this.currentWeek - 1].toDateString();
    this.selectedWeekEnd = this.sundays[this.currentWeek - 1].toDateString();
  }

  previousWeek() {
    this.currentWeek -= 1;
    this.checkMonthLimits();
    this.selectedWeekStart = this.mondays[this.currentWeek - 1].toDateString();
    this.selectedWeekEnd = this.sundays[this.currentWeek - 1].toDateString();
  }

  splitMonthInWeeks() {
    const weekTrackingAux = new WeekTracking([]);
    for (let i = 0; i < this.numberOfProjects; i++) {
      const oneWeekTracking: ProjectTracking = new ProjectTracking(new Array());
      for (let aux = 0; aux < 5; aux++) {

        oneWeekTracking.trackingList[aux] = new Tracking(this.mondays[0], this.sundays[0], i, 0, 0);
      }
      weekTrackingAux.projectTracking.push(oneWeekTracking);
    }
    this.monthTracking.weekOneTracking.push(weekTrackingAux);
    for (let i = 0; i < 3; i++) {
      const weekTracking = new WeekTracking([]);
      for (let j = 0; j < this.numberOfProjects; j++) {
        const oneWeekTracking: ProjectTracking = new ProjectTracking(new Array(
          new Tracking(this.mondays[i + 1], this.sundays[i + 1],
            1, 0, 0),
          new Tracking(this.mondays[i + 1], this.sundays[i + 1],
            2, 0, 0),
          new Tracking(this.mondays[i + 1], this.sundays[i + 1],
            3, 0, 0),
          new Tracking(this.mondays[i + 1], this.sundays[i + 1],
            4, 0, 0),
          new Tracking(this.mondays[i + 1], this.sundays[i + 1],
            5, 0, 0)
        ));
        weekTracking.projectTracking.push(oneWeekTracking);
      }
      switch (i) {
        case 0: this.monthTracking.weekTwoTracking.push(weekTracking); break;
        case 1: this.monthTracking.weekThreeTracking.push(weekTracking); break;
        case 2: this.monthTracking.weekFourTracking.push(weekTracking); break;
      }
    }
  }

  checkMonthLimits() {
    this.monthLowerLimit = this.currentWeek === 1 ? true : false;
    this.monthUpperLimit = this.currentWeek === 4 ? true : false;
  }

  getPreviousValue(event: any) {
    const value = event.target.value.toString();
    const split = value.split(':', 2);
    const hours = split[0];
    const minutes = split[1];
    if ((value.length > 5) || (isNaN(hours) || isNaN(minutes)) || (hours > 23 || minutes > 59) || (hours > 23 && minutes > 59)) {
      return;
    } else {
      this.previousValue = event.target.value;
    }
  }

  onTrackingChanged($event: any, projectIndex: number, trackingIndex: number) {
    this.formatError = false;
    for (let k = 0; k < this.numberOfProjects; k++) {
      for (let i = 0; i < this.numberOfProjects; i++) {
        for (let j = 0; j < 5; j++) {
          const val = this.monthValueErrorMatrix[k].controlValueMatrix[i][j];
          const spl = val.split(':', 2);
          const hour = spl[0];
          const min = spl[1];
          if ((val.length > 5) || (isNaN(hour) || isNaN(min)) || (hour > 23 || min > 59) || (hour > 23 && min > 59)) {
            this.formatError = true;
          }
        }
      }
    }
    if (!this.formatError) {
      const value = $event.target.value.toString();
      const split = value.split(':', 2);
      const hours = split[0];
      const minutes = split[1];
      const previousValue = this.previousValue;
      const previousSplit = previousValue.split(':', 2);
      const previousHours = previousSplit[0];
      const previousMinutes = previousSplit[1];
      this.formatError = false;
      let trackingChanged;
      let hoursForProject;
      let auxDate = new Date(this.mondays[this.currentWeek - 1]);
      auxDate = new Date(auxDate.setDate(auxDate.getDate() + trackingIndex));
      this.hourService.insertTracking(localStorage.getItem('uId'), {
        date: auxDate,
        hours: hours,
        minutes: minutes,
        projectId: this.projects[projectIndex]._id
      }).subscribe((data) => {

      });
      switch (this.currentWeek) {
        case 1:
          trackingChanged = this.monthTracking.weekOneTracking[0].projectTracking[projectIndex].trackingList[trackingIndex];
          hoursForProject = this.monthlyHoursForProjects[0][projectIndex];
          break;
        case 2:
          trackingChanged = this.monthTracking.weekTwoTracking[0].projectTracking[projectIndex].trackingList[trackingIndex];
          hoursForProject = this.monthlyHoursForProjects[1][projectIndex]; break;
        case 3:
          trackingChanged = this.monthTracking.weekThreeTracking[0].projectTracking[projectIndex].trackingList[trackingIndex];
          hoursForProject = this.monthlyHoursForProjects[2][projectIndex];
          break;
        case 4:
          trackingChanged = this.monthTracking.weekFourTracking[0].projectTracking[projectIndex].trackingList[trackingIndex];
          hoursForProject = this.monthlyHoursForProjects[3][projectIndex];
          break;
      }
      if (previousHours > hours || previousMinutes > minutes) {
        if (previousHours > hours) {
          let diff;
          diff = +previousHours - hours;
          hoursForProject.hours -= +diff;
        }
        if (previousMinutes > minutes) {
          let diff;
          diff = +previousMinutes - minutes;
          hoursForProject.minutes -= +diff;
        }
      } else if (previousHours < hours || previousMinutes < minutes) {
        if (previousHours < hours) {
          let diff;
          diff = hours - +previousHours;
          hoursForProject.hours += +diff;
        }
        if (previousMinutes < minutes) {
          let diff;
          diff = minutes - +previousMinutes;
          hoursForProject.minutes += +diff;
        }
      }
      if (hoursForProject.minutes >= 60) {
        hoursForProject.hours += 1;
        hoursForProject.minutes -= 60;
      }
      if (hoursForProject.minutes < 0) {
        hoursForProject.hours -= 1;
        hoursForProject.minutes = 60 + hoursForProject.minutes;
      }
      this.totalHoursForProject();
    }
  }

  totalHoursForProject() {
    let totalHours = 0;
    let totalMinutes = 0;
    this.totalHoursForAllProjects = 0;
    this.totalMinutesForAllProjects = 0;
    let trackingArraySelect: HoursForProject;
    switch (this.currentWeek) {
      case 1: trackingArraySelect = this.monthlyHoursForProjects[0]; break;
      case 2: trackingArraySelect = this.monthlyHoursForProjects[1]; break;
      case 3: trackingArraySelect = this.monthlyHoursForProjects[2]; break;
      case 4: trackingArraySelect = this.monthlyHoursForProjects[3]; break;
    }
    if (trackingArraySelect[this.numberOfProjects] > 40) {
      this.overtime[this.currentWeek - 1] = trackingArraySelect[this.numberOfProjects] - 40;
    } else {
      this.overtime[this.currentWeek - 1] = 0;
    }
    for (let i = 0; i < this.numberOfProjects; i++) {
      totalHours += trackingArraySelect[i].hours;
      totalMinutes += trackingArraySelect[i].minutes;
      if (totalMinutes >= 60) {
        totalHours += 1;
        totalMinutes -= 60;
      }
    }
    trackingArraySelect[this.numberOfProjects] = totalHours;
    trackingArraySelect[this.numberOfProjects + 1] = totalMinutes;
    if (trackingArraySelect[this.numberOfProjects] > 40) {
      this.overtime[this.currentWeek - 1] = trackingArraySelect[this.numberOfProjects] - 40;
      this.overtimeMins[this.currentWeek - 1] = trackingArraySelect[this.numberOfProjects + 1];
    } else {
      this.overtime[this.currentWeek - 1] = 0;
      this.overtimeMins[this.currentWeek - 1] = 0;
    }
    this.totalOvertimeHours = 0;
    this.totalOvertimeMinutes = 0;
    for (let i = 0; i < 4; i++) {
      if (this.overtime[i] > 0) {
        this.totalOvertimeHours += this.overtime[i];
      }
      if (this.overtimeMins[i] > 0) {
        this.totalOvertimeMinutes += this.overtimeMins[i];
        if (this.totalOvertimeMinutes >= 60) {
          this.totalOvertimeHours += 1;
          this.totalOvertimeMinutes = this.totalOvertimeMinutes - 60;
        }
      }
    }
  }

  submitRequest() {
    const body = {
      month: new Date(this.todayDate).getMonth() + 1,
      status: 'pending',
      userId: localStorage.getItem('uId')
    };
    this.hourService.submitRequest(body).subscribe((data: any) => {
      this.snackBar.open('Hours submitted successfully!', 'Okay', { duration: 3000 });
    }, (err) => {
      console.log(err);
      if (err.status === 304) {
        this.snackBar.open('Already submitted for this month!', 'Okay', { duration: 3000 });
      }
    });
  }
}

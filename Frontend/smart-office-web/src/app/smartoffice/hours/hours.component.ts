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

@Component({
  selector: 'so-hours',
  templateUrl: './hours.component.html',
  styleUrls: ['./hours.component.css']
})
export class HoursComponent implements OnInit {
  projects = [{
    name: 'Project 1',
    totalHours: 0,
    totalMinutes: 0
  }, {
    name: 'Project 2',
    totalHours: 0,
    totalMinutes: 0
  }, {
    name: 'Project 3',
    totalHours: 0,
    totalMinutes: 0
  }];

  todayDate: Date = new Date(Date.now());
  today: string = this.todayDate.toDateString();
  mondays: Date[];
  sundays: Date[];
  selectedWeekStart: string;
  selectedWeekEnd: string;
  currentWeek = 1;

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
  numberOfProjects = 0;
  overtimeHours = 0;
  overtimeMinutes = 0;
  totalHoursForAllProjects = 0;
  totalMinutesForAllProjects = 0;

  previousValue: string;
  constructor() { }

  ngOnInit() {
    const currentDay = this.todayDate.getDay();
    if (currentDay === 6 || currentDay === 0) {
      this.trackingDisabled = false;
    }
    this.mondays = this.getMondays(); // get the Mondays of the current month
    this.sundays = this.getNextSundays(); // get the next 4 Sundays of the month
    for (let i = 0; i < 4; i++) { // setting the current week of the moth - 1,2,3,4
      if ((this.mondays[i] <= this.todayDate) && (this.todayDate <= this.sundays[i])) {
        this.currentWeek = i;
      }
    }
    this.selectedWeekStart = this.mondays[0].toDateString();
    this.selectedWeekEnd = this.sundays[0].toDateString();
    this.checkMonthLimits();
    this.numberOfProjects = this.projects.length;
    this.splitMonthInWeeks();
    for (let i = 0; i < 4; i++) {
      const controlValueMatrix: ControlMatrix = new ControlMatrix(this.numberOfProjects, 5);
      this.monthValueErrorMatrix.push(controlValueMatrix);
    }
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
    console.log(this.monthlyHoursForProjects);
  }

  getMondays() {
    const d = new Date(),
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
    let nextSunday = this.getSundayOfWeek(this.todayDate);
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
      const oneWeekTracking: ProjectTracking = new ProjectTracking(new Array(
        new Tracking(this.mondays[0], this.sundays[0],
          1, 0, 0),
        new Tracking(this.mondays[0], this.sundays[0],
          2, 0, 0),
        new Tracking(this.mondays[0], this.sundays[0],
          3, 0, 0),
        new Tracking(this.mondays[0], this.sundays[0],
          4, 0, 0),
        new Tracking(this.mondays[0], this.sundays[0],
          5, 0, 0)
      ));
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
    console.log('Previous value is now: ');
    console.log(this.previousValue);
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
      console.log('Number of hours is: ');
      console.log(hours);
      console.log('Number of minutes is: ');
      console.log(minutes);
      console.log('Previous number of hours is: ');
      console.log(previousHours);
      console.log('Previous number of minutes is: ');
      console.log(previousMinutes);
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
      // console.log('Total hours matrix: ');
      // console.log(this.monthlyHoursForProjects);
      // console.log('The change is: ');
      // console.log(value);
      // console.log('On tracking:');
      // console.log(trackingChanged);

      this.totalHoursForProject(projectIndex);
      //   console.log('--------------------------------------------------------');
      //   console.log('Updated matrix for the month is: ');
      //   console.log(this.monthValueErrorMatrix);
      //   console.log('--------------------------------------------------------');
      //   console.log('Month tracking is: ');
      //   console.log(this.monthTracking);
      //   console.log('--------------------------------------------------------');
    }
  }

  totalHoursForProject(projectIndex: number) {
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
    console.log(trackingArraySelect);
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
  }
}

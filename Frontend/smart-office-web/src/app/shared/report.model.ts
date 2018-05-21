import { Project } from './project.model';

export class Report {
  public Firstname: string;
  public Lastname: string;
  public Month: string;
  public Year: string;
  public TrackingData: any[] = [];
  public Projects: Project[] = [];
  public Hours: number[] = [];
  public Minutes: number[] = [];
  public TotalMinutes = 0;
  public TotalHours = 0;
  public Overtime = 0;
  public id: string;

  constructor() { }
}

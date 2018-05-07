import { WeekTracking } from './week-tracking.model';

export class MonthTracking {
  constructor(public weekOneTracking?: WeekTracking[],
    public weekTwoTracking?: WeekTracking[],
    public weekThreeTracking?: WeekTracking[],
    public weekFourTracking?: WeekTracking[]) { }
}

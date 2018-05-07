export class Project {
    constructor(public hourstotal?: number, public name?: string,
                public description?: string, public estimated?: number,
                public started?: Date, public deadline?: Date,
                public finished?: boolean, public documentationlink?: string,
                public gitlink?: string, public issuetrackinglink?: string,
                public daystodeadline?: number, public _id?: String,
                public assignees?: any[]) {}
}

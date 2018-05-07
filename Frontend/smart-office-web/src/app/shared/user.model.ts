export class User {
  constructor(public username?: string, public password?: string,
    public firstname?: string, public lastname?: string,
    public age?: number, public position?: string,
    public sex?: boolean, public email?: string,
    public token?: string, public createdAt?: Date,
    public address?: string, public cnp?: string,
    public _id?: string, public role?: number,
    public assignees?: User[]) { }
}

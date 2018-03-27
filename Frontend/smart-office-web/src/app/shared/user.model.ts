export class User {
  constructor(public username: string, public password: string,
              public firstname: string, public lastname: string,
              public age: number, public position: string,
              public sex: boolean, public email: string,
              public createdAt: Date, public role: number) { }
}

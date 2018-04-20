import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) { }

  get(link: string, token?: string) {
    return this.http.get(link, { headers : {'x-access-token' : token}});
  }

  post(link: string, token?: string, bodyParams?: {}) {
    return this.http.post(link, bodyParams, { headers: { 'x-access-token' : token }});
  }

  put(link: string, id: string, token: string, bodyParams?: {}) {
    return this.http.put(link + '/ ' + id, bodyParams, { headers: { 'x-access-token' : token }});
  }

  delete(link: string, token: string, bodyparams?: {}, id?: '') {
    return this.http.delete(link + '/' + id, { headers: { 'x-access-token' : token }});
  }
}

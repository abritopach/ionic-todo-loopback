import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Environment } from '../../environments/environment'

/*
  Generated class for the TodoServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class TodoServiceProvider {

  data: any;
  environment: Environment;

  constructor(public http: Http) {
    console.log('Hello TodoServiceProvider Provider');
    this.environment = new Environment("HEROKU");
  }

    addTodo(item: any) {
        // don't have the data yet
        return new Promise(resolve => {


            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.post(this.environment.getURL() + 'api/todos', item)
                .map(res => res.json())
                .subscribe(data => {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    //console.log(data);
                    this.data = data;
                    resolve(this.data);
                },
                    err => {
                    console.log("ERROR -> " + JSON.stringify(err));
                });
        });
    }

  getTodos() {
    // don't have the data yet
    return new Promise(resolve => {


      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get(this.environment.getURL() + 'api/todos')
          .map(res => res.json())
          .subscribe(data => {
            // we've got back the raw data, now generate the core schedule data
            // and save the data for later reference
            //console.log(data);
            this.data = data;
            resolve(this.data);
          },
              err => {
            console.log("ERROR -> " + JSON.stringify(err));
          });
    });
  }

    updateTodo(item: any) {

        // don't have the data yet
        return new Promise(resolve => {

            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.put(this.environment.getURL() + 'api/todos/' + item.id, item)
                .map(res => res.json())
                .subscribe(data => {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    //console.log(data);
                    this.data = data;
                    resolve(this.data);
                },
                    err => {
                    console.log("ERROR -> " + JSON.stringify(err));
                });
        });
    }

    deleteTodo(item: any) {

        // don't have the data yet
        return new Promise(resolve => {

            // We're using Angular HTTP provider to request the data,
            // then on the response, it'll map the JSON data to a parsed JS object.
            // Next, we process the data and resolve the promise with the new data.
            this.http.delete(this.environment.getURL() + 'api/todos/' + item.id)
                .map(res => res.json())
                .subscribe(data => {
                    // we've got back the raw data, now generate the core schedule data
                    // and save the data for later reference
                    //console.log(data);
                    this.data = data;
                    resolve(this.data);
                },
                    err => {
                    console.log("ERROR -> " + JSON.stringify(err));
                });
        });
    }

}

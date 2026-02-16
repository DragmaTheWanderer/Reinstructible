import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { signal } from '@angular/core';

import { ILegoSet, IElement, IFilterOptions, IElementOptions } from '../interfaces/rebrickable';
import updateInterfaces from '../Utilities/updateInterfaces';
@Injectable({
  providedIn: 'root'
})
export default class fileUtil{
  private static http: HttpClient;
  //constructor(http: HttpClient) { // OK: constructor injection
  //  http = http;
  //}
  private static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    observe: 'response' as 'response', // To get the full HttpResponse
  };


  static saveFile(http: HttpClient, fileName: string, jsonString: string) {

    let params = new HttpParams()
      .set('fileName', fileName)
      .set('jsonString', jsonString);

    //send the controller a jsonstring to save
    http.post('/api/file', { params: params }, this.httpOptions).subscribe({
      next: (res) => {
        let result = res;
        //loading = false;
      },
      error: (error) => {
        console.error(error);
        error = 'Failed to create file'; //loading = false;
      }
    });
  }

  static loadFile(http: HttpClient, fileName: string) {
    let params = new HttpParams()
      .set('fileName', fileName);

    http.get<string>('/api/file', { params: params }).subscribe({
      next: (result) => {
        return result;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  static loadLegoSetFile(http: HttpClient, fileName: string, legoSet: Partial<ILegoSet>) {

    let params = new HttpParams()
      .set('fileName', fileName);

    http.get<ILegoSet>('/api/file', { params: params }).subscribe({
      next: (res) => {
        updateInterfaces.updateLegoSet(legoSet, res);
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  static loadElementsFile(http: HttpClient, fileName: string, array: IElement[]) {

    let params = new HttpParams()
      .set('fileName', fileName);

    http.get < IElement[] >('/api/file', { params: params }).subscribe({
      next: (res) => {
        updateInterfaces.updateElementArray(array, res);
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  static loadpartCategoryOptionsFile(http: HttpClient, fileName: string, array: IFilterOptions[]) {

    let params = new HttpParams()
      .set('fileName', fileName);

    http.get<IFilterOptions[]>('/api/file', { params: params }).subscribe({
      next: (res) => {
        updateInterfaces.updateFilterOptionsArray(array, res);
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  static loadNumberFilteredFile(http: HttpClient, fileName: string, array: number[]) {

    let params = new HttpParams()
      .set('fileName', fileName);

    http.get<number[]>('/api/file', { params: params }).subscribe({
      next: (res) => {
        updateInterfaces.updateNumberFilteredArray(array, res);
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  static loadStringFilteredFile(http: HttpClient, fileName: string, array: string[]) {

    let params = new HttpParams()
      .set('fileName', fileName);

    http.get<string[]>('/api/file', { params: params }).subscribe({
      next: (res) => {
        updateInterfaces.updateStringFilteredArray(array, res);
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

  static loadOptionsFile(http: HttpClient, fileName: string, options: IElementOptions) {

    let params = new HttpParams()
      .set('fileName', fileName);

    http.get<IElementOptions>('/api/file', { params: params }).subscribe({
      next: (res) => {
        updateInterfaces.updateOptions(options, res);
      },
      error: (error) => {
        console.error(error);
      }
    });

  }

}

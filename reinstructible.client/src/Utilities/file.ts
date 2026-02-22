import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { signal } from '@angular/core';

import { ILegoSet, IElement, IFilterOptions, IElementOptions } from '../interfaces/rebrickable';
import updateInterfaces from '../Utilities/updateInterfaces';
@Injectable({
  providedIn: 'root'
})
export default class fileUtil {

  static async saveFile(http: HttpClient, fileName: string, jsonString: string): Promise<boolean> {
    const params = {
      'fileName': fileName,
      'jsonString': jsonString
    };

    const response = await fetch('/api/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    let result = true;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      result = false;
    }

    return result;
  }

  static async loadFile(http: HttpClient, fileName: string) {
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

  static async loadLegoSetFile(http: HttpClient, fileName: string, array: Partial<ILegoSet>): Promise<boolean> {
    const param = new URLSearchParams({
      'fileName': fileName
    });
    const URL = '/api/file?' + param.toString()
    const response = await fetch(URL);
    const data: ILegoSet = await response.json()
    let result = true;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      result = false;
    } else {
      updateInterfaces.updateLegoSet(array, data);
    }
    return result;
  }

  static async loadElementsFile(http: HttpClient, fileName: string, array: IElement[]) {
    const param = new URLSearchParams({
      'fileName': fileName
    });
    const URL = '/api/file?' + param.toString()
    const response = await fetch(URL);
    const data: IElement[] = await response.json()
    let result = true;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      result = false;
    } else {
      updateInterfaces.updateElementArray(array, data);
    }
    return result;
  }


  static async loadpartCategoryOptionsFile(http: HttpClient, fileName: string, array: IFilterOptions[]) {
    const param = new URLSearchParams({
      'fileName': fileName
    });
    const URL = '/api/file?' + param.toString()
    const response = await fetch(URL);
    const data: IFilterOptions[] = await response.json()
    let result = true;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      result = false;
    } else {
      updateInterfaces.updateFilterOptionsArray(array, data);
    }
    return result;
  }

  static async loadNumberFilteredFile(http: HttpClient, fileName: string, array: number[]) {
    const param = new URLSearchParams({
      'fileName': fileName
    });
    const URL = '/api/file?' + param.toString()
    const response = await fetch(URL);
    const data: number[] = await response.json()
    let result = true;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      result = false;
    } else {
      updateInterfaces.updateNumberFilteredArray(array, data);
    }
    return result;
  }

  static async loadStringFilteredFile(http: HttpClient, fileName: string, array: string[]) {
    const param = new URLSearchParams({
      'fileName': fileName
    });
    const URL = '/api/file?' + param.toString()
    const response = await fetch(URL);
    const data: string[] = await response.json()
    let result = true;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      result = false;
    } else {
      updateInterfaces.updateStringFilteredArray(array, data);
    }
    return result;
  }

  static async loadOptionsFile(http: HttpClient, fileName: string, array: IElementOptions) {
    const param = new URLSearchParams({
      'fileName': fileName
    });
    const URL = '/api/file?' + param.toString()
    const response = await fetch(URL);
    const data: IElementOptions = await response.json()
    let result = true;
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      result = false;
    } else {
      updateInterfaces.updateOptions(array, data);
    }
    return result;
  }
}

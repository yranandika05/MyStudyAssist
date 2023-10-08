import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor() { }

  setItem(key: string, value: any, isSessionStorage: boolean): void{
    const storage = isSessionStorage ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(value));
  }

  getItem(key:string, isSessionStorage: boolean): any{
    const storage = isSessionStorage ? sessionStorage : localStorage;
    const item = storage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeItem(key:string, isSessionStorage: boolean): void{
    const storage = isSessionStorage ? sessionStorage : localStorage;
    storage.removeItem(key);
  }

  clear(isSessionStorage: boolean): void{
    const storage = isSessionStorage ? sessionStorage : localStorage;
    storage.clear();
  }
}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Item } from '../data/item';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public static SERVER_URL = 'http://localhost:8000/v1';

  private items: Item[] | undefined;
  public username: string | undefined;
  public userId: number = -1;
  private password: string | undefined;


  constructor(private httpClient: HttpClient) { }

  private getOptions() {
    let headers_object = new HttpHeaders();
    headers_object = headers_object.append('Content-Type', 'application/json');
    if(this.username && this.password) headers_object = headers_object.append("Authorization", "Basic " + this.authorizationString);
    return {
      headers: headers_object
    };
  }

  public async login(username: string, password: string): Promise<boolean> {
    this.username = username;
    this.password = password;
    let data: any = undefined;
    try {
      data = await lastValueFrom(this.httpClient.get(DataService.SERVER_URL + '/user/login', this.getOptions()));
    } catch(e) {
      this.username = undefined;
      this.password = undefined;
      return false;
    }
    if(data) this.userId = data.id;
    return true;
  }

  public logout(): void {
    this.username = undefined;
    this.userId = -1;
    this.password = undefined;
    this.items = undefined;
  }

  public async signup(email: string, username: string, password: string): Promise<boolean> {
    let data: any = undefined;
    try {
      data = await lastValueFrom(this.httpClient.post(
        DataService.SERVER_URL + '/user',
        {
          "username": username,
          "email": email,
          "password": password
        },
        this.getOptions()));
    } catch (e) {
      return false;
    }
    if(data) {
      this.username = data.username;
      this.userId = data.id;
      this.password = password;
    }
    return true;
  }

  get isLoggedIn(): boolean {
    return (this.username != undefined && this.password != undefined && this.userId != -1);
  }

  get authorizationString(): string {
    if(this.username && this.password) return btoa(this.username + ":" + this.password);
    return '';
  }

  public async requestItems(): Promise<Item[]> {
    if(!this.isLoggedIn) return [];
    try {
      let data: any = await lastValueFrom(this.httpClient.get(DataService.SERVER_URL + '/user/' + this.userId.toString() + '/items', this.getOptions()));
      this.items = data.map((value: any) => new Item(value));
    }catch(err) {
      return [];
    }
    return this.items as Item[];
  }

  public async getItems(): Promise<Item[]> {
    if(this.items == undefined) {
      return this.requestItems();
    }
    return this.items as Item[];
  }

  public async getItem(itemId: number): Promise<Item | undefined> {
    if(!this.isLoggedIn) return undefined;
    try {
      let data: any = await lastValueFrom(this.httpClient.get(
        DataService.SERVER_URL + '/item/' + itemId.toString(),
        this.getOptions()));
      return new Item(data);   
    }catch(err) {
      return undefined;
    }
  }

  public async addItem(): Promise<void> {
    if(!this.isLoggedIn) return;
    if(this.items == undefined) await this.requestItems();
    try {
      let data: any = await lastValueFrom(this.httpClient.post(
        DataService.SERVER_URL + '/item',
        {},
        this.getOptions()
      ));
      this.items?.push(new Item(data));
    }catch(err) {
      return;
    }
  }

  public async modifyItem(item: Item) : Promise<Item | undefined> {
    if(this.items == undefined) await this.requestItems();
    let index = -1;
    for(let i = 0;i < (this.items as Item[]).length; i++) {
      if((this.items as Item[])[i].id == item.id) {
        index = i;
        break;
      }
    }
    if(index == -1) return undefined;
    try {
      await lastValueFrom(this.httpClient.put(
        DataService.SERVER_URL + '/item/' + item.id.toString(),
        item,
        this.getOptions()
      ));
      let data: any = await this.getItem(item.id);
      let newItem = new Item(data);
      (this.items as Item[])[index] = newItem;
      return newItem;
    }catch(err) {
      return undefined;
    }
  }

}

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private static instance: UserService;

  private id!: number;
  private name!: string;
  private email!: string;
  private location!: [number, number];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.id = 1;
    this.name = 'Usuario Mock';
    this.email = 'usuario@example.com';
    this.location = [40.7128, -74.0060]; // Nueva York como ejemplo
  }

  public getId(): number {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getLocation(): [number, number] {
    return this.location;
  }

  public setId(id: number): void {
    this.id = id;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public setLocation(location: [number, number]): void {
    this.location = location;
  }

  public isLoggedIn(): boolean {
    return !!this.id && !!this.name && !!this.email;
  }


}


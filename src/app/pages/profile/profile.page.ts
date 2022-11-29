import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  logInUsername: string | undefined;
  logInPassword: string | undefined;


  signUp: boolean = false;
  signUpEmail: string | undefined;
  signUpUsername: string | undefined;
  signUpPassword: string | undefined;

  error: string | undefined;


  constructor(private dataService: DataService) { }

  ngOnInit() {
  }

  async onLogIn(): Promise<void> {
    this.error = undefined;
    let result = await this.dataService.login(this.logInUsername ? this.logInUsername : '', this.logInPassword ? this.logInPassword : '');
    if(!result) this.error = 'Log In Error';
  }

  onLogOut(): void {
    this.dataService.logout();
  }

  async onSignUp(): Promise<void> {
    this.error = undefined;
    let result = await this.dataService.signup(this.signUpEmail as string, this.signUpUsername as string, this.signUpPassword as string);
    if(!result) this.error = 'Sign Up Error';
    else this.signUp = false;
  }

  onChangeToSignUp(): void {
    this.error = undefined;
    this.signUp = true;
  }

  onChangeToLogIn(): void {
    this.error = undefined;
    this.signUp = false;
  }

  get isLoggedIn(): boolean {
    return this.dataService.isLoggedIn;
  }

  get username(): string | undefined {
    return this.dataService.username;
  }
}

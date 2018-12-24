import { ProfileService } from './../profile.service';
import { ConnectionService } from './../connection.service';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { AuthData } from '../models/auth-data.model';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';

@Injectable()
export class AppAuthService {

  private authStatusListener = new Subject<boolean>();
  private authDataListener = new Subject<AuthData>();


  private authData: AuthData = null
  private token = null;
  private tokenTimer: any;

  constructor(
    private connService: ConnectionService,
    private profService: ProfileService,
    private http: HttpClient,
    private router: Router
  ) {}

  serverAddress = this.connService.getServerAddress();

  getToken() {
    return this.token;
  }

  getAuthData() {
    return this.authData;
  }

  getAuthStatusListener() {
    return this.authStatusListener;
  }

  getAuthDataListener() {
    return this.authDataListener;
  }

  addUser(username: string, password: string, fb: boolean = false) {
    let request = {
      username: username,
      password: password,
      email: '',
      fbToken: null
    }
    if (username.includes('@')) {
      request.email = username;
    }

    if (fb) {
      request.fbToken = password;
    }

    this.http.post(this.serverAddress + 'api/users/add/', request)
    .subscribe((response: any) => {
      this.performLogin(response.token, response.expireLength);
      this.profService.addEmptyProfile(this.authData).subscribe((response: any) => {
        // What to do when profile is created
        this.router.navigate(['/profile-edit', {empty: true}]);
      });
    }, (error) => {
      if (error.error.code === 'MAIL_EXISTS') {
        this.login(username, password, fb);
      }
    });
  }

  login(username: string, password: string, fb: boolean = false) {
    let queryArgs = '?';

    if  (username.includes('@')) {
      let emailStr = username.replace('@', '%40');
      queryArgs += `email=${emailStr}`;
    } else {
      queryArgs += `username=${username}`;
    }

    queryArgs += `&password=${password}`;

    if (fb) {
      queryArgs += `&fbToken=${password}`;
    }

    this.http.get(this.serverAddress + 'api/users/' + queryArgs)
    .subscribe((response: any) => {
      if (!response.token) {
        this.authData = null;
      } else {
        // Saving auth data in local storage
        this.performLogin(response.token, response.expireLength);

      }
    }, (error) => {
      this.authStatusListener.next(false);
    }
    );

  }

  performLogin(token: string, expiresIn: number) {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + expiresIn * 1000);
    this.saveAuthData(token, expirationDate);
    this.setAuthTimer(expiresIn);

    this.token = token;
    const decodedToken = this.decodeToken(token);
    this.authData = {
      username: decodedToken.username,
      email: decodedToken.email,
      id: decodedToken.id
    }
    this.authStatusListener.next(true);
    this.authDataListener.next(this.authData)
  }


  decodeToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (err) {
      return null;
    }
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('earresistible-token', token);
    localStorage.setItem('earresistible-expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('earresistible-token');
    localStorage.removeItem('earresistible-expiration');
  }

  private getStoredAuthData() {
    const token = localStorage.getItem('earresistible-token');
    const expirationDate = localStorage.getItem('earresistible-expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  autoAuthUser() {
    const storedAuthInfo = this.getStoredAuthData();
    if (!storedAuthInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = storedAuthInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.performLogin(storedAuthInfo.token, expiresIn / 1000);
    }
  }


  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.authData = null;
    this.token = null;
    this.authStatusListener.next(false);
    this.authDataListener.next(null);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }


}

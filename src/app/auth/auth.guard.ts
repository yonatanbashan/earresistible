import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppAuthService } from './app-auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private appAuthService: AppAuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    let isAuth = false;
    const token = this.appAuthService.getToken();

    if (!token) {
      this.router.navigate(['/']);
    } else {
      isAuth = true;
    }

    return isAuth;
  }
}

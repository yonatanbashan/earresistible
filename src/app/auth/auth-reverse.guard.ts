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
export class AuthReverseGuard implements CanActivate {
  constructor(
    private appAuthService: AppAuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    let isNotAuth = false;
    const token = this.appAuthService.getToken();

    if (token) {
      this.router.navigate(['/']);
    } else {
      isNotAuth = true;
    }

    return isNotAuth;
  }
}

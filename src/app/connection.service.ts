import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

@Injectable()
export class ConnectionService {

  getServerAddress() {
    return environment.apiUrl;
  }

}

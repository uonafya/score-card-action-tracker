import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {BASEURL, APIURL, VERSIONEDAPIURL} from '../../url';
/**
 * Created by kelvin on 9/19/16.
 */
@Injectable()
export class Constants {
  root_dir: string = null;
  root_api: string = VERSIONEDAPIURL;

  constructor(private http: HttpClient) {
    this.root_dir =BASEURL;
    this.loadVersion().subscribe((system_info: any) => {
      if (system_info.version >= 2.25) {
        this.root_api = VERSIONEDAPIURL;
      } else {
        this.root_api = APIURL;
      }
    });

  }

  load() {
    return this.http.get('manifest.webapp');
  }

  // load system version
  loadVersion() {
    return this.http.get(APIURL + 'system/info.json');
  }

}

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { APIURL, DATASTORE } from '../url';
import swal from 'sweetalert2';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  })
};


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})
export class TimelineComponent implements OnInit {

  scorecard_id: string = '';
  orgunit_id: string = '';
  sub: any = '';

  scorecard: any = {};
  scorecard_name: string = '';
  org_unit: string = '';

  reviews: Array<any> = [];
  users: Array<any> = [];



  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.orgunit_id = params['orgunitid'];
      this.scorecard_id = params['scorecardid'];

      this.getOrgUnit();
      this.getScoreCardName();
      this.getReviews();
      this.getUsers();
    });
  }

  getOrgUnit() {
    const url = `${APIURL}organisationUnits/${this.orgunit_id}/.json?fields=displayName`;
    this.http.get(url).subscribe(data => {
      this.org_unit = data['displayName'];
    });
  }

  getScoreCardName() {
    const url = `${APIURL}dataStore/scorecards/${this.scorecard_id}`;
    this.http.get(url).subscribe(data => {
      this.scorecard_name = data['header']['title'];
    });
  }

  getReviews() {
    const url = `${DATASTORE}${this.scorecard_id}`;
    this.http.get(url).subscribe(data => {
      const rs = data['reviews'].filter(r => r.orgUnitId === this.orgunit_id);

      this.reviews = rs.filter(r => r['review']['indicators'].filter(i => i.reporter !== undefined).length > 0);
      console.log(this.reviews);
    });
  }

  getUsers() {
    const url = `${APIURL}users.json?paging=false&fields=id,displayName,email`;
    this.http.get(url).subscribe(data => {
      this.users = data['users'];
    });
  }

  getUser(id) {
    const user = this.users.find(u => u.id === id);
    let email: string = '';
    user.email === undefined ? email = '' : email = `(${user.email})`;
    return `${user.displayName} ${email}`;
  }
  backToScoreCard() {
    const url = `/view/${this.scorecard_id}/`;
    this.router.navigate([url]);
  }

  getDateFromReviewID(review_id) {
    const id = parseInt(review_id.slice(7));
    return this.getDate(id);
  }
  getDateFromString(date_string) {
    const epoch = new Date(date_string).getTime();
    return this.getDate(epoch);
  }

  getDate(epoch) {
    const date = new Date(epoch);
    const yr = date.getFullYear();
    const month = this.preAppendZero(date.getMonth() + 1);
    const day = this.preAppendZero(date.getDate());
    const hr = this.preAppendZero(date.getHours());
    const min = this.preAppendZero(date.getMinutes());
    const sec = this.preAppendZero(date.getSeconds());

    return `${day}/${month}/${yr} ${hr}:${min}:${sec}`;
  }

  getStatus(indicator) {
    if (indicator.done === true) {
      const marker = this.getUser(indicator.marker_as_done);
      const day = this.getDate(indicator.marked_as_done_time);
      return {
        class: 'text-success',
        text: `Marked as Done by ${marker} on ${day}`
      };
    } else {
      return {
        class: 'text-danger',
        text: 'Pending'
      };

    }
  }

  preAppendZero(i) {
    if (i < 10) {
      return `0${i}`;
    } else {
      return i;
    }
  }

}

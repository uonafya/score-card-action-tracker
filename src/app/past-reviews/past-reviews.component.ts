import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { APIURL, DATASTORE } from '../url';
import swal from 'sweetalert2';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q=',
    'Cache-Control': 'no-cache'
  })
};

@Component({
  selector: 'app-past-reviews',
  templateUrl: './past-reviews.component.html',
  styleUrls: ['./past-reviews.component.css']
})
export class PastReviewsComponent implements OnInit {
  reviews: Array<any> = [];
  orgunit_id: string = '';
  scorecard_id: string = '';
  sub: any = '';
  users: any = '';
  active_review: any = {};
  indicators: Array<any> = [];
  my_id: string = '';
  scorecard_data: any = {};

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.orgunit_id = params['orgunitid'];
      this.scorecard_id = params['scorecardid'];
      this.getReviews();
      this.getUsers();
      this.getMe();
    });
  }

  getReviews() {
    const url = DATASTORE + this.scorecard_id;
    this.http.get(url).subscribe(data => {
      this.scorecard_data = data;
      let reviews = data['reviews'];
      reviews = reviews.filter(r => r.orgUnitId === this.orgunit_id);
      const legit_reviews = [];

      // clean out the reviews whose indicators are blank
      for (const r of reviews) {
        const indicators = r.review.indicators;
        const legit_indicators = indicators.filter(i => i.assignee !== undefined);
        if (legit_indicators.length > 0) {
          legit_reviews.push(r);
        }
      }

      this.reviews = legit_reviews;
      console.log('this.reviews : ', this.reviews);
      this.setActiveReview(this.reviews[0]);
    });
  }

  getUsers() {
    const url = APIURL + 'users.json?fields=id,displayName,email&paging=false';
    this.http.get(url).subscribe(data => {
      this.users = data['users'];
    });
  }

  getMe() {
    const url = APIURL + 'me.json';
    this.http.get(url).subscribe(data => {
      this.my_id = data['id'];
    });
  }

  getDate(review_id) {
    const id = parseInt(review_id.slice(7));
    const date = new Date(id);
    const yr = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hr = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();

    return `${day}/${month}/${yr} ${hr}:${min}:${sec}`;
  }

  getUser(id) {
    const user = this.users.find(u => u.id === id);
    let email: string = '';
    user.email !== undefined ? email = `(${user.email})` : email = '';
    return `${email} ${user.displayName}`;
  }

  setActiveReview(review) {
    this.active_review = review;
    this.indicators = review.review.indicators.filter(i => i.assignee !== undefined);
  }

  backToScoreCard() {
    const url = `/view/${this.scorecard_id}/`;
    this.router.navigate([url]);
  }

  tableClass(indicator) {
    let c = 'table ';
    indicator.done === true ? c += 'table-success' : c += 'table-warning';
    return c;
  }

  indicatorDone(indicator) {
    let comment = '';
    indicator.done === true ? comment = 'Done' : comment = 'Pending';
  }

  doneDetails(indicator) {
    if (indicator.done) {
      const marker = this.users.find(u => u.id === indicator.marker_as_done).displayName;
      const date = new Date(indicator.marked_as_done_time);
      const yr = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return `>>[Marked Complete by ${marker} on ${day}/${month}/${yr}]`;
    } else {
      return '';
    }
  }

  compareDateDue(indicator) {
    if (indicator.done) {
      return 'Done';
    }
    const date_due = new Date(indicator.date_due).getTime();
    const now = new Date().getTime();
    const difference = date_due - now;

    if (difference > 0) {
      const days = Math.floor(difference / 86400000);
      return `${days} Days To Due Date`;
    } else {
      return 'Behind Time - Due Date Already Passed';
    }

  }

  markAsDone(indicator) {
    const review_index = this.scorecard_data.reviews.indexOf(this.active_review);
    const review = this.active_review.review;

    const indicators = review.indicators;
    const index = indicators.indexOf(indicator);
    indicator['done'] = true;
    indicator['marker_as_done'] = this.my_id;
    indicator['marked_as_done_time'] = new Date().getTime();

    indicators[index] = indicator;
    this.scorecard_data.reviews[review_index].review.indicators = indicators;
    console.log(this.scorecard_data);

    this.http.put(DATASTORE + this.scorecard_id + '/', this.scorecard_data).subscribe(data => {
      swal('Success!', `You have marked ${indicator.name}'s task as complete`, 'success');
    });

  }
}

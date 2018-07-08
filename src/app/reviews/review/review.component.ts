import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { HttpClient, HttpHeaders } from '@angular/common/http';
import { APIURL, DATASTORE } from '../../url';
import swal from 'sweetalert2';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Authorization': 'Basic YWRtaW46ZGlzdHJpY3Q=',
    'Cache-Control': 'no-cache'
  })
};

// test facility : cDw53Ej8rju

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  orgunit_id: string = '';
  scorecard_id: string = '';
  private sub: any = {};

  orgunit: any = {};
  scorecard: any = [];
  action_tracker: any = {};
  users: any = [];
  me: any = false;
  current_date: any = '';
  indicators: any = [];
  current_review_active: string = '';
  current_review: any = false;


  months: Array<string> = ['Monthly_Review_01_Jan', 'Monthly_Review_02_Feb', 'Monthly_Review_03_Mar', 'Monthly_Review_04_Apr', 'Monthly_Review_05_May', 'Monthly_Review_06_Jun', 'Monthly_Review_07_Jul', 'Monthly_Review_08_Aug', 'Monthly_Review_09_Sep', 'Monthly_Review_10_Oct', 'Monthly_Review_11_Nov', 'Monthly_Review_12_Dec'];
  date: any = new Date();
  year: any = this.date.getFullYear();

  month: any = this.date.getMonth();
  quater: any = 0;
  show: any = 0;


  annual: string = `${this.year}_Annual_Review`;
  bi_annual: string = '';
  quaterly: string = '';
  monthly: string = `${this.year}_${this.months[this.month]}`;

  periods: any = [];
  all_periods: any = [];

  form_data_period: any = '';
  form_data_assignee: any = [];
  form_data_date_due: any = [];
  form_data_comment: any = [];

  form_data: object = {
    period: '',
    reporter: '',
    assignee: '',
    date_due: '',
    date_reported: '',
    comment: ''
  };

  form_submitted: boolean = false;



  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.orgunit_id = params['orgunitid'];
      this.scorecard_id = params['scorecardid'];

    });

    if (this.month < 3) {
      this.quaterly = `${this.year}_Quoater_01_Jan-Mar`;
      this.bi_annual = `${this.year}_BiAnnual_01`;
    } else if (this.month >= 3 && this.month < 6) {
      this.quaterly = `${this.year}_Quater_02_Apr-Jun`;
      this.bi_annual = `${this.year}_BiAnnual_01`;
    } else if (this.month >= 6 && this.month < 9) {
      this.quaterly = `${this.year}_Quater_03_Jul-Sep`;
      this.bi_annual = `${this.year}_BiAnnual_02`;
    } else {
      this.quaterly = `${this.year}_Quater_04_Oct-Dec`;
      this.bi_annual = `${this.year}_BiAnnual_02`;
    }

    this.all_periods = [
      this.monthly,
      this.quaterly,
      this.bi_annual,
      this.annual
    ];

    // fetch the scorecard and org unit
    this.http.get(`${APIURL}organisationUnits/${this.orgunit_id}.json?fields=id,name`).subscribe(
      data => {
        this.orgunit = data;
        this.show += 1;
      }
    );

    this.http.get(`${DATASTORE}${this.scorecard_id}/`).subscribe(
      data => {
        this.action_tracker = data;
        this.scorecard = data[this.orgunit_id];
        this.indicators = this.scorecard.current_items;
        const reviews = this.scorecard.reviews;
        const review_names = reviews.map(review => review.name);
        this.periods = this.all_periods.filter(obj => review_names.indexOf(obj) === -1);
        this.show += 1;
      }
    );

    this.http.get(`${APIURL}users.json?paging=false&fields=id,name,email`).subscribe(
      data => {
        this.users = data['users'];
        this.show += 1;
      }
    );

    this.http.get(`${APIURL}me.json?fields=id,name,email`).subscribe(
      data => {
        this.me = data;
        this.show += 1;
      }
    );

    this.current_date = `${this.addZero(this.month + 1)}/${this.addZero(this.date.getDate())}/${this.year}`;


  }
  // end of ngInit


  onSubmit() {
    this.form_submitted = true;
    let review_content = [];
    let review = {
      name: this.form_data_period,
      date: this.date.getTime(),
      reporter: this.me.id,
    };

    for (let i in this.indicators) {
      if (this.indicators[i] !== null) {
        review_content.push({
          indicator: this.indicators[i],
          assignee: this.form_data_assignee[i],
          date_due: this.form_data_date_due[i],
          comment: this.form_data_comment[i],
          done: false
        });
      }
    }

    review['indicators'] = review_content;

    this.scorecard.reviews.push(review);
    this.action_tracker[this.orgunit_id] = this.scorecard;
    const url = `${DATASTORE}${this.scorecard_id}/`;
    this.http.put(url, this.action_tracker).subscribe(
      data => {
        const button = document.getElementById('close');
        button.click();
        this.form_data_period = '';
        this.form_data_assignee = [];
        this.form_data_date_due = [];
        this.form_data_comment = [];
        swal({
          type: 'success',
          title: 'Yes!',
          text: 'Review was saved successfully!',
          timer: 3000,
          showCloseButton: true,
          showConfirmButton: false
        });
      }, error => {
        swal({
          type: 'warning',
          title: 'Oops!',
          text: 'We could not save your review!',
          timer: 3000,
          showCloseButton: true,
          showConfirmButton: false
        });
      }
    )

  }

  addZero(month) {
    if (month < 10) {
      return `0${month}`;
    } else {
      return month;
    }
  }

  setCurrentReview(review) {
    this.current_review = review;
    this.current_review_active = this.current_review.name;
  }

  printName(user) {
    if (user !== undefined) {
      if (user.hasOwnProperty('email')) {
        return `${user.name} <${user.email}>`;
      } else {
        return user.name;
      }
    } else {
      return '';
    }

  }

  printDate(epoch) {
    const date = new Date(epoch);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = date.getDate();

    return `${day}/${month}/${year}`;
  }
  getUser(userid) {
    return this.printName(
      this.users.find(u => u.id === userid)
    );
  }

  backToScoreCard() {
    this.router.navigateByUrl(`/view/${this.scorecard_id}`);
  }
}


//  functions

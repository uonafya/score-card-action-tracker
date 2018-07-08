import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ScoreCard } from '../../../shared/models/scorecard';
import { ScorecardService } from '../../../shared/services/scorecard.service';
import * as _ from 'lodash';
import { ContextMenuComponent, ContextMenuService } from 'ngx-contextmenu';
import { listStateTrigger } from '../../../shared/animations/basic-animations';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { APIURL, DATASTORE } from '../../../url';
import swal from 'sweetalert2';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  })
};

@Component({
  selector: 'app-basic-view',
  templateUrl: './basic-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./basic-view.component.css'],
  animations: [listStateTrigger]
})
export class BasicViewComponent implements OnInit {

  @Input() scorecard: ScoreCard;
  @Input() sorting_column: string = 'none';
  @Input() sortAscending: boolean = true;
  @Input() current_sorting: boolean = true;
  @Input() orgunits: any = [];
  @Input() periods_list: any = [];
  @Input() hidenColums: any = [];
  @Input() indicator_holders_list: any = [];
  @Input() indicator_done_loading: any;
  @Input() indicator_loading: any;
  @Input() old_proccessed_percent: any;
  @Input() has_error: any;
  @Input() error_text: any;
  @Input() sorting_period: any;
  @Input() showSubScorecard: any;
  @Input() children_available: any;
  @Input() subscorecard: any;
  @Input() sub_model: any;
  @Input() selectedPeriod: any;
  @Input() functions: any;
  @Input() organisation_unit_nodes = null;

  @Output() onSortScoreCardFromColumn = new EventEmitter();
  @Output() onDragItemSuccessfull = new EventEmitter();
  @Output() onLoadChildrenData = new EventEmitter();
  @Output() onSortBestWorst = new EventEmitter();
  @Output() onLoadPreview = new EventEmitter();
  @Output() onLoadPreviewFromChild = new EventEmitter();
  @Output() onHideClicked = new EventEmitter();

  show_sum_in_row: boolean = false;
  show_sum_in_column: boolean = false;
  searchQuery: string = '';
  has_bottleneck: boolean[] = [];

  @ViewChild('indicatorMenu') public indicatorMenu: ContextMenuComponent;
  @ViewChild('itemMenu') public itemMenu: ContextMenuComponent;
  constructor(
    private scorecardService: ScorecardService,
    private contextMenuService: ContextMenuService,
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {

  }



  // context menu options
  public onContextMenu($event: MouseEvent, item: any): void {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.indicatorMenu,
      event: $event,
      'item': item,
    });
  }

  // context menu options
  public onItemContextMenu($event: MouseEvent, item: any, ou: any, pe: any): void {
    this.contextMenuService.show.next({
      // Optional - if unspecified, all context menu components will open
      contextMenu: this.itemMenu,
      event: $event,
      'item': { 'item': item, 'ou': ou, 'pe': pe },
    });
  }


  sortScoreCardFromColumn(sortingColumn, sortAscending, orguUnits, period: string, lower_level: boolean = true) {
    this.onSortScoreCardFromColumn.emit({ sortingColumn, sortAscending, orguUnits, period, lower_level });
  }

  sortBestWorst(type: any, sortingColumn, sortAscending, orguUnits, period: string, lower_level: boolean = true) {
    this.onSortBestWorst.emit({ type, sortingColumn, sortAscending, orguUnits, period, lower_level });
  }

  getGroupColspan(indicator_holder_group) {
    return this.scorecardService.getGroupColspan(
      indicator_holder_group,
      this.scorecard.data.data_settings.indicator_holders,
      this.periods_list,
      this.hidenColums);
  }

  getSubscorecardColspan() {
    return this.scorecardService.getSubscorecardColspan(this.scorecard, this.periods_list, this.hidenColums);
  }

  // simplify title displaying by switching between two or on indicator
  getIndicatorTitle(holder): string {
    return this.scorecardService.getIndicatorTitle(holder, this.hidenColums);
  }

  loadPreview(holderGroup, indicator, ou, period, periods = null, bottleneck = false) {
    this.onLoadPreview.emit({ holderGroup, indicator, ou, period, periods, bottleneck });
  }

  loadPreviewFromChild(event) {
    this.onLoadPreviewFromChild.emit(event);
  }

  dragItemSuccessfull($event, drop_area: string, object: any) {
    this.onDragItemSuccessfull.emit({ $event, drop_area, object });
  }

  getIndicatorLabel(indicator, label) {
    this.scorecardService.getIndicatorLabel(indicator, label, this.hidenColums);
  }

  findRowAverage(orgunit_id, periods_list, period) {
    return this.scorecardService.findRowAverage(orgunit_id, periods_list, period, this.scorecard.data.data_settings.indicator_holders, this.hidenColums);
  }

  findRowTotalAverage(orgunits, period) {
    return this.scorecardService.findRowTotalAverage(orgunits, period, this.scorecard.data.data_settings.indicator_holders, this.hidenColums);
  }

  findRowTotalSum(orgunits, period) {
    return this.scorecardService.findRowTotalSum(orgunits, period, this.scorecard.data.data_settings.indicator_holders, this.hidenColums);
  }

  loadChildrenData(selectedorgunit, indicator) {
    this.onLoadChildrenData.emit({ selectedorgunit, indicator });
  }

  openReviewForOrgUnit(selectedOrgUnit, indicator) {
    // create a action tracker if not available

    let indicators = [];

    for (let i of this.indicator_holders_list) {
      const indicator_obj = i.indicators[0];
      const legendset = indicator_obj.legendset;
      const min = legendset[legendset.length - 1].max;
      const scores = indicator_obj.values;
      let score = 0;

      const swal_options = {
        icon: 'success',
        title: 'Oops...',
        timer: 2000,
        text: 'We could not access the action Tracker',
        buttons: false
      };

      for (let key in indicator_obj.values) {
        if (indicator_obj.values.hasOwnProperty(key)) {
          const key_name = key.split('.')[0];
          if (key_name === selectedOrgUnit.id) {
            score = scores[key];
          }
        }

      }

      if (score != null && score <= min && score > 0) {
        indicators.push({
          id: indicator_obj.id,
          name: indicator_obj.name,
          score,
          min
        });
      }


    }

    // try getting the action tracker
    this.http.get(`${DATASTORE}${this.scorecard.id}/`).subscribe(
      data => {
        // The action tracker exists, therefore update it with current indicators
        if (data.hasOwnProperty(selectedOrgUnit.id) === true) {
          data[selectedOrgUnit.id]['current_items'] = indicators;
        } else {
          data[selectedOrgUnit.id] = {
            current_items: indicators,
            reviews: []
          };
        }

        this.http.put(`${DATASTORE}${this.scorecard.id}`, data).subscribe(
          () => {
            this.router.navigateByUrl(
              `/review/${this.scorecard.id}/${selectedOrgUnit.id}`
            );
          }, error => {
            swal({
              type: 'success',
              title: 'Oops...',
              timer: 2000,
              text: 'We could not access the action Tracker',
              showCloseButton: false,
              showCancelButton: false
            });
          }
        )
      }, error => {
        // the action tracker does not exist, therefore create it
        const new_action_tracker = {};

        new_action_tracker[selectedOrgUnit.id] = {
          current_items: indicators,
          reviews: []
        };
        this.http.post(`${DATASTORE}${this.scorecard.id}`, new_action_tracker).subscribe(
          data => {
            this.router.navigateByUrl(
              `/review/${this.scorecard.id}/${selectedOrgUnit.id}`
            );
          }, () => {
            swal({
              type: 'success',
              title: 'Oops...',
              timer: 2000,
              text: 'We could not access the action Tracker',
              showCloseButton: false,
              showCancelButton: false
            });
          }
        );
      }
    )



    /*
    console.log(new_action_tracker);
    this.router.navigateByUrl(
      `/review/${this.scorecard.id}/${selectedOrgUnit.id}`
    ); */
  }



  createData(data, selectedOrgUnit, indicators) {
    let orgUnits = data['orgUnits'];
    let orgUnitId = selectedOrgUnit.id;
    let now: any = (new Date).getTime();
    let review_id: string = 'review_' + now.toString();

    if (orgUnits.find(k => k === orgUnitId) === undefined)
      data['orgUnits'].push(orgUnitId);

    data['reviews'].push({
      orgUnitId: orgUnitId,
      review: {
        id: review_id,
        indicators
      }
    });
    return { data, orgUnitId, review_id };
  }

  saveData(data) {
    let url = DATASTORE + this.scorecard.id + '/';
    console.log(url);
    return this.http.put(url, data);
  }


  // Fetch info of tracker
  fetchActionTracker() {
    let scorecard_key: string = this.scorecard.id;
    let url: string = DATASTORE + scorecard_key;

    return this.http.get(url);
  }

  // Create a tracker (key=id of scorecard)
  createActionTracker() {
    let key: string = this.scorecard.id;
    let url: string = DATASTORE + key;
    let data = {
      orgUnits: [],
      reviews: []
    };
    return this.http.post(url, data);

  }

  // saveData for a org unit




  // prepare a proper tooltip to display to counter multiple indicators in the same td
  prepareTooltip(holder, orgunit, period): string {
    const tooltip = [];
    const use_key = orgunit + '.' + period;
    for (const indicator of holder.indicators) {
      if (indicator.tooltip && indicator.tooltip[use_key]) {
        tooltip.push(indicator.tooltip[use_key]);
      }
    }
    return tooltip.join(', ');
  }

  // get number of visible indicators from a holder
  getVisibleIndicators(holder) {
    return _.filter(holder.indicators, (indicator: any) => !_.includes(this.hidenColums, indicator.id));
  }

  // check if a column is empty
  isRowEmpty(orgunit_id: string): boolean {
    let checker = false;
    let sum = 0;
    let counter = 0;
    for (const holder of this.scorecard.data.data_settings.indicator_holders) {
      for (const indicator of holder.indicators) {
        for (const current_period of this.periods_list) {
          if (this.hidenColums.indexOf(indicator.id) === -1) {
            sum++;
          }
          if (indicator && indicator.values) {
            if (this.hidenColums.indexOf(indicator.id) === -1 && indicator.values[orgunit_id + '.' + current_period.id] === null) {
              counter++;
            }
          }
        }


      }
    }
    if (counter === sum && !this.scorecard.data.empty_rows) {
      checker = true;
    }
    return checker;
  }


  averageHidden(orgunit_id: string, period: string): boolean {
    let checker = false;
    const avg = this.scorecardService.findRowTotalAverage(this.orgunits, period, this.scorecard.data.data_settings.indicator_holders, this.hidenColums);
    if (this.scorecard.data.average_selection === 'all') {
      checker = false;
    } else if (this.scorecard.data.average_selection === 'below') {
      if (this.scorecardService.findRowAverage(orgunit_id, this.periods_list, null, this.scorecard.data.data_settings.indicator_holders, this.hidenColums) >= avg) {
        checker = true;
      }
    } else if (this.scorecard.data.average_selection === 'above') {
      if (this.scorecardService.findRowAverage(orgunit_id, this.periods_list, null, this.scorecard.data.data_settings.indicator_holders, this.hidenColums) <= avg) {
        checker = true;
      }
    }
    return checker;
  }

  mouseEnter(indicator) {
    if (indicator.indicators[0].bottleneck_indicators.length !== 0) {
      this.has_bottleneck[indicator.indicators[0].id] = true;
    }
  }

  mouseLeave(indicator) {
    this.has_bottleneck[indicator.indicators[0].id] = false;
  }

  hideClicked(item, type = null) {
    this.onHideClicked.emit({ item, type });
  }
}

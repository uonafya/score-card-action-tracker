import {BASEURL, APIURL} from '../../../url'

export const PREDEFINED_MENU_ITEMS = [
  {
    name: 'Data element',
    namespace: 'data-element',
    defaultAction: BASEURL + '/dhis-web-maintenance/#/list/dataElementSection',
    displayName: 'Data element',
    icon: BASEURL + '/icons/dhis-web-maintenance.png',
    description: '',
    onlyShowOnSearch: true
  },
  {
    name: 'Data element group',
    namespace: 'data-element-group',
    defaultAction: BASEURL + '/dhis-web-maintenance/#/list/dataElementSection/dataElementGroup',
    displayName: 'Data element group',
    icon: BASEURL + '/icons/dhis-web-maintenance.png',
    description: '',
    onlyShowOnSearch: true
  },
  {
    name: 'Data element group set',
    namespace: 'data-element-group-set',
    defaultAction: BASEURL + '/dhis-web-maintenance/#/list/dataElementSection/dataElementGroupSet',
    displayName: 'Data element group set',
    icon: BASEURL + '/icons/dhis-web-maintenance.png',
    description: '',
    onlyShowOnSearch: true
  },
  {
    name: 'Indicator',
    namespace: 'indicator',
    defaultAction: BASEURL + '/dhis-web-maintenance/#/list/indicatorSection/indicator',
    displayName: 'Indicator',
    icon: BASEURL + '/icons/dhis-web-maintenance.png',
    description: '',
    onlyShowOnSearch: true
  },
  {
    name: 'Indicator type',
    namespace: 'indicator-type',
    defaultAction: BASEURL + '/dhis-web-maintenance/#/list/indicatorSection/indicatorType',
    displayName: 'Indicator type',
    icon: BASEURL + '/icons/dhis-web-maintenance.png',
    description: '',
    onlyShowOnSearch: true
  },
  {
    name: 'Indicator group',
    namespace: 'indicator-type',
    defaultAction: BASEURL + '/dhis-web-maintenance/#/list/indicatorSection/indicatorGroup',
    displayName: 'Indicator group',
    icon: BASEURL + '/icons/dhis-web-maintenance.png',
    description: '',
    onlyShowOnSearch: true
  },
  {
    name: 'Settings',
    displayName: 'Settings',
    namespace: '/dhis-web-user-profile',
    defaultAction: BASEURL + '/dhis-web-user-profile/#/settings',
    icon: BASEURL + '/icons/usersettings.png',
    description: '',
    onlyShowOnSearch: true
  }, {
    name: 'Profile',
    displayName: 'Profile',
    namespace: '/dhis-web-user-profile',
    defaultAction: BASEURL + '/dhis-web-user-profile/#/profile',
    icon: BASEURL + '/icons/function-profile.png',
    description: '',
    onlyShowOnSearch: true
  }, {
    name: 'Account',
    displayName: 'Account',
    namespace: '/dhis-web-user-profile',
    defaultAction: BASEURL + '/dhis-web-user-profile/#/account',
    icon: BASEURL + '/icons/function-account.png',
    description: '',
    onlyShowOnSearch: true
  }, {
    name: 'Help',
    displayName: 'Help',
    namespace: '/dhis-web-commons-about',
    defaultAction: 'https://dhis2.github.io/dhis2-docs/master/en/user/html/dhis2_user_manual_en.html',
    icon: BASEURL + '/icons/function-account.png',
    description: '',
    onlyShowOnSearch: true
  }, {
    name: 'About DHIS2',
    displayName: 'About DHIS2',
    namespace: '/dhis-web-commons-about',
    defaultAction: BASEURL + '/dhis-web-commons-about/about.action',
    icon: BASEURL + '/icons/function-about-dhis2.png',
    description: '',
    onlyShowOnSearch: true
  }
];

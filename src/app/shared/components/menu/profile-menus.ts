import { BASEURL, APIURL } from '../../../url';

export const PROFILE_MENUS = [{
  name: 'Settings',
  namespace: BASEURL + '/dhis-web-user-profile',
  defaultAction: BASEURL + '/dhis-web-user-profile/#/settings',
  icon: BASEURL + '/icons/usersettings.png',
  description: ''
}, {
  name: 'Profile',
  namespace: BASEURL + '/dhis-web-user-profile',
  defaultAction: BASEURL + '/dhis-web-user-profile/#/profile',
  icon: BASEURL + '/icons/function-profile.png',
  description: ''
}, {
  name: 'Account',
  namespace: BASEURL + '/dhis-web-user-profile',
  defaultAction: BASEURL + '/dhis-web-user-profile/#/account',
  icon: BASEURL + '/icons/function-account.png',
  description: ''
}, {
  name: 'Help',
  namespace: BASEURL + '/dhis-web-commons-about',
  defaultAction: 'https://dhis2.github.io/dhis2-docs/master/en/user/html/dhis2_user_manual_en.html',
  icon: BASEURL + '/icons/function-account.png',
  description: ''
}, {
  name: 'About Dhis2',
  namespace: BASEURL + '/dhis-web-commons-about',
  defaultAction: BASEURL + '/dhis-web-commons-about/about.action',
  icon: BASEURL + '/icons/function-about-dhis2.png',
  description: ''
}];

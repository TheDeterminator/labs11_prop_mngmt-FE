/* eslint no-restricted-globals: 0 */
import auth0 from 'auth0-js';
import { Component } from 'react';
import axios from '../axiosInstance';

export default class Auth extends Component {
  constructor(props) {
    super(props);
    // this.getProfile = this.getProfile.bind(this);
    this.login = this.login.bind(this);
  }
  auth0 = new auth0.WebAuth({
    domain: 'classroomangel.auth0.com',
    clientID: 'aCRKf9uUYcF1v2gFUZf0s3PZtxy6uwvn',
    redirectUri: `${process.env.REACT_APP_URL ||
      'http://localhost:3000'}/authload`,
    responseType: 'token id_token',
    // audience: 'classroomangel.auth0.com/userinfo',
    scope: 'openid profile email firstName'
  });

  userProfile = JSON.parse(localStorage.getItem('profile'));

  login() {
    this.auth0.authorize();
  }

  logout() {
    localStorage.clear();
  }

  handleAuth = () => {
    this.auth0.parseHash(async (err, authResults) => {
      let users = await axios.get('/users');
      let orgs = await axios.get('/organizations');
      users = users.data.users;
      orgs = orgs.data.organizations;
      if (authResults && authResults.accessToken && authResults.idToken) {
        let expires = JSON.stringify(
          authResults.expiresIn * 1000 + new Date().getTime()
        );
        const profile = authResults.idTokenPayload;
        localStorage.setItem(
          'access_token',
          JSON.stringify(authResults.accessToken)
        );
        localStorage.setItem('expires', expires);
        localStorage.setItem('profile', JSON.stringify(profile));
        let oldUser = users.filter(user => {
          return (
            user.username === profile.email ||
            user.firstName + ' ' + user.lastName === profile.name
          );
        });
        if (oldUser.length !== 0) {
          let [userOrg] = orgs.filter(
            org => org.id == oldUser[0].organizationId
          );
          let profile = JSON.parse(localStorage.getItem('profile'));
          profile.orgId = userOrg.id;
          profile.role = oldUser[0].role;
          profile.name = oldUser[0].firstName + ' ' + oldUser[0].lastName;
          profile.organizationName = userOrg.name;
          localStorage.setItem('profile', JSON.stringify(profile));
          if (profile.role === 'Board member') {
            location.pathname = '/bm-homepage';
          } else {
            location.pathname = '/issue-log';
          }
        } else {
          location.pathname = '/signup';
        }
      } else if (err) {
        location.pathname = '/';
        console.log(err);
      }
    });
  };

  isAuth = () => {
    let expires_at = JSON.parse(localStorage.getItem('expires'));
    const now = new Date().getTime();
    if (expires_at < now) {
      this.logout();
    }
    return expires_at > now;
  };
}

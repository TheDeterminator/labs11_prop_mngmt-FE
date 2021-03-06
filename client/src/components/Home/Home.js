import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';
import logo from '../../img/logo.png';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      test: []
    };
    this.isAuth = props.auth.isAuth();
    this.date = new Date();
  }

  componentDidMount = () => {
    if (!localStorage.getItem('firstLoad')) {
      // localStorage.setItem('firstLoad', true);
    } else {
      localStorage.removeItem('firstLoad');
      window.location.reload();
    }
  };

  componentDidUpdate = () => {
    let footer = document.querySelector('.Footer');
    if (!this.isAuth) {
      footer.classList = 'Footer extraSpace';
    } else {
      footer.classList = 'Footer';
    }
  };

  render() {
    return (
      <div className="home">
        <div className="onboarding-component">
          <div className="topbar">
            <div className="landingTitle">
              <h4>Classroom Angel</h4>
            </div>
          </div>
        </div>

        <div className="logoAndText">
          <div className="textBox z-depth-5 cyan">
            <h4>
              Manage your <br />
              school wisely
            </h4>
            <p>
              It's easy to manage your school with Classroom Angel! As a teacher
              or a school administrator overseas, or a board member in the
              United States, you will get all the information you need about
              issues that need to be resolved, be able to pay contractors for
              their work with Stripe, and see when an administrator is set to
              visit.
            </p>

            {!this.isAuth && (
              <>
                <p>Sign up or sign in today to get started!</p>
                <NavLink
                  className="amber darken-2 btn"
                  to="/"
                  style={{ margin: '0 15px' }}
                  onClick={this.props.auth.login}
                >
                  Sign up/sign in
                </NavLink>{' '}
              </>
            )}
          </div>
          <img
            src={logo}
            alt="Classroom Angel's logo"
            id="logo"
            className="hide-on-med-and-down"
          />
        </div>
        <div className="Footer">
          <p>
            © {this.date.getFullYear()}, Classroom Angel. All rights reserved.
          </p>
        </div>
      </div>
    );
  }
}

export default Home;

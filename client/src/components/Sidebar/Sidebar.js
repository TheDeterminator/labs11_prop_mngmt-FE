import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';
import './Sidebar.css';
import M from 'materialize-css/dist/js/materialize.min.js';
import 'materialize-css/dist/css/materialize.min.css';

class Sidebar extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // var elem = document.querySelector('.sidenav');
    // var instance = M.Sidenav.init(elem, {
    //   edge: 'left',
    //   inDuration: 250,
    //   onOpenStart: () => {
    //     elem.classList = 'sidenav sidebar';
    //   },
    //   onCloseEnd: () => {
    //     elem.classList = 'sidenav sidebar sideTransparent';
    //   }
    // });
    // if (instance.isOpen) {
    //   elem.classList = 'sidenav sidebar';
    // } else {
    //   elem.classList = 'sidenav sidebar sideTransparent';
    // }
  }

  componentDidUpdate = () => {
    var elem = document.querySelector('.sidenav');
    var instance = M.Sidenav.init(elem, {
      edge: 'left',
      inDuration: 250
    });
    let side = document.querySelector('.sidenav-overlay');
    if (side && (this.props.location && this.props.location.pathname === '/')) {
      side.classList = 'hidden';
    }
    if (instance) {
      if (instance.isOpen) {
        elem.classList = 'sidenav sidebar';
        side.classList = 'sidenav sidebar';
      } else {
        // elem.classList = 'sidenav sidebar sideTransparent';
        console.log(side.classList);
        // side.classList = 'sidenave sidebar sideTransparent';
      }
    }
  };

  render() {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const loc = this.props.location;
    if (
      loc &&
      (loc.pathname === '/' ||
        !profile ||
        loc.pathname === '/MeetTeam' ||
        loc.pathname === '/OurMission' ||
        loc.pathname === '/testimonials' ||
        loc.pathname === '/AddTestimonial')
    ) {
      return null;
    } else {
      return (
        <div>
          <ul id="slide-out" className="sidenav sidebar">
            <div
              className="cyan lighten-2"
              style={{ width: '110%', height: '270px' }}
            >
              <div
                className="avatar"
                style={
                  profile
                    ? {
                        backgroundImage: `url(${profile.picture})`,
                        backgroundSize: 'cover',
                        width: '150px',
                        height: '150px',
                        borderRadius: '75px',
                        margin: '40px auto 0'
                      }
                    : null
                }
              />
              {profile && (
                <h4 style={{ wordBreak: 'break-word' }}>{profile.name}</h4>
              )}
            </div>
            <h3 className="sidebar-header">Classroom Angel</h3>
            {profile.role === 'Board member' && (
              <li className="side-item">
                <NavLink to="/bm-homepage">
                  <p className="black-text" style={{ margin: 'auto' }}>
                    Board Member Homepage
                  </p>
                </NavLink>
              </li>
            )}
            {(profile.role === 'School administrator' ||
              profile.role === 'Teacher') && (
              <li className="side-item">
                <NavLink to="/issue-log">
                  <p className="black-text" style={{ margin: 'auto' }}>
                    Issue Log
                  </p>
                </NavLink>
              </li>
            )}
            <li className="side-item">
              <NavLink to="/scheduled">
                <p className="black-text" style={{ margin: 'auto' }}>
                  Scheduled Issues
                </p>
              </NavLink>
            </li>
            {profile.role === 'Board member' && (
              <li className="side-item">
                <NavLink to="/payments">
                  <p className="black-text" style={{ margin: 'auto' }}>
                    Payments
                  </p>
                </NavLink>
              </li>
            )}
            <li className="side-item">
              <NavLink
                to="/"
                onClick={() => localStorage.setItem('firstLoad', true)}
              >
                <p className="black-text" style={{ margin: 'auto' }}>
                  Landing Page
                </p>
              </NavLink>
            </li>
          </ul>
          <a
            href="#"
            data-target="slide-out"
            className="sidenav-trigger sidenav-close"
            style={{ position: 'fixed', left: '5px', top: '10px' }}
          >
            <i className="material-icons black-text">menu</i>
          </a>
        </div>
      );
    }
  }
}

export default Sidebar;

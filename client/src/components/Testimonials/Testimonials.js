import React, { Component } from 'react';
import axios from '../../axiosInstance';
import { Link } from 'react-router-dom';
import { Button, CardPanel, Row, Col } from 'react-materialize';
import './testimonial.css';

class Testimonials extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testimonials: []
    };
  }

  componentDidMount() {
    console.log('hi hi!');
    axios
      .get('testimonials')
      .then(response => {
        console.log(response.data);
        this.setState(function() {
          return { testimonials: [...response.data.testimonials] };
        });
      })
      .catch(error => {
        console.error('Cannot get testimonials', error);
      });
  }

  render() {
    return (
      <div className="testimonials">
        <div>
          <Link to="/AddTestimonial">
            <Button
              className="amber"
              waves="light"
              style={{ marginRight: '5px' }}
            >
              Tell us what you think!
            </Button>
          </Link>
        </div>

        {this.state.testimonials.map(testimonial => {
          return (
            <Row className="valign-wrapper">
              <Col className="s12 m5" style={{ margin: '0 auto' }}>
                <CardPanel className=" cyan">
                  <span className="white-text ">
                    <h5>{testimonial.name}</h5>
                    <h6>{testimonial.role}</h6>
                    <p>{testimonial.text}</p>
                  </span>
                </CardPanel>
              </Col>
            </Row>
          );
        })}
      </div>
    );
  }
}

export default Testimonials;

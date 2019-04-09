import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import '../../App.css';
import './Issues.css';
import axios from '../../axiosInstance';
import { NavLink } from 'react-router-dom';
import Uploader from '../Uploader';
import {
  Button,
  Card,
  Chip,
  Checkbox,
  Carousel,
  Icon,
  Row,
  Col
} from 'react-materialize';

const statuses = ['Needs Attention', 'Resolved', 'Scheduled', 'Ignored'];

let tags = [];

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = mm + '-' + dd + '-' + yyyy;

export default class IssueLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      issues: [],
      issuesLoaded: false,
      issueName: '',
      issueNotes: '',
      issueStatus: '',
      orgID: 1,
      editingIssue: false,
      issue: null,
      tag: '',
      tags: [],
      modal: false,
      isVisit: false,
      comment: '',
      comments: [],
      showComments: false,
      filterStatus: 'all',
      filterTag: 'all',
      passes: false,
      images: [],
      eid: 3
    };
    this.postIssues = this.postIssues.bind(this);
    this.deleteIssue = this.deleteIssue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.toggleEdit = this.toggleEdit.bind(this);
    this.fetchIssue = this.fetchIssue.bind(this);
    this.visitChange = this.visitChange.bind(this);
    this.toggleShowComments = this.toggleShowComments.bind(this);
    this.submitComment = this.submitComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.arrayTags = this.arrayTags.bind(this);
  }

  componentDidMount() {
    axios
      .get('issues')
      .then(res =>
        this.setState({ issues: res.data.issues, issuesLoaded: true })
      )
      .catch(err => console.log(err));
    axios
      .get('tags')
      .then(res => this.setState({ tags: res.data.tags }))
      .catch(err => console.log(err));
    axios
      .get('comments')
      .then(res => this.setState({ comments: res.data.comments }))
      .catch(err => console.log(err));
  }

  postIssues(event) {
    event.preventDefault();
    axios
      .post('issues', {
        name: this.state.issueName,
        notes: this.state.issueNotes,
        status: this.state.issueStatus.toLowerCase(),
        isVisit: this.state.isVisit,
        organizationId: this.state.orgID,
        equipmentId: this.state.eid,
        date: today
      })
      .then(res => {
        const id = res.data.issue.id;
        if (this.state.images === []) {
          const formData = new FormData();
          const files = [...this.state.images];
          console.log(files);
          files.forEach((file, i) => {
            formData.append(i, file);
          });
          console.log(formData);
          axios
            .post(`issues/${id}/images`, formData)
            .then(res2 => {
              console.log('RES2', res2);
              this.setState(prevState => ({
                ...prevState,
                issueName: '',
                issueNotes: '',
                issues: [...prevState.issues, res.data.issue],
                images: []
              }));
            })
            .catch(err => console.log(err));
        } else {
          this.setState(prevState => ({
            ...prevState,
            issueName: '',
            issueNotes: '',
            issues: [...prevState.issues, res.data.issue],
            images: []
          }));
        }
      })
      .catch(err => console.log(err));
  }

  deleteIssue(event) {
    axios
      .delete(`issues/${event.target.value}`)
      .then(res => {
        var copy = this.state.issues.filter(function(element) {
          return element.id !== res.data.issue.id;
        });
        this.setState({ issues: copy });
      })
      .catch(err => console.log(err));
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  toggleEdit() {
    this.setState({
      editingIssue: !this.state.editingIssue,
      title: this.state.note.title,
      textBody: this.state.note.textBody
    });
  }

  toggleShowComments() {
    this.setState({ showComments: !this.state.showComments });
  }

  fetchIssue(id) {
    axios
      .get(`issues/${id}`)
      .then(res => {
        console.log('fetched note', res.data);
        this.setState({ issue: res.data.issue });
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleTagEdit(id, event) {
    event.preventDefault();
    const newTag = { name: this.state.tag, issueId: id };
    axios
      .post(`tag`, newTag)
      .then(response => {
        console.log('axios response', response.data);
        this.setState({ tags: response.data, tag: '' });
      })
      .catch(err => {
        console.log('Tag Edit Error', err);
      });
  }

  imgAdder = e => {
    const files = Array.from(e.target.files);
    this.setState({
      images: files,
      uploading: true
    });
  };

  visitChange(event) {
    this.setState({ [event.target.name]: event.target.checked });
  }

  submitComment(event) {
    event.preventDefault();
    axios
      .post('comments', {
        content: this.state.comment,
        userId: 1,
        issueId: event.target[0].attributes[2].value
      })
      .then(res => {
        this.setState({
          comments: [...this.state.comments, res.data.comment],
          comment: ''
        });
      })
      .catch(err => console.error(err));
  }

  deleteComment(event) {
    axios
      .delete(`comments/${event.target.getAttribute('issue_id')}`)
      .then(res => {
        let copy = this.state.comments.slice().filter(function(comment) {
          return comment.id !== res.data.comment.id;
        });
        this.setState({ comments: copy });
      })
      .catch(err => console.error(err));
  }

  // Populates global tags array with whatever new tags are entered
  arrayTags() {
    this.state.tags.forEach(tag => {
      if (!tags.includes(tag.name)) tags.push(tag.name);
    });
  }

  render() {
    if (this.props.auth.isAuth()) {
      this.arrayTags();
      if (this.state.issuesLoaded) {
        return (
          <div className="page-container">
            <Sidebar />
            <div className="right-side">
              <h1 style={{ textAlign: 'center', border: '2px solid gray' }}>
                Issue Log
              </h1>
              Filter By Status:
              <div className=".input-field">
                <select
                  name="filterStatus"
                  onChange={this.handleChange}
                  className=""
                  style={{ marginBottom: '20px' }}
                >
                  <option value="all">Choose...</option>
                  {statuses.map((status, index) => {
                    return (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    );
                  })}
                </select>
              </div>
              Filter By Tag:
              <div className="row">
                <div className="input-field col s12">
                  <select>
                    <option value="" disabled selected>
                      Choose your option
                    </option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                  </select>
                  <label>Materialize Select</label>
                </div>
              </div>
              <select
                name="filterTag"
                onChange={this.handleChange}
                className=""
                style={{ marginBottom: '20px' }}
              >
                <option value="all">Choose...</option>
                {tags.map((tag, index) => {
                  return (
                    <option key={index} value={tag}>
                      {tag}
                    </option>
                  );
                })}
              </select>
              <div className="issue-list">
                {this.state.issues.map(issue => {
                  // filters tags by filter criteria
                  let truthArray = this.state.tags.filter(tag => {
                    return tag.name === this.state.filterTag;
                  });
                  // Array that will hold whatever issue IDs are attached to filtered tags
                  let testArray = [];
                  truthArray.forEach(entry => {
                    testArray.push(entry.issueId);
                  });

                  if (
                    (issue.status === this.state.filterStatus.toLowerCase() ||
                      this.state.filterStatus === 'all') &&
                    (testArray.includes(issue.id) ||
                      this.state.filterTag === 'all')
                  )
                    return (
                      <Card key={issue.id} className="">
                        <p
                          style={{
                            textAlign: 'left',
                            marginLeft: '20px',
                            fontSize: '18px'
                          }}
                        >
                          {issue.name}
                        </p>
                        <p>{issue.notes}</p>
                        {/* <p>Status: {issue.status}</p> */}
                        <p>Date: {issue.date}</p>
                        {/* <p>Org. Id: {issue.organizationId}</p> */}
                        <div>
                          {this.state.tags
                            .filter(function(tag) {
                              return tag.issueId === issue.id;
                            })
                            .map(function(tag) {
                              return (
                                <Chip key={tag.id} className="blue-grey">
                                  {tag.name}
                                </Chip>
                              );
                            })}
                        </div>
                        <Button
                          onClick={this.deleteIssue}
                          value={issue.id}
                          className="red"
                        >
                          Delete
                        </Button>
                        <NavLink to={`/issue/${issue.id}`}>
                          <Button
                            value={issue.id}
                            // className="edit-issue-button"
                          >
                            View/Update
                          </Button>
                        </NavLink>
                        <Button
                          onClick={this.toggleShowComments}
                          value={issue.id}
                          className="blue"
                        >
                          Show Comments
                        </Button>
                        {this.state.showComments ? (
                          <div>
                            <div>
                              {this.state.comments
                                .filter(function(comment) {
                                  return comment.issueId === issue.id;
                                })
                                .map(comment => {
                                  return (
                                    <div key={comment.id}>
                                      - {comment.content}
                                      <span
                                        className="delete-button"
                                        onClick={this.deleteComment}
                                        issue_id={comment.id}
                                      >
                                        {' '}
                                        x
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                            <form onSubmit={this.submitComment}>
                              <input
                                name="comment"
                                placeholder="add comment"
                                value={this.state.comment}
                                issue_id={issue.id}
                                onChange={this.handleChange}
                              />
                            </form>
                          </div>
                        ) : null}
                      </Card>
                    );
                })}
                <Card>
                  <form onSubmit={this.postIssues}>
                    <h1>New Issue +</h1>
                    {/* <div className="inpudt-field"> */}
                    <input
                      name="issueName"
                      value={this.state.issueName}
                      placeholder="Issue Title"
                      onChange={this.handleChange}
                    />
                    {/* </div> */}
                    <br />
                    <input
                      name="issueNotes"
                      value={this.state.issueNotes}
                      placeholder="Additional notes"
                      onChange={this.handleChange}
                    />
                    <br />
                    {/* <Checkbox
                      id="isVisit"
                      name="isVisit"
                      value={true}
                      onChange={this.visitChange}
                    /> */}

                    <label>
                      <input
                        type="checkbox"
                        id="isVisit"
                        name="isVisit"
                        value={true}
                        onChange={this.visitChange}
                      />
                      <span>isVisit</span>
                    </label>
                    <br />
                    <select name="issueStatus" onChange={this.handleChange}>
                      <option value="">Status...</option>
                      {statuses.map((status, index) => {
                        return (
                          <option key={index} value={status}>
                            {status}
                          </option>
                        );
                      })}
                    </select>
                    <br />
                    <Uploader
                      uploading={this.state.uploading}
                      imgAdder={this.imgAdder}
                    />
                    <Button type="submit" waves="light">
                      Submit
                      <Icon right>send</Icon>
                    </Button>
                  </form>
                </Card>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="page-container">
            <Sidebar />
            <div className="right-side">
              <h1>Loading...</h1>
            </div>
          </div>
        );
      }
    }
  }
}

import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { getProjectDetail } from "../../actions/projectDetailActions";
import { showModal, hideModal } from "../modals/ModalActions";

import moment from "moment";

class ProjectView extends Component {
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.openAlertModal = this.openAlertModal.bind(this);
  }

  closeModal(event) {
    console.log("hideModal in ProjectDetails");
    this.props.hideModal();
  }

  openAlertModal() {
    console.log("openAlertModal");

    this.props.showModal(
      {
        open: true,
        title: "Alert Modal",
        message: "Good luck!",
        closeModal: this.closeModal
      },
      "createProject"
    );
  }

  componentDidMount() {
    this.props.getProjectDetail(
      this.props.auth.organization.slug,
      this.props.id.id
    );
  }
  componentDidUpdate(prevProps) {}

  onAddDataSource() {
    console.log("add data source");
  }

  render() {
    const { organization } = this.props.auth;
    const { projectDetail } = this.props.projectDetail;

    let content = (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            <h2>
              <i className="fa fa-folder-open-o" aria-hidden="true" /> Project:{" "}
              {projectDetail.title}
            </h2>
            <p>{projectDetail.description}</p>
          </div>
          <div className="col text-center text-md-right">
            {" "}
            <small>
              Created at:{" "}
              {moment(projectDetail.created_at).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}{" "}
              by <strong>{projectDetail.created_by_username}</strong>
              <br />
              Last update:{moment(projectDetail.updated_at).fromNow()}{" "}
            </small>
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-3">
            <h5>Uploaded files</h5>
            <h2>
              <i className="fa fa-file-o" aria-hidden="true" />{" "}
              {projectDetail.datasources_cnt}
            </h2>
            <Link
              to={
                "/" +
                organization.slug +
                "/project/" +
                projectDetail.id +
                "/uploaded/"
              }
            >
              List
            </Link>{" "}
            <br />
            <br />
          </div>

          <div className="col-3">
            <h5>Queries</h5>
            <h2>
              <i className="fa fa-pencil-square-o" aria-hidden="true" />{" "}
              {projectDetail.queries_cnt}
            </h2>
            <Link
              to={
                "/" +
                organization.slug +
                "/project/" +
                projectDetail.id +
                "/uploaded/"
              }
            >
              List
            </Link>{" "}
            <br />
            <br />
          </div>

          <div className="col-3">
            <h5>DataFrames</h5>
            <h2>
              <i className="fa fa-th" aria-hidden="true" />{" "}
              {projectDetail.dataframes_cnt}
            </h2>
            <Link
              to={
                "/" +
                organization.slug +
                "/project/" +
                projectDetail.id +
                "/dataframes/"
              }
            >
              List
            </Link>{" "}
            <br />
            <br />
          </div>

          <div className="col-3">
            <h5>Columns selection</h5>
            <h2>
              <i className="fa fa-list-ul" aria-hidden="true" />{" "}
              {projectDetail.columns_usage_cnt}
            </h2>
            <Link
              to={
                "/" +
                organization.slug +
                "/project/" +
                projectDetail.id +
                "/columns_usage_list/"
              }
            >
              List
            </Link>
            <br />
            <br />
          </div>

          <div className="col-3">
            <h5>ML experiments</h5>
            <h2>
              <i className="fa fa-flask" aria-hidden="true" />{" "}
              {projectDetail.experiments_cnt}
            </h2>
            <Link
              to={
                "/" +
                organization.slug +
                "/project/" +
                projectDetail.id +
                "/experiments/"
              }
            >
              List
            </Link>
          </div>

          <div className="col-3">
            <h5>ML models</h5>
            <h2>
              <i className="fa fa-cogs" aria-hidden="true" />{" "}
              {projectDetail.models_cnt}
            </h2>
            <Link
              to={
                "/" +
                organization.slug +
                "/project/" +
                projectDetail.id +
                "/models/"
              }
            >
              List
            </Link>
          </div>

          <div className="col-3">
            <h5>Predictions</h5>
            <h2>
              <i className="fa fa-bolt" aria-hidden="true" />{" "}
              {projectDetail.predictions_cnt}
            </h2>
            <Link
              to={
                "/" +
                organization.slug +
                "/project/" +
                projectDetail.id +
                "/predictions/"
              }
            >
              List
            </Link>
          </div>

          <div className="col-3">
            <h5>Tasks</h5>
            <h2>
              <i className="fa fa-tasks" aria-hidden="true" /> -
            </h2>{" "}
            Coming soon!
          </div>
        </div>
        <br />
        <hr />
        <div className="row">
          <div className="col-12">
            <h3>
              <i className="fa fa-rocket" aria-hidden="true" /> How to start
            </h3>
            <ul>
              <li>
                First of all, you need input dataset. It will be used for
                training a machine learning model. You have following options to
                provide a dataset:
                <ul>
                  <li>
                    The input dataset can be uploaded as a flat CSV file. To do
                    this, go here:{" "}
                    <Link
                      to={
                        "/" +
                        organization.slug +
                        "/project/" +
                        projectDetail.id +
                        "/uploaded/"
                      }
                    >
                      Uploaded files
                    </Link>
                  </li>
                  <li>
                    The input dataset can be created as SQL query to PostgreSQL
                    database. To do this, go here:{" "}
                    <Link
                      to={
                        "/" +
                        organization.slug +
                        "/project/" +
                        projectDetail.id +
                        "/queries/"
                      }
                    >
                      Queries
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                For provided dataset MLJAR will create coresponding DataFrame.
                You can check the DataFrame preview here:{" "}
                <Link
                  to={
                    "/" +
                    organization.slug +
                    "/project/" +
                    projectDetail.id +
                    "/dataframes/"
                  }
                >
                  DataFrames
                </Link>
              </li>
              <li>
                Please select which columns should be used as input for the
                model and which column should be output of the model (the target
                column). You can do this here:{" "}
                <Link
                  to={
                    "/" +
                    organization.slug +
                    "/project/" +
                    projectDetail.id +
                    "/columns_usage_list/"
                  }
                >
                  Columns usage
                </Link>
              </li>
              <li>
                {"Let's "} train machine learning models! Please create your
                first ML experiment. You can do this here:{" "}
                <Link
                  to={
                    "/" +
                    organization.slug +
                    "/project/" +
                    projectDetail.id +
                    "/experiments/"
                  }
                >
                  Experiments
                </Link>
              </li>
              <li>
                Your models are in the training. Please be patient. You can
                check their training progress here:{" "}
                <Link
                  to={
                    "/" +
                    organization.slug +
                    "/project/" +
                    projectDetail.id +
                    "/models/"
                  }
                >
                  Models
                </Link>
              </li>
              <li>
                Great! You have your machine learning models ready. It is time
                to use your models. Please provide next dataset. It will be used
                for computing predictions (check the first step). To compute
                predictions go here:{" "}
                <Link
                  to={
                    "/" +
                    organization.slug +
                    "/project/" +
                    projectDetail.id +
                    "/predictions/"
                  }
                >
                  Predictions
                </Link>
              </li>
              <li>
                Good luck! In case any questions about MLJAR platform or machine
                learning, please feel free to contact us by email:
                contact@mljar.com
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
    return content;
  }
}

ProjectView.propTypes = {
  id: PropTypes.object.isRequired, // id of the project
  getProjectDetail: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  hideModal: PropTypes.func.isRequired,
  projects: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  projectDetail: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  id: ownProps.match.params,
  projects: state.projects,
  auth: state.auth,
  projectDetail: state.projectDetail
});

export default connect(
  mapStateToProps,
  { getProjectDetail, showModal, hideModal }
)(withRouter(ProjectView));

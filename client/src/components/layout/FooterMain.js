import React from "react";
import { connect } from "react-redux";
//import PropTypes from 'prop-types';

class FooterMain extends React.Component {
  render() {
    return (
      <footer className="footer">
        <div>Your Data Science Headquarter, MLJAR v0.0.1</div>
      </footer>
    );
  }
}

FooterMain.propTypes = {};

const mapStateToProps = state => ({});

export default connect(
  mapStateToProps,
  {}
)(FooterMain);

/* global window */

'use strict';

var React = require('react');
var assign = require('object-assign');
var omit = require('lodash.omit');
var mediaQuery = require('./mediaQuery');
var toQuery = require('./toQuery');
var isBrowser = typeof window !== 'undefined';

var defaultTypes = {
  component: React.PropTypes.func,
  query: React.PropTypes.string
};
var mediaKeys = Object.keys(mediaQuery.all);
var types = assign(defaultTypes, mediaQuery.all);
var excludedQueryKeys = Object.keys(types);
var excludedPropKeys = excludedQueryKeys.concat(mediaKeys);

var mq = React.createClass({
  displayName: 'MediaQuery',
  propTypes: types,

  getDefaultProps: function(){
    return {
      component: React.DOM.div
    };
  },

  getInitialState: function(){
    return {
      matches: false
    };
  },

  componentDidMount: function(){
    isBrowser && this.updateQuery(this.props);
  },

  componentWillReceiveProps: function(props){
    isBrowser && this.updateQuery(props);
  },

  updateQuery: function(props){
    if (props.query) {
      this.query = props.query;
    } else {
      this.query = toQuery(omit(props, excludedQueryKeys));
    }

    if (!this.query) {
      throw new Error('Invalid or missing MediaQuery!');
    }

    this._mql = matchMedia(this.query);
    this._mql.addListener(this.updateMatches);
    this.updateMatches();
  },

  componentWillUnmount: function(){
    isBrowser && this._mql.removeListener(this.updateMatches);
  },

  updateMatches: function(){
    if (this._mql.matches === this.state.matches) {
      return;
    }
    this.setState({
      matches: this._mql.matches
    });
  },

  render: function(){
    var children = this.props.children;
    var style = {};

    if (!isBrowser || this.state.matches === false) {
      style.display = 'none';
    }

    return React.DOM.div({
      style: style
    }, this.props.children);
  }
});

module.exports = mq;

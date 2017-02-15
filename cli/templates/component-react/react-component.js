import React from 'react';

var {{componentName}} = React.createClass({
  getInitialState() {
    return {
      count: 0
    };
  },
  onClick() {
    this.setState({count: this.state.count + 1});
  },
  render() {
    const owner = this.props.owner;
    return (
      <div>
        <div className="heading">This {{componentName}} Component belongs to {owner}</div>
        <div className="counter">count:{this.state.count}</div>
        <button onClick={this.onClick}>Click</button>
      </div>
    );
  }
});

export default {{componentName}};
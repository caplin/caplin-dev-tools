import React from "react";
import ReactDOM from "react-dom";

export class {{componentName}} extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0
    }
  }

  onClick() {
    this.setState((prevState) => {
      return {count: prevState.count + 1};
    });
  }

  render() {
    const owner = this.props.owner;
    return (
      <div>
        <div className="heading">
          This {{componentName}} Component belongs to {owner}
        </div>
        <div className="counter">count:{this.state.count}</div>
        <button onClick={this.onClick.bind(this)}>Click</button>
      </div>
    );
  }
}

export default {{componentName}};
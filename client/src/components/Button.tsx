import React, { Component } from 'react';
import styles from '../css/Button.module.css';


interface IProps {
  text: string;
  func(text:string): void;
}

class Button extends Component<IProps, {}> {

  constructor(props:any) {
    super(props);
    this.clickFunction = this.clickFunction.bind(this);
  }

  clickFunction () {
    this.props.func(this.props.text);
  }

  render() {
    return (
      <div className={styles.button} onClick={this.clickFunction}>
        {this.props.text}
      </div>
    );
  }
}

export default Button;

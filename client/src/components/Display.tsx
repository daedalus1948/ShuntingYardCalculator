import React, { Component } from 'react';

import styles from '../css/Display.module.css';

interface IProps {
  expression: string;
  result: string;
}

class Display extends Component<IProps, {}> {
  render() {
    return (
      <div className={ styles.display }>
        <div className={ styles.part }>
          {this.props.expression}
        </div>
        <div className={ styles.part }>
          {this.props.result}
        </div>
      </div>
    );
  }
}

export default Display;

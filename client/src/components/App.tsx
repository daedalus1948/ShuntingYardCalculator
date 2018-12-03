import React, { Component } from 'react';

import Calculator from './Calculator';
import styles from '../css/App.module.css';

class App extends Component<{},{}> {
  render() {
    return (
      <div className={styles.app}>
        <Calculator />
      </div>
    );
  }
}

export default App;

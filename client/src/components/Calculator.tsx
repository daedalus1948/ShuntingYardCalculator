import React, { Component } from 'react';

import Display from './Display';
import Buttonpad from './Buttonpad';
import styles from '../css/Calculator.module.css';
import { postRequest } from '../requests';

interface IState {
    expression: string,
    result: string,
    lastRequest: number
}

class Calculator extends Component<{}, IState> {
  
  state:IState = {
    expression: "",
    result: "",
    lastRequest: 0
  }

  constructor(props:any) {
    super(props);

    this.setExpression = this.setExpression.bind(this);
    this.deleteExpression = this.deleteExpression.bind(this);
    this.evalExpression = this.evalExpression.bind(this);
    this.setResult = this.setResult.bind(this);
  }

  setExpression (newExpression: string): void {
    let updatedExpression = this.state.expression + newExpression;
    this.setState({ expression: updatedExpression}, ()=>{
      this.evalExpression(postRequest, {expression: this.state.expression}, "http://127.0.0.1:4444/calculate/");
    });
  }

  deleteExpression(): void {
    clearTimeout(this.state.lastRequest);
    this.setState({expression: "", result: ""});
  }

  evalExpression(postRequest:any, data:any, url:string): Promise<string> {
    clearTimeout(this.state.lastRequest);
    let requestId = postRequest(data, url)
      .then((data:any)=>{
        this.setState({ result: data.result });
      })
      .catch((error:any)=>{console.log(error)});
    this.setState({ lastRequest: requestId, result: "calculating..." });
    return requestId;
  }

  setResult (newResult:string): void {
    this.setState({ result: newResult });
  }

  render() {
    return (
      <div className={styles.calculator}>
        <Display expression={this.state.expression} result={this.state.result}/>
        <Buttonpad 
          setExpression={ this.setExpression } 
          deleteExpression={ this.deleteExpression }
        />
      </div>
    );
  }
}

export default Calculator;

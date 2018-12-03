import React, { Component } from 'react';

import Button from './Button';
import styles from '../css/Buttonpad.module.css';

interface IProps {
  setExpression(newExpression: string): void;
  deleteExpression(): void;
}

class Buttonpad extends Component<IProps, {}> {
  render() {
    return (
      <div className={ styles.buttonpad }>
        <div className={ styles.grid }>
          <Button text={"("} func={this.props.setExpression} />
          <Button text={")"} func={this.props.setExpression} />
          <Button text={"^"} func={this.props.setExpression} />
          <Button text={"C"} func={this.props.deleteExpression} />
        </div>
        <div className={ styles.grid }>
          <Button text={"7"} func={this.props.setExpression} />
          <Button text={"8"} func={this.props.setExpression} />
          <Button text={"9"} func={this.props.setExpression} />
          <Button text={"+"} func={this.props.setExpression} />
        </div>
        <div className={ styles.grid }>
          <Button text={"4"} func={this.props.setExpression} />
          <Button text={"5"} func={this.props.setExpression} />
          <Button text={"6"} func={this.props.setExpression} />
          <Button text={String.fromCharCode(45)} func={this.props.setExpression} />
        </div>
        <div className={ styles.grid }>
          <Button text={"1"} func={this.props.setExpression} />
          <Button text={"2"} func={this.props.setExpression} />
          <Button text={"3"} func={this.props.setExpression} />
          <Button text={"*"} func={this.props.setExpression} />
        </div>
        <div className={ styles.grid }>
          <Button text={"0"} func={this.props.setExpression} />
          <Button text={"."} func={this.props.setExpression} />
          <Button text={"="} func={(text)=>{this.props.setExpression("")}} />
          <Button text={"/"} func={this.props.setExpression} />
        </div>
      </div>
    );
  }
}

export default Buttonpad;

import React from 'react';
import { shallow } from 'enzyme';

import Calculator from '../components/Calculator';
import Display from '../components/Display';
import Buttonpad from '../components/Buttonpad';
import { Promise } from 'es6-promise';


describe('CALCULATOR COMPONENT', () => {
    test('Calculator component renders a display component', () => {
        let calculator = shallow(<Calculator />);
        expect(calculator.find(Display)).toHaveLength(1);
    });

    test('Calculator component renders a buttonpad component', () => {
        let calculator = shallow(<Calculator />);
        expect(calculator.find(Buttonpad)).toHaveLength(1);
    });

    test('Calculator updates result state', () => {
        let calculator = shallow(<Calculator />);
        let castedCalc = calculator.instance() as Calculator;
        castedCalc.setResult("7");
        expect(calculator.state('result')).toEqual("7");
    });

    test('Calculator deletes expression and result state', () => {
        let calculator = shallow(<Calculator />);
        let castedCalc = calculator.instance() as Calculator;
        castedCalc.deleteExpression();
        expect(calculator.state('expression')).toEqual("");
        expect(calculator.state('result')).toEqual("");
    });

    test('Calculator succesfully updates state when calling evalExpression()', () => {

        let mockDataRequest = (data: string, url:string) => {
            return new Promise ((resolve, reject) => {
                resolve(data);
            })
        }

        let calculator = shallow(<Calculator />);
        let castedCalc = calculator.instance() as Calculator;
        let promiseOne = castedCalc.evalExpression(mockDataRequest, {result:"777"}, "test-url");
        expect(calculator.state('result')).toEqual("calculating...");
        return promiseOne.then(()=>{
            expect(calculator.state('result')).toEqual('777');
        })
    });

})

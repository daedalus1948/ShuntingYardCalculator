import React from 'react';
import { shallow } from 'enzyme';

import Buttonpad from '../components/Buttonpad';
import Button from '../components/Button';


describe('BUTTONPAD COMPONENT', () => {
    
    test('Buttonpad renders 20 buttons', () => {
        let buttonpad = shallow(
        <Buttonpad 
            setExpression={()=>{}}
            deleteExpression={()=>{}} />
        );
        expect(buttonpad.find(Button)).toHaveLength(20);
    });

});

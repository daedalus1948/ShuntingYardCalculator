import React from 'react';
import { shallow } from 'enzyme';

import App from '../components/App';
import Calculator from '../components/Calculator';


describe('APP COMPONENT', () => {
    test('App component renders a calculator component', () => {
        let app = shallow(<App />);
        expect(app.find(Calculator)).toHaveLength(1);
    });
})

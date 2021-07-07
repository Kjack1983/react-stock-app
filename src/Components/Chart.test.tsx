import * as React from 'react';
import { shallow } from 'enzyme';
import Chart from './Chart';

describe('Chart component', () => {
    const chart = shallow(<Chart symbol="" size="" format="" time=""/>);

    // Interaction demo
    expect(chart.prop('symbol').to.be.a('string'));
    expect(chart.prop('size').to.be.a('string'));
    expect(chart.prop('format').to.be.a('string'));
    expect(chart.prop('time').to.be.a('string'));
    expect(chart).toMatchSnapshot();

})
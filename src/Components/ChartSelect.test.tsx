import * as React from 'react';
import { shallow } from 'enzyme';
import ChartSelect from './ChartSelect';

test('Chart component', () => {
    const chartSelect = shallow(<ChartSelect width={4} title="" value="" onChangeCompany={(event:any, company:string) => {} } inputSelect="" />);
    
    // Interaction demo
    expect(chartSelect.prop('width').to.be.a('number'));
    expect(chartSelect.prop('title').to.be.a('string'));
    expect(chartSelect.prop('onChangeCompany').to.be.a('function'));
    expect(chartSelect.prop('inputSelect').to.be.a('string'));
    //expect(chart.prop('size').toBe('compact'))

})
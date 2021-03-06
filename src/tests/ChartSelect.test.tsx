import * as React from "react";
import { shallow } from "enzyme";
import ChartSelect from "../Components/ChartSelect";

it("Chart component", () => {
    const inputSelect = ["GOOGL", "FB", "TWTR", "AMZN", "IBM"];
    const chartSelect = shallow(
        <ChartSelect
            width={4}
            title=""
            category=""
            value=""
            onChangeValue={(event: any, company: string) => {}}
            inputSelect={inputSelect}
        />
    );

    // Interaction demo
    expect(chartSelect.prop("width").to.be.a("number"));
    expect(chartSelect.prop("title").to.be.a("string"));
    expect(chartSelect.prop("onChangeValue").to.be.a("function"));
    expect(chartSelect.prop("inputSelect").to.be.a("array"));
    expect(chartSelect).toMatchSnapshot();
});

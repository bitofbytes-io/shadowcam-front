import React from "react";
import { shallow } from "enzyme";
import { PastWorkoutsPage } from "../../../pages/PastWorkoutsPage/PastWorkoutsPage";


describe("PastWorkoutsPage render", () => {
  it("Should render PastWorkoutsPage component without crashing", () => {
    shallow(<PastWorkoutsPage loading={()=>{}} />);
  });

  it("Should match PastWorkoutsPage component snapshot", () => {
    const wrapper = shallow(<PastWorkoutsPage loading={()=>{}} />);
    expect(wrapper.debug().replace(/[ \t]+$/gm, "")).toMatchSnapshot();
  });
});

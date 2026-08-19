import React from "react";
import { shallow } from "enzyme";
import LandingPage from '../../../pages/LandingPage/LandingPage'

describe("LandingPage render", () => {
  it("Should render LandingPage component without crashing", () => {
    shallow(<LandingPage />);
  });

  it("Should match LandingPage component snapshot", () => {
    const wrapper = shallow(<LandingPage />);
    expect(wrapper.debug().replace(/[ \t]+$/gm, "")).toMatchSnapshot();
  });
});

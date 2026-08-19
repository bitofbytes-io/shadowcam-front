import React from "react";
import { shallow } from "enzyme";
import NotFoundPage from '../../../pages/NotFoundPage/NotFoundPage'

describe("NotFoundPage render", () => {
  it("Should render NotFoundPage component without crashing", () => {
    shallow(<NotFoundPage />);
  });

  it("Should match NotFoundPage component snapshot", () => {
    const wrapper = shallow(<NotFoundPage />);
    expect(wrapper.debug().replace(/[ \t]+$/gm, "")).toMatchSnapshot();
  });
});

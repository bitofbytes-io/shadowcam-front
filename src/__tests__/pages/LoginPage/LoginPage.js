import React from "react";
import { shallow } from "enzyme";
import { Input, Form } from "reactstrap";
import { LoginPage } from "../../../pages/LoginPage/LoginPage";

describe("LoginPage render", () => {
  it("Should render LoginPage component without crashing", () => {
    shallow(<LoginPage />);
  });

  it("Should match LoginPage component snapshot", () => {
    const wrapper = shallow(<LoginPage />);
    expect(wrapper.debug().replace(/[ \t]+$/gm, "")).toMatchSnapshot();
  });
});

describe("Tests for updating component state on key press", () => {
  it("Should update email state when entering text in form fields", () => {
    const event = { target: { id: "email", value: "dan@dan.com" } };
    const wrapper = shallow(<LoginPage />);
    expect(wrapper.state(event.target.id)).toEqual("");
    wrapper
      .find(Input)
      .at(0)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update password state when entering text in form fields", () => {
    const event = { target: { id: "password", value: "somebadpassword" } };
    const wrapper = shallow(<LoginPage />);
    expect(wrapper.state(event.target.id)).toEqual("");
    wrapper
      .find(Input)
      .at(1)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });
});

describe("Tests for form submission", () => {
  it("Should call redux to try and login with email/password", () => {
    const event = { preventDefault: function() {} };
    const mockLogin = jest.fn();
    const wrapper = shallow(<LoginPage />);
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, "handleSubmit");

    wrapper.setState({ email: "dan@dan.com", password: "somebadpassword" });
    wrapper.setProps({ tryLogin: mockLogin });
    wrapper.find(Form).simulate("submit", event);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});

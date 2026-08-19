import React from "react";
import { shallow } from "enzyme";
import { Form, Input } from "reactstrap";

import { CreateAccountPage } from "../../../pages/CreateAccountPage/CreateAccountPage";

describe("CreateAccountPage render", () => {
  it("Should render CreateAccountPage component without crashing", () => {
    shallow(<CreateAccountPage />);
  });

  it("Should match CreateAccountPage component snapshot", () => {
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.debug().replace(/[ \t]+$/gm, "")).toMatchSnapshot();
  });
});

describe("Tests for form submission", () => {
  it("Should post data to backend after submission", () => {
    const event = { preventDefault: function() {} };
    const wrapper = shallow(<CreateAccountPage loading={() => {}} />);
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, "handleSubmit");

    wrapper.setState({
      email: { value: "dan@dan.com" },
      password: { value: "somebadpassword" }
    });
    wrapper.find(Form).simulate("submit", event);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe("Tests for updating component state on key press", () => {
  it("Should update email state when entering text in form fields", () => {
    const event = { target: { id: "email", value: "dan@dan.com" } };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state(event.target.id).value).toEqual("");
    wrapper
      .find(Input)
      .at(0)
      .simulate("change", event);
    expect(wrapper.state(event.target.id).value).toEqual(event.target.value);
  });

  it("Should update password state when entering text in form fields", () => {
    const event = { target: { id: "password", value: "somebadpassword" } };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state(event.target.id).value).toEqual("");
    wrapper
      .find(Input)
      .at(1)
      .simulate("change", event);
    expect(wrapper.state(event.target.id).value).toEqual(event.target.value);
  });

  it("Should update confirm password state when entering text in form fields", () => {
    const event = {
      target: { id: "confirmPassword", value: "somebadpassword" }
    };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state(event.target.id).value).toEqual("");
    wrapper
      .find(Input)
      .at(2)
      .simulate("change", event);
    expect(wrapper.state(event.target.id).value).toEqual(event.target.value);
  });

  it("Should update firstName state when entering text in form fields", () => {
    const event = { target: { id: "firstName", value: "HiThere" } };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state(event.target.id).value).toEqual("");
    wrapper
      .find(Input)
      .at(3)
      .simulate("change", event);
    expect(wrapper.state(event.target.id).value).toEqual(event.target.value);
  });

  it("Should update lastName state when entering text in form fields", () => {
    const event = { target: { id: "lastName", value: "MyLastName" } };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state(event.target.id).value).toEqual("");
    wrapper
      .find(Input)
      .at(4)
      .simulate("change", event);
    expect(wrapper.state(event.target.id).value).toEqual(event.target.value);
  });

  it("Should update birthDate state when entering text in form fields", () => {
    const event = { target: { id: "birthdate", value: "2019-01-01" } };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state(event.target.id).value).toEqual("1984-01-01");
    wrapper
      .find(Input)
      .at(5)
      .simulate("change", event);
    expect(wrapper.state(event.target.id).value).toEqual(event.target.value);
  });

  it("Should update gender state when clicking checkentering text in form fields", () => {
    const event = { target: { name: "gender", value: "f" } };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state("gender")).toEqual("m");
    wrapper
      .find(Input)
      .at(7)
      .simulate("change", event);
    expect(wrapper.state("gender")).toEqual("f");
  });

  it("Should update height state when entering text in form fields", () => {
    const event = { target: { id: "height", value: 80 } };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state(event.target.id).value).toEqual(65);
    wrapper
      .find(Input)
      .at(8)
      .simulate("change", event);
    expect(wrapper.state(event.target.id).value).toEqual(event.target.value);
  });

  it("Should update weight state when entering text in form fields", () => {
    const event = { target: { id: "weight", value: 200 } };
    const wrapper = shallow(<CreateAccountPage />);
    expect(wrapper.state(event.target.id).value).toEqual(160);
    wrapper
      .find(Input)
      .at(9)
      .simulate("change", event);
    expect(wrapper.state(event.target.id).value).toEqual(event.target.value);
  });
});

import React from "react";
import { shallow } from "enzyme";
import { Header } from "../../../components/Header/Header";
import { NavLink, Link } from "react-router-dom";
import { DropdownItem, Collapse, NavbarToggler } from "reactstrap";

describe("Header render", () => {
  it("Should render Header component without crashing", () => {
    shallow(<Header />);
  });

  it("Should match Header component snapshot", () => {
    const wrapper = shallow(<Header />);
    expect(wrapper.debug().replace(/[ \t]+$/gm, "")).toMatchSnapshot();
  });
});

describe("Header authorization tests", () => {
  it("Should not render links if not authorized", () => {
    const wrapper = shallow(<Header isAuth={false} />);
    expect(
      wrapper.contains(<NavLink to="/newRecording">New Recording</NavLink>).not
    );
    expect(
      wrapper.contains(<NavLink to="/pastRecordings">New Recording</NavLink>)
        .not
    );
    expect(
      wrapper.contains(<Link to="/account/profile">Account Settings</Link>).not
    );
    expect(wrapper.contains(<DropdownItem>Logout</DropdownItem>).not);
  });
  it("Should render links if authorized", () => {
    const wrapper = shallow(<Header isAuth />);
    expect(
      wrapper.contains(<NavLink to="/newRecording">New Recording</NavLink>)
    );
    expect(
      wrapper.contains(<NavLink to="/pastRecordings">New Recording</NavLink>)
    );
    expect(
      wrapper.contains(<Link to="/account/profile">Account Settings</Link>)
    );
    expect(wrapper.contains(<DropdownItem>Logout</DropdownItem>));
  });
});

describe("Header toggle dropdown working", () => {
  it("Should drop down toggle account menu when clicked", () => {
    const wrapper = shallow(<Header isAuth />);
    expect(wrapper.contains(<Collapse isOpen={false} navbar />));
    wrapper.find(NavbarToggler).simulate("click");
    expect(wrapper.contains(<Collapse isOpen={true} navbar />))
  });

  it("Should toggle menu when toggle method is executed", () => {
    const wrapper = shallow(<Header isAuth />);
    const instance = wrapper.instance();
    expect(wrapper.contains(<Collapse isOpen={false} navbar />));
    instance.toggle();
    expect(wrapper.contains(<Collapse isOpen={true} navbar />))
  });
});

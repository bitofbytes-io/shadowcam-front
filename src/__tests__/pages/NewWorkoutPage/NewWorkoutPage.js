import React from "react";
import { shallow } from "enzyme";
import { Form, Input } from "reactstrap";
import { NewWorkoutPage } from "../../../pages/NewWorkoutPage/NewWorkoutPage";

describe("NewWorkoutPage render", () => {
  it("Should render NewWorkoutPage component without crashing", () => {
    shallow(<NewWorkoutPage />);
  });

  it("Should match NewWorkoutPage component snapshot", () => {
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.debug().replace(/[ \t]+$/gm, "")).toMatchSnapshot();
  });
});

describe("NewWorkoutPage Input Testing", () => {
  it("Should update rest time in minutes with valid input change", () => {
    const event = { target: { id: "restTimeMin", value: 2 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(0)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update rest time in seconds with valid input change", () => {
    const event = { target: { id: "restTimeSec", value: 58 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(1)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update interval time in minutes with valid input change", () => {
    const event = { target: { id: "intervalTimeMin", value: 10 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(2)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update interval time in seconds with valid input change", () => {
    const event = { target: { id: "intervalTimeSec", value: 50 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(3)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should update number of intervals with valid input change", () => {
    const event = { target: { id: "numberInterval", value: 2 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(1);
    wrapper
      .find(Input)
      .at(4)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(event.target.value);
  });

  it("Should not update rest time in minutes with invalid input change", () => {
    const event = { target: { id: "restTimeMin", value: -25 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(0)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(0);
  });

  it("Should not update rest time in seconds with invalid input change", () => {
    const event = { target: { id: "restTimeSec", value: -10 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(1)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(0);
  });

  it("Should not update interval time in minutes with invalid input change", () => {
    const event = { target: { id: "intervalTimeMin", value: -1 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(2)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(0);
  });

  it("Should not update interval time in seconds with invalid input change", () => {
    const event = { target: { id: "intervalTimeSec", value: 80 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(0);
    wrapper
      .find(Input)
      .at(3)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(0);
  });

  it("Should not update number of intervals with invalid input change", () => {
    const event = { target: { id: "numberInterval", value: -2 } };
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state(event.target.id)).toEqual(1);
    wrapper
      .find(Input)
      .at(4)
      .simulate("change", event);
    expect(wrapper.state(event.target.id)).toEqual(1);
  });
});

describe("Should return the correct total time", () => {
  it("Should have 0 total time at start", () => {
    const wrapper = shallow(<NewWorkoutPage />);
    expect(wrapper.state("totalTime")).toEqual(0);
  });

  it("Should display correct total time on update", async () => {
    const event = { target: { id: "intervalTimeMin", value: 5 } };
    const wrapper = shallow(<NewWorkoutPage />);

    await wrapper
      .find(Input)
      .at(2)
      .simulate("change", event);

    expect(wrapper.state("totalTime")).toEqual(300);
  });

  it("Should display correct total time on update", async () => {
    const eventMin = { target: { id: "intervalTimeMin", value: 5 } };
    const eventSec = { target: { id: "intervalTimeSec", value: 30 } };
    const wrapper = shallow(<NewWorkoutPage />);

    await wrapper
      .find(Input)
      .at(2)
      .simulate("change", eventMin);

    await wrapper
      .find(Input)
      .at(2)
      .simulate("change", eventSec);

    expect(wrapper.state("totalTime")).toEqual(330);
  });
});

describe("Tests for form submission", () => {
  it("Should update app state with workout data", async () => {
    const event = { preventDefault: function() {} };
    const history = { push: jest.fn() };
    const reduxSpy = jest.fn(() => {
      return Promise.resolve("ok");
    });
    const wrapper = shallow(
      <NewWorkoutPage
        history={history}
        tryStartWorkout={reduxSpy}
        token={"token"}
      />
    );
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, "handleSubmit");

    wrapper.setState({
      numberInterval: 1,
      intervalTimeMin: 1,
      intervalTimeSec: 0,
      restTimeMin: 0,
      restTimeSec: 30
    });

    wrapper.find(Form).simulate("submit", event);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(reduxSpy).toHaveBeenCalledWith(
      {
        interval_length: 60,
        num_of_intervals: 1,
        recording_date: expect.any(String),
        rest_time: 30,
        workout_length: 60
      },
      "token"
    );
    await Promise.resolve();
    expect(history.push).toHaveBeenCalledWith("/workouts/newRecording");
  });

  it("should set state of error message if total workout time is 0", () => {
    const event = { preventDefault: function() {} };
    const wrapper = shallow(<NewWorkoutPage />);
    wrapper.find(Form).simulate("submit", event);

    expect(wrapper.state("errorMessage")).toEqual(
      "Total workout time must be greater than 0"
    );
  });

  it("should display error message if total workout time is 0 and submitted", () => {
    const event = { preventDefault: function() {} };
    const wrapper = shallow(<NewWorkoutPage />);
    wrapper.find(Form).simulate("submit", event);

    expect(
      wrapper.contains("Total workout time must be greater than 0")
    ).toEqual(true);
  });
});

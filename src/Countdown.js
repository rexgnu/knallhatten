import React, { Component } from "react";
import knallis from "./knallis.svg";
import "./Countdown.css";

const length = {
  sec: 1000,
  min: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
  week: 1000 * 60 * 60 * 24 * 7,
  pregnancy: 1000 * 60 * 60 * 24 * 7 * 40,
};

function sliceFactory(millisecs) {
  const days = Math.floor(millisecs / length.day);
  const hours = Math.floor(millisecs / length.hour);
  const minutes = Math.floor(millisecs / length.min);
  const seconds = Math.floor(millisecs / length.sec);

  return {
    days,
    hours: hours - days * 24,
    minutes: minutes - hours * 60,
    seconds: seconds - minutes * 60,
    thousands: millisecs - seconds * 1000,
    week: Math.floor(days / 7),
    weekDay: days % 7
  };
};

class Countdown extends Component {
  calculate() {
    const now = new Date();
    const delivery = Date.parse(this.props.delivery);
    const complete = length.pregnancy;
    const remainder = delivery - now;
    const progress = length.pregnancy - remainder;
    const timer = {
      complete: sliceFactory(complete),
      remainder: sliceFactory(remainder),
      progress: sliceFactory(progress)
    };

    return {
      timer,
      complete,
      remainder,
      progress,
      percentage: parseFloat(
        (1 - remainder / complete) * 100
      ).toFixed(2)
    };
  }

  state = this.calculate();

  constructor(props) {
    super(props);
    this.meter = React.createRef();
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.setState(this.calculate());
    }, 1000);
    this.updateProgress();
    console.log(this.state);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateProgress() {
    const { complete, remainder } = this.state;
    const percentage = remainder / complete;
    const node = this.meter.current;

    // Get the length of the path
    const length = node.getTotalLength();

    // Calculate the percentage of the total length
    const to = length * percentage;

    // Trigger Layout in Safari hack https://jakearchibald.com/2013/animated-line-drawing-svg/
    node.getBoundingClientRect();

    // Set the Offset
    node.style.strokeDashoffset = Math.max(0, to);
  }

  render() {
    const { timer, percentage } = this.state;

    const size = 0 + 67 * (percentage / 100);

    return (
      <div className="Countdown">
      {this.props.delivery}
        <div className="Progressbar">
          <svg viewBox="0 0 200 200">
            <path
              className="bg"
              stroke="#839C60"
              d="M41 149.5a77 77 0 1 1 117.93 0"
              fill="none"
            />
            <path
              ref={this.meter}
              className="meter"
              stroke="#cff599"
              d="M41 149.5a77 77 0 1 1 117.93 0"
              fill="none"
              strokeDasharray="350"
              strokeDashoffset="350"
            />
          </svg>
          <div className="Spinner">
            <img
              src={knallis}
              alt="knallis"
              style={{ width: `${size}%`, height: "100%" }}
            />
          </div>
        </div>
        <div className="Statistics">
          <div className="Counter">
            <div>
              {timer.progress.week}
              {" "}+{" "}
              {timer.progress.weekDay} {" "}
              <span> week</span>
            </div>
          </div>
          <hr style={{ width: "40%" }} />
          <div className="Counter">
            <div>
              {percentage}
              <span> %</span>
            </div>
          </div>
          <hr style={{ width: "60%" }} />
          <div className="Counter">
            <div>
              {timer.remainder.days}
              <span> days</span>
            </div>
            <div>
              {timer.remainder.hours}
              <span> hours</span>
            </div>
            <div>
              {timer.remainder.minutes}
              <span> minutes</span>
            </div>
            <div>
              {timer.remainder.seconds}
              <span> seconds</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Countdown;

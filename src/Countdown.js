import React, { Component } from "react";
import knallis from "./knallis.svg";
import "./Countdown.css";

class Countdown extends Component {
  calculate() {
    const now = new Date();
    const inception = Date.parse(this.props.inception);
    const delivery = Date.parse(this.props.delivery);

    const duration = {
      complete: delivery - inception,
      left: delivery - now,
      progress: delivery - inception - (delivery - now)
    };

    const length = {
      day: 1000 * 60 * 60 * 24,
      hour: 1000 * 60 * 60,
      min: 1000 * 60,
      sec: 1000
    };

    const sliceFactory = duration => {
      const total = {
        days: Math.floor(duration / length.day),
        hours: Math.floor(duration / length.hour),
        minutes: Math.floor(duration / length.min),
        seconds: Math.floor(duration / length.sec)
      };

      return {
        days: total.days,
        hours: total.hours - total.days * 24,
        minutes: total.minutes - total.hours * 60,
        seconds: total.seconds - total.minutes * 60,
        thousands: duration - total.seconds * 1000,
        week: Math.floor(total.days / 7),
        weekDay: total.days % 7
      };
    };

    const timer = {
      complete: sliceFactory(duration.complete),
      left: sliceFactory(duration.left),
      progress: sliceFactory(duration.progress)
    };

    return {
      timer,
      duration,
      percentage: parseFloat(
        (1 - duration.left / duration.complete) * 100
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
    const { duration } = this.state;
    const percentage = duration.left / duration.complete;
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
              {timer.left.days}
              <span> days</span>
            </div>
            <div>
              {timer.left.hours}
              <span> hours</span>
            </div>
            <div>
              {timer.left.minutes}
              <span> minutes</span>
            </div>
            <div>
              {timer.left.seconds}
              <span> seconds</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Countdown;

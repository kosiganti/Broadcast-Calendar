import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { RadioGroup, RadioButton } from 'react-toolbox/lib/radio';
import moment from 'moment';

import styles from './style.scss';
import theme from './theme.scss';

import { events } from 'react-toolbox/lib/utils';
import { Input } from 'react-toolbox/lib/input';

import { DateRange } from 'react-date-range';

class BroadcastCalendar extends React.Component {
  constructor (props) {
    super(props);
    this.moment = moment;
    this.state = {
      dateType         : 'broadcastDay',
      isCalendarActive : false,
      startDate        : this.props.valueLink ? this.props.valueLink.value : this.props.value,
      endDate          : this.props.valueLink ? this.props.valueLink.value : this.props.value,
      value            : this.moment().format('MMM.DD, YYYY')
    };
  }

  /** Handle showing the calendar/input and clicking away from the calendar/input **/
  componentDidMount () {
    events.addEventsToDocument({ click: this.handleDocumentClick });
  }

  componentWillUnmount () {
    events.removeEventsFromDocument({ click: this.handleDocumentClick });
  }

  /** Event Handlers **/
  handleDocumentClick = (event) => {
    if (this.state.isCalendarActive && !events.targetIsDescendant(event, ReactDOM.findDOMNode(this))) {
      this.setState({ ...this.state, isCalendarActive: false });
    }
  };

  onInputFocus = () => {
    this.setState({ ...this.state, isCalendarActive: true });
  };

  // Hide the calendar on cntrl key presses
  onInputKeyDown = (event) => {
    [ 9, 13, 27 ].some((code) => event.keyCode === code) && this.setState({ ...this.state, isCalendarActive: false });
  };

  handleChangeInDateType = (type) => {
    this.setState({ ...this.state, dateType : type});
  };

  getBroadcastWeekNumber = (selectedDate) => {
    let firstSundayOfYear = this.moment(selectedDate).startOf('year').endOf('isoWeek');
    let temp = firstSundayOfYear.clone();
    let count = 1;

    while (!this.moment(selectedDate).startOf('week').isSame(temp, 'day')) {
      count++;
      temp = this.moment(temp).add(7, 'days');
    }

    return count;
  };

  returnCorrectDate = (date, type, dateRange) => {
    if ( (this.state.dateType === 'broadcastMonth' || this.state.dateType === 'broadcastQuarter') && this.moment(dateRange.endDate).endOf('month').day() !== 0 ) {
      return this.moment(date).startOf(type).add(1, 'week');
    } else return this.moment(date).startOf(type);
  };

  setStartDate = (dateRange) => {
    let type = this.state.dateType === 'broadcastWeek' ? 'isoWeek' : 'day';

    //Case1: When a date is selected in the past
    if ( this.moment(this.state.startDate).isAfter(dateRange.startDate, type) ) {
      console.log("past");
      return this.returnCorrectDate(dateRange.startDate, type, dateRange);
    }
    //Case2: When a date is selected in the future
    if ( this.moment(this.state.endDate).isBefore(dateRange.endDate, type) ) {
      console.log("future");
      return this.returnCorrectDate(dateRange.endDate, type, dateRange);
    }
    //Case3: When a date is selected in the same range again
    if ( this.moment(dateRange.startDate).isBetween(this.moment(this.state.startDate), this.moment(this.state.endDate), 'day', '[]') ) {
      console.log("present");
      return this.returnCorrectDate(dateRange.endDate, type, dateRange);
    }
  };

  reRender = (dateRange) => {
    this.setState({ ...this.state,
      startDate : this.moment(dateRange.startDate).add(1, 'days'),
      endDate : this.moment(dateRange.endDate).add(1, 'days')
    });
  };

  handleChangeInDateRange = (dateRange) => {
    let dateType = this.state.dateType;
    let finalDateRange = {};
    let temp;

    switch (dateType) {
      case 'broadcastDay' : 
        temp = this.setStartDate(dateRange);
        finalDateRange.startDate = this.moment(temp);
        finalDateRange.endDate = finalDateRange.startDate;
        finalDateRange.value = this.moment(finalDateRange.startDate).format('MMM.DD, YYYY');
        break;
      case 'broadcastWeek' :
        temp = this.setStartDate(dateRange);
        finalDateRange.startDate = this.moment(temp).startOf('isoWeek');
        finalDateRange.endDate = this.moment(temp).endOf('isoWeek');
        finalDateRange.value = 'Week '.concat(this.getBroadcastWeekNumber(finalDateRange.endDate), '(', this.moment(finalDateRange.startDate).format('MMM.DD'), ' - ', this.moment(finalDateRange.endDate).format('MMM.DD'), ')');
        break;
      case 'broadcastMonth' :
        temp = this.setStartDate(dateRange);
        finalDateRange.startDate = this.moment(temp).startOf('month').startOf('isoWeek');
        finalDateRange.endDate = this.moment(temp).endOf('month').startOf('week');
        finalDateRange.value = this.moment(temp).format('MMMM, YYYY');
        break;
      case 'broadcastQuarter' :
        temp = this.setStartDate(dateRange);
        finalDateRange.startDate = this.moment(temp).startOf('quarter').startOf('isoWeek');
        finalDateRange.endDate = this.moment(temp).endOf('quarter').startOf('week');
        finalDateRange.value = 'Q'.concat(this.moment(temp).quarter(), ' ', this.moment(temp).year());
        break;
      case 'customPeriod' :
        finalDateRange.startDate = dateRange.startDate;
        finalDateRange.endDate = dateRange.endDate;
        finalDateRange.value = this.moment(finalDateRange.startDate).format('MMM.DD, YYYY').concat(' - ', this.moment(finalDateRange.endDate).format('MMM.DD, YYYY'));
        break;
    };

    this.reRender(dateRange);

    setTimeout(() => {
      this.setState({ ...this.state, startDate : finalDateRange.startDate, endDate : finalDateRange.endDate, value : finalDateRange.value});
    }, 10);
  };

  renderDateRangePicker () {
    if (!this.state.isCalendarActive) {
      return null;
    }

    return (
      <DateRange
      className='calendar'
      startDate={ this.state.startDate }
      endDate={ this.state.endDate }
      format={ this.props.format }
      maxDate={ this.props.maxDate }
      minDate={ this.props.minDate }
      linkedCalendars={ this.props.linkedCalendars }
      calendars={ this.props.calendars }
      twoStepChange={ this.props.twoStepChange }
      firstDayOfWeek={ 1 }
      linkedCalendars={ true }
      theme={
        {
          DateRange      : {
            background   : '#ffffff'
          },
          Calendar       : {
            background   : 'transparent',
            color        : '#95a5a6',
          },
          MonthAndYear   : {
            background   : '#ffffff',
            color        : '#000000'
          },
          Day            : {
            color        : '#000000',
            transition   : 'transform .1s ease, box-shadow .1s ease, background .1s ease'
          },
          DaySelected    : {
            background   : '#03A9F4'
          },
          DayActive    : {
            background   : '#03A9F4',
            boxShadow    : 'none'
          },
          DayInRange     : {
            background   : '#03A9F4',
            color        : '#fff',
            borderLeft   : 'none'
          },
          DayHover       : {
            background   : '#81D4FA',
            color        : '#ffffff',
            boxShadow    : '0px'
          }
        }
      }
      onChange={ this.handleChangeInDateRange.bind(this) }
      />
    );
  };

  renderRadioBoxes () {
    if (!this.state.isCalendarActive) {
      return null;
    }

    return (
      <RadioGroup name='dateType' value={ this.state.dateType } onChange={ this.handleChangeInDateType.bind(this) }>
        <RadioButton label='Broadcast Day' value='broadcastDay'/>
        <RadioButton label='Broadcast Week' value='broadcastWeek'/>
        <RadioButton label='Broadcast Month' value='broadcastMonth'/>
        <RadioButton label='Broadcast Quarter' value='broadcastQuarter'/>
        <RadioButton label='Custom Period' value='customPeriod'/>
      </RadioGroup>
    );
  };

  renderInput () {
    return (
      <Input
        type='text'
        value={ this.state.value }
        theme={ this.props.theme || theme }
        required={ this.props.required }
        label={ this.props.label }
        disabled={ this.props.disabled }
        onFocus={ this.onInputFocus }
        onKeyDown={ this.onInputKeyDown }
      />
    );
  }

  render() {
    return (
      <div>
        { this.renderInput() }
        <table>
          <tbody>
            <tr>
              <td>
                { this.renderRadioBoxes() }
              </td>
              <td>
                { this.renderDateRangePicker() }
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };
}

BroadcastCalendar.contextTypes = {
  showFormErrors: PropTypes.bool
};

export { BroadcastCalendar }
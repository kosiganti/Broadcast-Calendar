import React from 'react';
import * as enzyme from 'enzyme';

import { BroadcastCalendar } from './index';
import Link from 'valuelink';

describe('<BroadcastCalendar />', function () {

  it('renders', function () {
    const $comp = enzyme.shallow(<BroadcastCalendar />);
    expect($comp.exists()).toBe(true);
  });

  it('hides the Calendar when the user presses the tab/esc/enter keys', function () {
    let $comp = enzyme.mount(<BroadcastCalendar format="MM/DD/YYYY" value="10/10/2017" />);
    let $input = $comp.find('[data-react-toolbox="input"] input');

    $input.simulate('focus');
    expect($comp.state().isCalendarActive).toEqual(true);

    $input.simulate('keyDown', { keyCode: 9 });
    expect($comp.state().isCalendarActive).toEqual(false);

    $input.simulate('focus');
    expect($comp.state().isCalendarActive).toEqual(true);

    $input.simulate('keyDown', { keyCode: 13 });
    expect($comp.state().isCalendarActive).toEqual(false);

    $input.simulate('focus');
    expect($comp.state().isCalendarActive).toEqual(true);

    $input.simulate('keyDown', { keyCode: 27 });
    expect($comp.state().isCalendarActive).toEqual(false);
  });

  it('hides the Calendar when the user clicks outside the component', function () {
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb;
    });

    let $comp = enzyme.mount(<BroadcastCalendar format="MM/DD/YYYY" value="10/10/2017" />);
    let $input = $comp.find('[data-react-toolbox="input"] input');

    $input.simulate('focus');
    expect($comp.state().isCalendarActive).toEqual(true);

    // Simulate clicking outside the component
    map.click({ target: document }, $comp);

    expect($comp.state().isCalendarActive).toEqual(false);
  });

  it('updates valueLinks when calendar date changes', function () {
    let vlink = new Link;
    vlink.set = jest.fn();

    let $comp = enzyme.mount(<BroadcastCalendar valueLink={ vlink } />);
    let $input = $comp.find('[data-react-toolbox="input"] input');

    // Open the calendar
    $input.simulate('focus');

    let $days = $comp.find('span .rdr-Day');
    $days.at(0).simulate('click');

    expect(vlink.set.mock.calls.length).toBe(1);
  });

  it('provides a context for showing errors',function(){
    let $comp = enzyme.mount(<BroadcastCalendar />, { context: {} });
    expect($comp.context('showFormErrors')).toBeFalsy();
    $comp.setContext({ showFormErrors: true });
    expect($comp.context('showFormErrors')).toBeTruthy();
  });


  it('mounting/unmount adds/removes the document click listener', function () {
    const map = {};
    document.addEventListener = jest.fn((event, cb) => {
      map[event] = cb
    });

    document.removeEventListener = jest.fn((event, cb) => {
      delete map[event];
    });

    expect(map.click).toBeUndefined();

    let $comp = enzyme.mount(<BroadcastCalendar />);

    expect(map.click).toBeDefined();
    $comp.unmount();
    expect(map.click).toBeUndefined();

  });
});
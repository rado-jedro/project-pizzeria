/* global flatpickr */
import BaseWidget from './BaseWidget.js';
import {utils} from '../utils.js';
import {select,settings} from '../settings.js';

/* Class DatePicker is an extension of class BaseWidget */
class DatePicker extends BaseWidget{
  constructor(wrapper){
  /*must have super() and refers to class BaseWidget */
    super(wrapper, utils.dateToStr(new Date()));

    const thisWidget = this;

    /* create attribute equal to single element find in thisWidget.dom.wrapper using selector save in widget. */
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    /* execute method initPlugin*/
    thisWidget.initPlugin();
  }

  initPlugin(){
    const thisWidget = this;

    thisWidget.minDate= new Date(thisWidget.value);
    thisWidget.maxDate = thisWidget.minDate + settings.datePicker.maxDaysInFutur;

    /* init pluging flatpickr*/
    /* flatpickr(element,options); */
    flatpickr(thisWidget.dom.input,{
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'locale': {
        'firstDayOfWeek': 1 // start week on Monday
      },
      'disable': [
        function(date) {
          return (date.getDay() === 1); //unable to select Monday
        }
      ],
      onChange: function(dateStr){
        thisWidget.value = dateStr;
      }
    });
  }

  parseValue(value){
    return value;
  }

  isValid(){
    return true;
  }

  renderValue(){

  }

}

export default DatePicker;

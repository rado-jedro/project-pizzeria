/* global rangeSlider */
import BaseWidget from './BaseWidget.js';
import {settings,select} from '../settings.js';
import {utils} from '../utils.js';

class HourPicker extends BaseWidget{
  constructor(wrapper){
    /*must have super() and refers to class BaseWidget */
    super(wrapper,settings.hours.open);

    const thisWidget = this;

    /* create attributes equal to single element find in thisWidget.dom.wrapper using selector saved in widget. */

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);

    thisWidget.initPlugin();
    thisWidget.value = thisWidget.dom.input.value;
  }

  initPlugin(){

    const thisWidget = this;
    rangeSlider.create(thisWidget.dom.input);

    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });
    console.log('thisWidget.value', thisWidget.value);

  }

  parseValue(value){
    return utils.numberToHour(value);

  }

  isValid(){
    return true;
  }

  renderValue(){
    const thisWidget = this;
    /* display widget value*/
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}
export default HourPicker;

import {templates,select} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';

class Booking {
  constructor(element){
    const  thisBooking = this;


    thisBooking.render(element);
    thisBooking.initWidgets();
  }

  render(element) {
    const thisBooking = this;

    /* generate html from template without argument*/
    const generatedHtml = templates.bookingWidget();
    //console.log('generated html', generatedHtml);
    /* create empty object thisBooking.dom */
    thisBooking.dom = {};
    console.log('thisBooking.dom', thisBooking.dom);
    /* save thisBooking.dom.wrapper to returned argument element*/
    thisBooking.dom.wrapper = element;

    /* changed wrapper to html code */
    thisBooking.dom.wrapper.innerHTML = generatedHtml;

    /* find single element for people amount */
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    console.log('peopleAmount', thisBooking.dom.peopleAmount);
    /* find single element for hours amount */
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    console.log('hoursAmount', thisBooking.dom.hoursAmount);

    //date selection task 10.3
    /* */
    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    console.log('thisBooking.dom.datePicker',thisBooking.dom.datePicker);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    console.log('thisBooking.datePicker',thisBooking.datePicker);
  }
}
export default Booking;

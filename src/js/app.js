import {settings,select,classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';

const app = {
  initPages: function(){
    const thisApp = this;

    /* get container of all children of pages container .children */
    thisApp.pages = document.querySelector(select.containerOf.pages).children;

    /*find all links */
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    thisApp.newNavLinks = document.querySelectorAll(select.newNav.newLinks);
    thisApp.headerLink = document.querySelectorAll(select.nav.logoLink);

    /* activate page of first subpage id*/
    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages[0].id;

    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    thisApp.activatePage(pageMatchingHash);
    /* addEventListener to link */

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get page id from href attribute */
        const id = clickedElement.getAttribute('href').replace('#',''); //.replace('#', '') -->> remove #*/
        /* run thisApp.activatePage with that id*/
        thisApp.activatePage(id);

        /* change URL hash */
        window.location.hash = '#/' + id;
      });
    }

    for (let link of thisApp.headerLink){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get id from href  .replace('#', '') will remove #*/
        const id = clickedElement.getAttribute('href').replace('#', '');
        /* run activatePage with href attribute */
        thisApp.activatePage(id);

        /* change urls hash */
        window.location.hash = '#/' + id;
      });
    }

    for (let link of thisApp.newNavLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /* get id from href  .replace('#', '') will remove #*/
        const id = clickedElement.getAttribute('href').replace('#', '');
        /* run activatePage with href attribute */
        thisApp.activatePage(id);

        /* change urls hash */
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    /*add class "active" to matching pages, remove from non-matching*/
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    /*add class "active" to matching links, remove from non-matching*/
    for(let link of thisApp.navLinks){
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }

  },
  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);

    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
    //const testProduct = new Product();
    //console.log('testProduct:', testProduct);
  },
  initData: function(){
    const thisApp = this;

    // thisApp.data = dataSource;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){

        /*save parsedResponse as thisApp.data.products */
        thisApp.data.products = parsedResponse;
        /* execuce initMenu method */
        thisApp.initMenu();
      });
  },
  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });

  },

  initBooking: function(){
    const thisApp = this;
    /*find booking container widget*/
    thisApp.bookingContainerWidget = document.querySelector(select.containerOf.booking);

    /* init new instance of class Booking with arg bookingContainerWidget*/
    thisApp.booking = new Booking(thisApp.bookingContainerWidget);

  },


  init: function(){
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    // thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
  },
};

app.init();


 var config = {
    apiKey: "AIzaSyD7SVoFE9rOmCa-dsncp2h5pgcBjlyYNQQ",
    authDomain: "reservation-site-ec.firebaseapp.com",
    databaseURL: "https://reservation-site-ec.firebaseio.com",
    projectId: "reservation-site-ec",
    storageBucket: "reservation-site-ec.appspot.com",
    messagingSenderId: "344147519268",
    appId: "1:344147519268:web:b89d18079ab709dfb4b5b1",
    measurementId: "G-G3CXTSKJF2"
  };
  // Initialize Firebase
  firebase.initializeApp(config);
 // firebase.analytics();
var database = firebase.database();

//------- STEP 2 -------

// create reservationData object which will be populated with user input
var reservationData = {};  //empty object literal where reservation data will be added

// ------- STEP 3 -------

//set the day when an option is clicked on
$('.reservation-day li').on('click', function() {
  reservationData.day = $(this).text();  //define property "day" on the reservationData object, which will have the value of the clicked element's text. This is where someone clicks/chooses a day from the drop-down menu
  $(".reservation-day li").removeClass("selected");
  $(this).addClass("selected");

});

// ------- STEP 4 -------

// when submitted, the "name" data should be set and all data should be sent to your database
$('.reservation-form').on('submit', function(e) {
  e.preventDefault();

  var resName = $('.reservation-name').val()

  reservationData.name = resName; // grabbing the name input and adding it to an object called reservationData

  $(".reservation-name").val("");  // empty name input 

// ------- STEP 5 --------

 if (resName === "") {   //form validation for name
    alert("Please enter your name.");
    
  };

    var resDay = $(".selected"); // looking to see if a day has been selected

    if (resDay === undefined) {
      alert("Please choose a day."); //** Day form validation not working
    };

  // create a section for reservations data in your db; and post from inside the form submit handler
  var reservationsReference = database.ref('reservations');

  reservationsReference.push(reservationData); //post or send the reservation "name" data to the database


});

//  ----- STEP 6 ------

// retrieve/fetch reservations data when page loads and when reservations are added
function getReservations() {

  // use reference to database to listen for changes in reservations data
  database.ref('reservations').on('value', function(results) {  //"value" is Firebase documentation that helps listen for data in the database

    // Get all reservations stored in the results we received back from Firebase
    var allReservations = results.val();

    // remove all list reservations from DOM before appending list reservations
    $('.reservation-list').empty();  //had used .reservations and the whole form would disappear upon loading the page, because I am calling this function every time the page loads. Needed to clear .reservation-List so reseravations don't double load with page reload
// ** reservation name is not clearing out
    // iterate (loop) through all reservations coming from database call
    for (var reservation in allReservations) {
    // Create an object literal with the data we'll pass to Handlebars
      var context = {
        name: allReservations[reservation].name,
        day: allReservations[reservation].day,
        reservationId: reservation
      };
    
	  
    var source = $("#reservation-template").html();
    
    var template = Handlebars.compile(source);
    
    var reservationListItem = template(context);
    
    $(".reservation-list").append(reservationListItem); //had .reservations and handlebars template data was overwriting the reservation form. Now the database info appears in the correct place on the web page!
    	
    };  // ** somehow every time a resrevation is added all the reservation data is loaded again instead of just the one instance of the new reservation. When I reload the page, its just one instannce of each reservation
  });

}

 // ---- STEPS 7, 8 & 9 ----

 //define the callback used by the Google Maps API to initialize the app's map. Use the Google Maps’ Map constructor to create a map.
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: {lat: 40.8054491, lng: -73.9654415},
    zoom: 10,
    scrollwheel: false
  });

  var marker = new google.maps.Marker ({
    position: {lat: 40.8054491, lng: -73.9654415},
    map: map,
    title: 'Monks Cafe'
  });

}

// When page loads, get reservations
getReservations();

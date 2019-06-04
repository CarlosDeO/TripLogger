'use strict'

let tripId 
function watchlandingPage() {
    $('#start-button').click(event => {
        $('.header-content').hide();
        $('main').html(`
        <div class="signin-register">

            <form class="signin-form">
            <h2 class="header">Log In</h2>
            <input class="form-input"id="username" type="text" name="username" placeholder="Username"/><br /><br />
            <input class="form-input" id="password" type="password" name="password" placeholder="Password" /><br /><br />
            <button class="login-button"type="submit">Log In</button><br /><br />
            
            Don't have account?<a href="/register.html" class="register" style="font-family:'Play', sans-serif;">&nbsp;Sign Up</a>
            
            </form>
            </div>`);
    });
$("#demo-button").click(event => {
    fetch('/api/auth/login', {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: "demo1",
            password: "demo123456"
        })
    })
    .then(response => response.json())
    .then(data => {
        localStorage.authToken = data.authToken
        window.location = 'trips.html'
    })
});
}


function watchLoginForm() {
    $('body').on('submit', '.signin-form', event => {
        console.log('clicked');
        event.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        fetch('/api/auth/login', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password
                })
            })
            .then(response => response.json())
            .then(data => {
                localStorage.authToken = data.authToken
                window.location = 'trips.html'
            })
    });
}

function watchRegisterForm() {
    $('.register-form').submit(event => {
        event.preventDefault();
        const username = $('#userName').val();
        const password = $('#password').val();
        const firstName = $('#firstName').val();
        const lastName = $('#lastName').val();
        fetch('/api/users', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    firstName,
                    lastName,
                    password
                })
            })
            .then(response => response.json())
            .then(data => {
                fetch('/api/auth/login', {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username,
                        password
                    })
                })
                .then(response => response.json())
                .then(data => {
                    localStorage.authToken = data.authToken
                    window.location = 'trips.html'
                })
            })
    })
}


function addNewtrip() {
    $('.trip-button').click(function (event) {
        console.log("clicked");
        $('.pageintro').hide();
        $('.logo').hide();
        $('.trip-form').show();
    });
}

function submitTrip() {
    $('body').on('submit', '.tripForm', event => {
        event.preventDefault();
        console.log('submit');
        const tripName = $('#tripName').val();
        const boarding = $('#boarding').val();
        const departure = $('#departure').val();
        const arrival = $('#arival').val();
        const terminal = $('#terminal').val();
        const gate = $('#gate').val();
        const hotelName = $('#hotelName').val();
        const building = $('#building').val();
        const street = $('#street').val();
        const zipcode = $('#zipcode').val();
        const checkIn = $('#check-in').val();
        const checkOut = $('#check-out').val();
        const carRental = $('#carRental-name').val();
        const confirmation = $('#confirmation').val();
        const activeName = $('#activeName').val();
        const activeDate = $('#activeDate').val();
        const activeTime = $('#activeTime').val();
        const tripObj = {
            tripName,
            flightInfo: {
                boarding,
                departure,
                arrival,
                terminal,
                gate
            },
            hotelInfo: {
                name: hotelName,
                address: {
                    building,
                    street,
                    zipcode
                },
                checkIn,
                checkOut
            },
            carRental: {
                name: carRental,
                confNumber: confirmation
            },
            activities: [{
                name: activeName,
                date: activeDate,
                time: activeTime
            }]
        }

       if (tripId) {
        tripObj.id = tripId
        fetch(`/api/trips/${tripId}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "bearer " + localStorage.authToken
                },
                body: JSON.stringify(tripObj)
            })
            .then(() => window.location = "profile.html")
        }
        else {
            fetch('/api/trips', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "bearer " + localStorage.authToken
                },
                body: JSON.stringify(tripObj)
            })
            .then(response => response.json())
            .then(() => window.location = "profile.html")
        }
    });
}

function loadTripById() {
    const split = window.location.href.split("=") 
    if (split.length == 1) {
        return 
    }
    const id = split[1]
    tripId = id;
    console.log(id);
    fetch(`/api/trips/${id}`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
            authorization: "bearer " + localStorage.authToken
        }
    })
    .then(response => response.json())
    .then(trip => {
        $('.logo').hide();
        $('.pageintro').hide();
        $('.trip-form').show();
        $('#tripName').val(trip.tripName);
        $('#boarding').val(trip.flightInfo.boarding);
        $('#departure').val(trip.flightInfo.departure);
        $('#arival').val(trip.flightInfo.arrival);
        $('#terminal').val(trip.flightInfo.terminal);
        $('#gate').val(trip.flightInfo.gate);
        $('#hotelName').val(trip.hotelInfo.name);
        $('#building').val(trip.hotelInfo.address.building);
        $('#street').val(trip.hotelInfo.address.street);
        $('#zipcode').val(trip.hotelInfo.address.zipcode);
        $('#check-in').val(trip.hotelInfo.checkIn);
        $('#check-out').val(trip.hotelInfo.checkOut);
        $('#carRental-name').val(trip.carRental.name);
        $('#confirmation').val(trip.carRental.confNumber);
        // const activeName = $('#activeName').val();
        // const activeDate = $('#activeDate').val();
        // const activeTime = $('#activeTime').val();
    })
}

function handleApp() {
    watchRegisterForm();
    watchLoginForm();
    addNewtrip();
    watchlandingPage();
    submitTrip();
    loadTripById();
}

$(handleApp);
$(document).ready(function(){
  // console.log('Hello world!')
  renderCalendar()
  setListeners()
})

var bookings

function renderCalendar(){
  getBookings()
  setCurrentMonth()
  var current = moment()
  var daysAhead = moment().date(1).day()
  for(i = 0; i < 35; i++) {
    var iDay = moment().date(2 - daysAhead + i).date()
    var iMonth = moment().date(2 - daysAhead + i).month()
    var cellId = '#d' + i
    if( (iMonth !== current.month()) || iDay < current.date() ){
      setCell(cellId, iDay, 'unavailable')
    } else if(iDay === current.date() && iMonth === current.month()) {
      setCell(cellId, iDay, 'today')
    } else {
      setCell(cellId, iDay)
    }
  $(cellId).data('date', moment().date(2 - daysAhead + i).format())
  }
}

function setCell(id, date, status, bookings){
  var contents = $(id).html()
  if(!status){
    contents += '<span class="date-label">' + date + '</span>'
  } else {
    contents += '<span class="date-label ' + status + '">' + date + '</span>'
  }
  // contents += '<div class="chip right amber darken-2">1</div>'
  // contents += '<div class="chip right green accent-2">2</div>'
  $(id).html(contents)
}

function setCurrentMonth() {
  var thisMonth = moment().format('MMMM')
  $('#month').text(thisMonth)
}

function getBookings(){
  $.get('/bookings')
  .done(function(data){
    bookings = data
    renderBookings()
  })
}

function renderBookings(){
    var currentUser = bookings.user
  $.each(bookings.data, function(index, booking){
    var bookingDate = booking.date
    bookingDate = bookingDate.slice(0, bookingDate.indexOf('T'))
    var bookingUser = booking.user1[0]._id
    $('.date-label').parent().each(function(index, cell){
      var cellDate = $(cell).data('date')
      cellDate = cellDate.slice(0, cellDate.indexOf('T'))  
      if(cellDate === bookingDate){
        var contents = $(cell).html()
        if(currentUser === bookingUser) {
          contents += '<div class="chip right amber darken-2">1</div>'
        } else {
          contents += '<div class="chip right green accent-2">1</div>'
        }
        $(cell).html(contents)
      }
    })

  })
}

function setListeners(){
  $('#mode-switch').on('change', toggleMode)
}

function toggleMode(){
  if ($('#mode-switch').is(':checked')){
    // Set availibility
    $('#show-me').toggleClass('red-text', true)
    $('#show-them').toggleClass('red-text', false)
    $('td').on('click', function(){
      setAvailibility($(this).find('.date-label').text())
    })
  } else {
    // View availibility
    $('#show-me').toggleClass('red-text', false)
    $('#show-them').toggleClass('red-text', true)
    $('td').off('click')
  }
}

function setAvailibility(day){
  var selectedDate = moment().date(day).format()
  $.post('/availibility', {date: selectedDate})
    .done(function(data){
      console.log(data)
    })
}
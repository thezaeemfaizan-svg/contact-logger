const bookingForm = document.getElementById('bookingForm');
const customerName = document.getElementById('customerName');
const customerPhone = document.getElementById('customerPhone');
const serviceType = document.getElementById('serviceType');
const bookingDate = document.getElementById('bookingDate');
const bookingTime = document.getElementById('bookingTime');
const bookingNotes = document.getElementById('bookingNotes');
const summaryService = document.getElementById('summaryService');
const summaryDetails = document.getElementById('summaryDetails');

function formatFriendlyDate(rawDate) {
  if (!rawDate) return 'Select date';

  const date = new Date(`${rawDate}T00:00:00`);
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatTime(rawTime) {
  if (!rawTime) return 'Flexible timing';

  const [hours, minutes] = rawTime.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function updateBookingSummary() {
  const selectedService = serviceType.value;
  const selectedDate = formatFriendlyDate(bookingDate.value);
  const selectedTime = formatTime(bookingTime.value);
  summaryService.textContent = selectedService;
  summaryDetails.textContent = `${selectedDate} • ${selectedTime}`;
}

if (bookingDate) {
  const now = new Date();
  const minDate = now.toISOString().split('T')[0];
  bookingDate.min = minDate;
}

serviceType.addEventListener('change', updateBookingSummary);
bookingDate.addEventListener('input', updateBookingSummary);
bookingTime.addEventListener('input', updateBookingSummary);

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = customerName.value.trim() || 'Guest';
  const phone = customerPhone.value.trim() || 'Phone number not provided';
  const selectedService = serviceType.value;
  const dateValue = bookingDate.value || 'ASAP';
  const timeValue = bookingTime.value || 'Flexible';
  const notes = bookingNotes.value.trim() || 'No additional notes.';

  const bookingText = `Hello Jugnu's Salon, I would like to book the following appointment:\n\nName: ${name}\nPhone: ${phone}\nService: ${selectedService}\nDate: ${dateValue}\nTime: ${timeValue}\nNotes: ${notes}`;

  const whatsappLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(bookingText)}`;
  const calendarStart = new Date(`${dateValue}T${timeValue || '10:00'}:00`);
  const calendarEnd = new Date(calendarStart.getTime() + 60 * 60 * 1000);

  const toCalendarIso = (value) =>
    value.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');

  const calendarLink =
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Jugnu\'s Salon Appointment')}&details=${encodeURIComponent(
      `Client: ${name}\nPhone: ${phone}\nService: ${selectedService}\nNotes: ${notes}`
    )}&location=${encodeURIComponent('P393+FPG Jinnah Super Market, Bhittai Rd, F-7 Markaz, Islamabad')}&dates=${toCalendarIso(
      calendarStart
    )}/${toCalendarIso(calendarEnd)}`;

  window.open(whatsappLink, '_blank', 'noopener,noreferrer');
  setTimeout(() => {
    window.open(calendarLink, '_blank', 'noopener,noreferrer');
  }, 250);

  summaryService.textContent = selectedService;
  summaryDetails.textContent = `${formatFriendlyDate(dateValue)} • ${formatTime(timeValue)} • Booking request sent`;
  bookingForm.reset();
  updateBookingSummary();
});

updateBookingSummary();

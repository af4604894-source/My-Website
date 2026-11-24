document.addEventListener("DOMContentLoaded", () => {
  const eventPrices = {
    summit: 85,
    workshop: 45,
    concert: 60,
  };

  const seats = document.querySelectorAll(".seat");
  const seatCodeInput = document.getElementById("seatCode");
  const selectedEventSelect = document.getElementById("selectedEvent");
  const calcScreen = document.querySelector(".calc-value");
  const calcButtons = document.querySelectorAll(".calc-btn");
  const bookingForm = document.querySelector(".booking-form");
  const bookingsTableBody = document.querySelector(".bookings-table tbody");

  let calcExpression = "";

  function updateBookingSummary() {
    const selectedSeats = document.querySelectorAll(".seat.selected");
    const seatNames = Array.from(selectedSeats).map((seat) =>
      seat.textContent.trim()
    );

    seatCodeInput.value = seatNames.join(", ");

    const currentEvent = selectedEventSelect.value;
    const ticketPrice = eventPrices[currentEvent] || 0;
    const total = seatNames.length * ticketPrice;

    calcScreen.textContent = `$${total}`;
    calcExpression = total.toString();
  }

  seats.forEach((seat) => {
    seat.addEventListener("click", () => {
      if (seat.classList.contains("booked")) return;
      seat.classList.toggle("selected");
      seat.classList.toggle("available");
      updateBookingSummary();
    });
  });

  selectedEventSelect.addEventListener("change", updateBookingSummary);

  const bookNowBtns = document.querySelectorAll(".btn-card");
  const eventValues = ["summit", "workshop", "concert"];
  bookNowBtns.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      if (eventValues[index]) {
        selectedEventSelect.value = eventValues[index];
        updateBookingSummary();
      }
    });
  });

  calcButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const value = btn.textContent.trim();

      if (value === "C") {
        calcExpression = "";
        calcScreen.textContent = "$0";
      } else if (value === "=") {
        try {
          const cleanExpr = calcExpression.replace(/\$/g, "");
          if (cleanExpr) {
            const result = Function(`"use strict"; return (${cleanExpr})`)();
            calcExpression = Number.isInteger(result)
              ? result.toString()
              : result.toFixed(2);
            calcScreen.textContent = `$${calcExpression}`;
          }
        } catch {
          calcScreen.textContent = "Error";
          calcExpression = "";
        }
      } else {
        if (calcScreen.textContent === "$0" && !isNaN(value)) {
          calcExpression = value;
        } else {
          calcExpression += value;
        }
        calcScreen.textContent = calcExpression;
      }
    });
  });

  let bookingCounter = 104; 

  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("attendeeName").value.trim();
    const email = document.getElementById("attendeeEmail").value.trim();
    const seatsText = seatCodeInput.value.trim();
    const eventFullText =
      selectedEventSelect.options[selectedEventSelect.selectedIndex].text.split(
        " ("
      )[0];

    if (!name || !email) {
      alert("Please enter your full name and email address.");
      return;
    }

    if (!seatsText) {
      alert("Please select at least one seat from the layout.");
      return;
    }

    const selectedSeats = document.querySelectorAll(".seat.selected");
    selectedSeats.forEach((seat) => {
      seat.classList.remove("selected");
      seat.classList.add("booked");
    });

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>#BK-${bookingCounter++}</td>
      <td>${name}</td>
      <td>${eventFullText}</td>
      <td>${seatsText}</td>
      <td><span class="status-pill status-confirmed">Confirmed</span></td>
    `;
    bookingsTableBody.appendChild(newRow);

    alert(`Booking Confirmed for ${name}!\nSeats: ${seatsText}`);
    bookingForm.reset();
    seatCodeInput.value = "";
    calcScreen.textContent = "$0";
    calcExpression = "";
  });
});

'use strict';

// Wrapped so only DatePicker ends up on window.
(function () {
  const DAY_ABBREVIATIONS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Weeks of seven {year, month, day, inMonth}, Sunday first. Month is 0 based
  // like Date. No DOM in here.
  function buildMonthGrid(year, month) {
    // Day 0 of next month is the last of this one, so leap years need no rule.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();

    const weekCount = Math.ceil((firstWeekday + daysInMonth) / 7);

    // Back from the 1st to the Sunday the grid opens on.
    const cursor = new Date(year, month, 1 - firstWeekday);
    const weeks = [];

    for (let week = 0; week < weekCount; week++) {
      const days = [];
      for (let weekday = 0; weekday < 7; weekday++) {
        days.push({
          year: cursor.getFullYear(),
          month: cursor.getMonth(),
          day: cursor.getDate(),
          inMonth: cursor.getMonth() === month
        });
        cursor.setDate(cursor.getDate() + 1);
      }
      weeks.push(days);
    }

    return weeks;
  }

  class DatePicker {
    #id;
    #container;
    #onDateSelected;
    #year;
    #month;

    constructor(id, onDateSelected) {
      this.#id = id;
      this.#container = document.getElementById(id);
      this.#onDateSelected = onDateSelected;

      // On the div, not on the buttons or cells, because render() replaces those.
      this.#container.addEventListener('click', (event) => this.#handleClick(event));
    }

    // Only the month and year of the date are used.
    render(date) {
      this.#year = date.getFullYear();
      this.#month = date.getMonth();
      this.#draw();
    }

    #draw() {
      const header = document.createElement('div');
      header.className = 'datepicker-header';

      const title = document.createElement('span');
      title.className = 'datepicker-title';
      title.textContent = MONTH_NAMES[this.#month] + ' ' + this.#year;

      header.append(
        this.#createNavButton('<', -1, 'Previous month'),
        title,
        this.#createNavButton('>', 1, 'Next month')
      );

      const table = document.createElement('table');
      table.append(this.#createTableHead(), this.#createTableBody());

      this.#container.replaceChildren(header, table);
    }

    #createNavButton(label, step, ariaLabel) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.setAttribute('aria-label', ariaLabel);
      button.dataset.step = step;
      return button;
    }

    #createTableHead() {
      const head = document.createElement('thead');
      const row = document.createElement('tr');

      for (const abbreviation of DAY_ABBREVIATIONS) {
        const cell = document.createElement('th');
        cell.textContent = abbreviation;
        row.append(cell);
      }

      head.append(row);
      return head;
    }

    #createTableBody() {
      const body = document.createElement('tbody');

      for (const week of buildMonthGrid(this.#year, this.#month)) {
        const row = document.createElement('tr');

        for (const date of week) {
          const cell = document.createElement('td');
          cell.classList.add('day');
          if (!date.inMonth) {
            cell.classList.add('outside-month');
          }
          cell.dataset.day = date.day;
          cell.textContent = date.day;
          row.append(cell);
        }

        body.append(row);
      }

      return body;
    }

    #handleClick(event) {
      const target = event.target;

      if (target.dataset.step) {
        this.#shiftMonth(Number(target.dataset.step));
        return;
      }

      const isSelectable =
        target.classList.contains('day') && !target.classList.contains('outside-month');

      if (isSelectable) {
        this.#onDateSelected(this.#id, {
          month: this.#month + 1,
          day: Number(target.dataset.day),
          year: this.#year
        });
      }
    }

    // Month -1 and month 12 roll into the next year on their own.
    #shiftMonth(step) {
      this.render(new Date(this.#year, this.#month + step, 1));
    }
  }

  window.DatePicker = DatePicker;
})();

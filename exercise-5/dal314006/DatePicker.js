'use strict';

// Wrapped so the constants and the calendar helper stay out of the global
// scope. DatePicker has to be reachable from the script tag in
// datepicker.html, so that one name goes on window and nothing else does.
(function () {
  const DAY_ABBREVIATIONS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /**
   * Work out which dates belong on the grid for one month.
   *
   * Returns weeks of seven cells, each cell {year, month, day, inMonth},
   * running Sunday to Saturday. The first and last weeks usually spill into
   * the neighbouring months, and those cells come back with inMonth false.
   *
   * No DOM here, so the calculation can be checked on its own.
   *
   * @param {number} year
   * @param {number} month - 0 for January, the way Date counts.
   * @returns {Array<Array<{year: number, month: number, day: number, inMonth: boolean}>>}
   */
  function buildMonthGrid(year, month) {
    // Day 0 of the following month is the last day of this one, which is how
    // February gets 29 in a leap year without a rule about leap years.
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstWeekday = new Date(year, month, 1).getDay();

    // Four rows when a 28 day February starts on a Sunday, six when a long
    // month starts late in the week, five otherwise.
    const weekCount = Math.ceil((firstWeekday + daysInMonth) / 7);

    // Counting back from the 1st lands on the Sunday the grid starts from,
    // which may fall in the previous month or the previous year.
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

    /**
     * @param {string} id - id of the div to draw into.
     * @param {(id: string, selected: {month: number, day: number, year: number}) => void} onDateSelected
     */
    constructor(id, onDateSelected) {
      this.#id = id;
      this.#container = document.getElementById(id);
      this.#onDateSelected = onDateSelected;

      // One listener, on the div itself, attached once. render() replaces what
      // is inside the div, so a listener on a button or a cell would be thrown
      // away the first time anyone changed month.
      this.#container.addEventListener('click', (event) => this.#handleClick(event));
    }

    /**
     * Draw the month the given date falls in. The day of the month is ignored.
     *
     * @param {Date} date
     */
    render(date) {
      this.#year = date.getFullYear();
      this.#month = date.getMonth();
      this.#draw();
    }

    /** Build the header and the table, then swap them in. */
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
      table.append(this.#createHeadRow(), this.#createDayCells());

      this.#container.replaceChildren(header, table);
    }

    #createNavButton(label, step, ariaLabel) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.setAttribute('aria-label', ariaLabel);
      // Read on click, since a kept reference would go stale on the next render.
      button.dataset.step = step;
      return button;
    }

    #createHeadRow() {
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

    #createDayCells() {
      const body = document.createElement('tbody');

      for (const week of buildMonthGrid(this.#year, this.#month)) {
        const row = document.createElement('tr');

        for (const date of week) {
          const cell = document.createElement('td');
          cell.classList.add('day');
          if (!date.inMonth) {
            cell.classList.add('outside-month');
          }
          // The handler reads this rather than parsing the cell's text.
          cell.dataset.day = date.day;
          cell.textContent = date.day;
          row.append(cell);
        }

        body.append(row);
      }

      return body;
    }

    /**
     * Every click inside the div arrives here, from the two arrows and from
     * every cell in the table.
     */
    #handleClick(event) {
      const target = event.target;

      if (target.dataset.step) {
        this.#shiftMonth(Number(target.dataset.step));
        return;
      }

      // A dimmed day belongs to the month either side and is not a selection.
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

    /** Month -1 is December of the year before, month 12 is January of the next. */
    #shiftMonth(step) {
      this.render(new Date(this.#year, this.#month + step, 1));
    }
  }

  window.DatePicker = DatePicker;
})();

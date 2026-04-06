# finance-dashboard



Finance Dashboard UI


Overview

This project is a responsive finance dashboard UI built using HTML, CSS, Bootstrap, and Vanilla JavaScript. It was created to match the assignment requirements by showing income, expenses, balance trend, category-wise spending, transaction management, search/filter options, role-based UI behavior, and theme switching.

Features

- Summary cards for Total Balance, Income, and Expenses
- Time-based balance trend chart
- Category-wise expense chart
- Transaction table with date, category, description, type, and amount
- Search, filter, and sorting options
- Viewer and Admin role switch
- Add, edit, and delete transaction functionality
- Dark mode and light mode
  

Tech Stack

- HTML5
- CSS3
- Bootstrap 5
- Vanilla JavaScript
- Chart.js

Project Structure

finance-dashboard/
- index.html
- css/
  - style.css
  - responsive.css
- js/
  - data.js
  - state.js
  - utils.js
  - charts.js
  - render.js
  - events.js
  - main.js
- README.txt

How It Works

- The transaction data is stored in a JavaScript array.
- A central state object manages role, search text, filter value, sort order, theme, and transaction updates.
- Utility functions calculate balance, income, expense, monthly trend, category totals, and insights.
- Chart.js is used to display the charts.
- The table updates dynamically based on search, filter, and sorting.
- Admin users can add, edit, and delete transactions.
- Theme switching is handled using CSS variables and a data-theme attribute.


Deployment

This project is deployed on Netlify.

Live Link:
https://finance-daily-income-expense.netlify.app/

Deployment Steps Used:
- Created the final project files
- Tested the project locally
- Uploaded the project to Netlify
- Published the live site
- Verified the deployed link on browser

Future Improvements

- Add backend support
- Use real API data
- Add authentication
- Export transaction data
- Add more advanced filters


# TodoList

### Installation
1. Clone the repository
2. Run `npm install` to install dependencies
3. Start the application with `npm start`

### Dependencies
- `express` - Web framework for Node.js
- `moment` - JavaScript library for working with dates and times
- `body-parser` - middleware for parsing request bodies
- `path` - module for working with file paths
- `fs` - module for working with the file system

### Usage
### Api Endpoints
- The `/tasks` route with HTTP POST method allows you to add a new task to the system.
- The `/tasks/:id` route with HTTP PATCH method allows you to update a task by id.
- The `/tasks/:id` route with HTTP DELETE method allows you to delete a task by id.

### File Structure
- `app.js` - the main file that starts the server and handles requests
- `views/index.ejs` - the view for the homepage
- `data/tasks.json` - the file where tasks are stored

![image](https://user-images.githubusercontent.com/39243722/228525537-9a64f6af-8b19-44b1-a993-a8250e216d7c.png)

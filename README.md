# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot description"](https://github.com/danschae/tinyapp/blob/master/docs/urls_new_page.png)
!["screenshot description"](https://github.com/danschae/tinyapp/blob/master/docs/urls_page.png)
!["screenshot description"](https://github.com/danschae/tinyapp/blob/master/docs/edit_urls_page.png)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## How to Use
- Must first register or log in.
- Once logged in, you can shorten any link you want, and by doing http://localhost:8080/u/shortUrl (short URL is the url you shorted), you can access the desired webpage.
- You can also edit the long URL for any shortened URL, however you'll need to make sure it's a real URL or otherwise it is useless.

## IMPORTANT!!!!
- In the first release, as it is not connected to any server, it could potentially bug if you don't sign out before closing the app, please remember to sign out before closing it!!

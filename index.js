const express = require('express');
const app=express();
const port=4000;
const expressLayouts=require('express-ejs-layouts');
const path=require('path');
const cookieParser=require('cookie-parser');
const session=require("express-session");
const db=require('./config/mongoose')
const flash=require('connect-flash');
const customware=require('./config/middleware.js');


app.use(cookieParser());

// set up view engine

app.set('view engine','ejs');
app.set('views', './views');

//use express layouts

app.use(expressLayouts)


//use express session

app.use(session({
secret:"secret",
resave:true,
saveUninitialized:true,
})
)

// flash message

app.use(flash());

app.use(customware.setFlash);
//use assets folder

app.use(express.static(path.join(__dirname,'./assets')));

//make the uploads path avail to browser

app.use('/uploads/files/csv', express.static(__dirname + '/uploads/files/csv'));

//extract style and script from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// homepage route
app.use('/', require('./routes'));
// start server

app.listen(port,(error)=>{

    if(error){
        console.log(`express server error on port ${port}`);
    }

    else{
        console.log(`server running successfully ${port}`);
    }

})
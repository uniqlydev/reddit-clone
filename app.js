const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');


const app = express();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// Setting ejs as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/api',userRoutes);
app.use('/api',postRoutes);

const port = process.env.PORT || 8080;



app.get('/', (req, res) => {
    res.render('index');
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
const mongoose = require("mongoose");

mongoose.connect('seu mongo',
{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
    });
    mongoose.set('useCreateIndex', true);
module.exports = {mongoose};    

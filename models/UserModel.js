const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    nombres : {
        type: String,
        require: true
    }, 
    apellido_paterno: {
        type: String,
        require: true
    },
    apellido_materno : {
        type: String,
        require: true
    },
    domicilio: {
        type: String,
        require: true
    },
    correo_electrónico: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('User', UserSchema); 
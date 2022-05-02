const app = require('express')();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
const User = require('./models/UserModel');
var jwt = require('jsonwebtoken');

require('dotenv').config()

const errorMsj = msj => {
    return { err: true, msj }
};

// Modificar ulr de base de datos
const db_url = 'mongodb://localhost:27017/mavi';

app.use(bodyParser.json());

const authMiddleware = (req, res, next) => {
    try {
        var decoded = jwt.verify(req.body.token, process.env.PRIVATE_KEY);
        next();
    } catch(err) {
        // err
        res.json(errorMsj('Error. Token es Invalido o ha expirado'));
    }
};

async function connectDB() {
  await mongoose.connect(db_url);
}

connectDB().catch(err => console.log(err));

const port = process.env.PORT || 3000;


app.post('/register', (req, res) => {
    let payload = { 
        username: req.body.username,
    }
    // Genera token con el username y private key, expira en 1h
    let token = jwt.sign( payload, process.env.PRIVATE_KEY, { expiresIn: 60 * 60});
    res.json({token});
});


app.get('/usuarios', authMiddleware, async (req, res) => {
    let users = await User.find({});
    res.json(users);
});

app.post('/nuevo-usuario', authMiddleware, async(req, res) => {
    let new_user = new User(req.body);
    try {
        let user_saved = await new_user.save();
        res.json(user_saved);
    } catch (error) {
        res.json(errorMsj('Error al crear usuario'));
    }
});

app.put('/actualizar-usuario', authMiddleware, async (req, res) => {
    try {
        updated_item = req.body;
        let user_updated = await User.findOneAndUpdate({ _id: updated_item._id }, updated_item );
        res.json(user_updated);

    } catch (error) {
        res.json(errorMsj(error));
    }
});

app.delete('/eliminar-usuario', authMiddleware, async (req, res) => {
    try {
        User.deleteOne({ _id:  req.body._id}, function (err) {
            if (err) return res.json(err);
            // deleted at most one tank document
            return res.json({error: false, msj: 'Elemento borrado'});
        });
    }

    catch (error) {
        res.json(errorMsj(error));
    }
});

app.listen(port, () => {
    console.log(`Listening in port ${port}`);
});
const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.MONGO_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        },
        (err, res) => {
            if(err){
                console.log("ERROR AL CONECTAR");
                throw err;
            } 
            console.log('Db connected.');
        });

    } catch (error) {
        console.log(error);
        throw new Error('Error con la base de datos');
    }

}



module.exports = {
    dbConnection
}
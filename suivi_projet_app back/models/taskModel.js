const mongoose= require('mongoose');
const Projet = require('./projetModel');


const taskSchema= new mongoose.Schema({
    name: {
        type: String,
        
       
       
    },
    attachement:{
        type: String,
       
    },
    form:{
        type: mongoose.Schema.ObjectId,
        ref: 'Form',
        
    },
    status:{
        type: String,
        required: [true,'A task must have a status'],
        enum:{
            values: ['En Cours','En attente','Terminé','Bloqué'],
            message:'status is either : En Cours,En attente,Terminé,Bloqué'
        }
    },
    projet:{
        type: mongoose.Schema.ObjectId,
        ref: 'Projet',
        required: [true,'Task must belong to a projet']
    }
},
{
    toJSON:{virtuals: true},
    toObject:{virtuals: true},
});



taskSchema.index({projet: 1});
taskSchema.pre(/^findOneAnd/, async function (next) {
    this.r = await this.findOne();
    console.log(this.r);
    next();
});
const Task = mongoose.model('Task',taskSchema);
module.exports = Task;
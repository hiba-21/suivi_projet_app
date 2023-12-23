const mongoose= require('mongoose');


const projetSchema= new mongoose.Schema({


    name :{
        type:String,
    },

    date:{
        type: Date,
        default: Date.now(),
      
    },
    
    
},
{
    toJSON:{virtuals: true},
    toObject:{virtuals: true},
});
projetSchema.virtual('tasks',{
    ref: 'Task',
    foreignField:'projet',
    localField:'_id'
});
/*projetSchema.pre(/^find/,function (next) {
    this.populate({
        path:'tasks',
        select:'-__v'
    });
    next();
});*/




const Projet = mongoose.model('Projet',projetSchema);
module.exports =Projet;


const Projet = require('./../models/projetModel');
const catchAsync = require('./../utils/catchAsync');


 

exports.getAllProjets =catchAsync(async (req, res, next) => {
  const projets = await Projet.find().populate('tasks');;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: projets.length,
    data: {
      projets
    }
  });
});
  exports.getProjet = catchAsync(async (req,res,next)=>{
        
    const projet= await Projet.findById(req.params.id).populate('tasks');
    if(!projet){
      return  next(new AppError('No projet found with that Id',404));
    }
    res.status(200).json({
        status :'success',
       
        data :{
          projet 
        }
    });
try {
} catch (error) {
    res.status(404).json({
        status:'fail',
        message: error
    });
}


}) ;
  exports.createProjet =  catchAsync(async (req,res,next)=>{
    const newProjet= await Projet.create(req.body);

    res.status(201).json({
        status: 'success',
        data:{
            projet: newProjet
        }
    });
    
   
 
}) ;
  exports.updateProjet =catchAsync(async (req,res,next)=>{
  
    const projet = await Projet.findByIdAndUpdate(req.params.id,req.body,{
       new: true,
       runValidators : true
   });
   if(!projet){
       return  next(new AppError('No tour found with that Id',404));
     }
   res.status(200).json({
       status:'success',
       data:{
        projet
       }
   });
   try {
  } catch (error) {
   res.status(400).json({
       status:'fail',
       message: error
   })
  }}) ;
  exports.deleteProjet =catchAsync(async (req,res,next)=>{
   
 
    const projet = await Projet.findByIdAndDelete(req.params.id);
    if(!projet){
        return  next(new AppError('No tour found with that Id',404));
      }
   res.status(200).json({
       status:'success',
       data:{
        projet
       }
   });
   try {
  } catch (error) {
   res.status(400).json({
       status:'fail',
       message: error
   });
  }
}); 
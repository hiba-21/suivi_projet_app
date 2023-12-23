const Task = require('./../models/taskModel');
const catchAsync = require('./../utils/catchAsync');

exports.setProjetIds = (req,res,next)=>{
        //allow nested routes
        if (!req.body.projet) req.body.projet = req.params.projetId;
        
        next();

};

exports.getAllTasks =catchAsync(async (req, res, next) => {
    const tasks = await Task.find();
  
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tasks.length,
      data: {
        tasks
      }
    });
  });
exports.getTask = catchAsync(async (req,res,next)=>{
        
  const tasks= await Task.findById(req.params.id).populate('tasks');
  if(!tasks){
    return  next(new AppError('No Task found with that Id',404));
  }
  res.status(200).json({
      status :'success',
     
      data :{
        tasks 
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
exports.createTask =  catchAsync(async (req,res,next)=>{
      const newTask= await Task.create(req.body);
  
      res.status(201).json({
          status: 'success',
          data:{
              Task: newTask
          }
      });
       
  }) ;
  exports.deleteTask= catchAsync(async (req,res,next)=>{
   
 
    const task = await Task.findByIdAndDelete(req.params.id);
    if(!task){
        return  next(new AppError('No tour found with that Id',404));
      }
   res.status(200).json({
       status:'success',
       data:{
          task
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
exports.updateTask =catchAsync(async (req,res,next)=>{
  
  const task = await Task.findByIdAndUpdate(req.params.id,req.body,{
     new: true,
     runValidators : true
 });
 if(!task){
     return  next(new AppError('No tour found with that Id',404));
   }
 res.status(200).json({
     status:'success',
     data:{
      task
     }
 });
 try {
} catch (error) {
 res.status(400).json({
     status:'fail',
     message: error
 })
}}) ;
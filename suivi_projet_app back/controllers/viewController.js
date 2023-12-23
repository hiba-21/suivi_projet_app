const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const Projet =require('./../models/projetModel');

exports.getLoginForm=(req,res)=>{
     
    
        res.status(200).render('login',{
            title: 'Log into your account',
           
        });
};


exports.getOverview =catchAsync(async(req,res,next)=>{
    //1 get tour data from collection
        const projets = await Projet.find().populate({
            path:'tasks',
            fields:'name status'
        });
  

    //2 build template
    //3 render template using tour data from 1
        res.status(200).render('report',{
            title: 'All Projets',
            projets :projets
        });
    });
exports.getAccount=(req,res)=>{
        res.status(200).render('account',{
            title: 'Your account',
           
        });
    };
    exports.updateUserData=catchAsync(async(req,res,next)=>{
        //  console.log('update',req.body);
          const updateUser = await User.findByIdAndUpdate(req.user.id,{
              name: req.body.name,
              email: req.body.email
          },
          {
              new: true,
              runValidators:true
          });
          res.status(200).render('account',{
              title: 'Your account',
              user: updateUser
          });
      });

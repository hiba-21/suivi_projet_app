const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { promisify } = require('util');
const nodemailer = require("nodemailer");
const { error } = require('console');
const { EMAIL, PASSWORD }= require('./../routes/env');
const Projet =require('./../models/projetModel');
const pug = require('pug');
const schedule = require('node-schedule');
const cron = require("node-cron");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);


 createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if(req.cookies.jwt){
        token = req.cookies.jwt;
    }
    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to get access.', 401)
      );
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decoded);
    //3 check if user exist
  const currentUser=  await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError('not exist.', 401)
          );
    }
  //access protected route
  req.user = currentUser;
    next();
});
  /**send email to real gmail */


 /* exports.getbill=async(req,res)=>{
    const { userEmail } = req.body;
  
      const config = {
        service : 'gmail',
        auth : {
            user: EMAIL,
            pass: PASSWORD
        }
      }
  const transporter = nodemailer.createTransport(config);
  const pugFilePath = `${__dirname}/../views/email/welcome.pug`;
  const projets = await Projet.find().populate({
    path:'tasks',
    fields:'name status'
  });
  const renderedHtml = await pug.renderFile(pugFilePath ,{projets :projets});
    let message = {
      from : EMAIL,
      to : userEmail,
      subject: "Rapport d'avancement",
      html: renderedHtml
  }
  cron.schedule('0 *1 * * * *', () =>  {
    try {
    transporter.sendMail(message).then(() => {
      return res.status(201).json({
          msg: "you should receive an email"
      })
    }).catch(error => {
      return res.status(500).json({ error })
    })
  } catch (error) {
    return res.status(500).json({ error });
  }  });
    };
  */
exports.getbill = async (req, res) => {
        const { scheduledDate } = req.body; // La date de planification
        const config = {
          service: 'gmail',
          auth: {
            user: EMAIL,
            pass: PASSWORD},
        };
        const transporter = nodemailer.createTransport(config);
        const pugFilePath = `${__dirname}/../views/email/welcome.pug`;
        const users = await User.find();
         const projets = await Projet.find().populate({
            path: 'tasks',
            fields: 'name status',
          });
          const renderedHtml = await pug.renderFile(pugFilePath, { projets: projets });
          for (const user of users) {
          const message = {
            from: EMAIL,
            to: user.email, 
            subject: "Rapport d'avancement",
            html: renderedHtml,
          };
          // Utilisez node-schedule pour planifier l'envoi de l'email à la date spécifiée
          schedule.scheduleJob(scheduledDate, async () => {
            try {
              transporter.sendMail(message).then(() => {
                return res.status(201).json({
                  msg: "you should receive an email"});
              }).catch(error => {
                return res.status(500).json({ error });
              });
            } catch (error) {
              return res.status(500).json({ error });
            }
          });
        }
        return res.status(201).json({msg: "Les emails ont été planifiés pour envoi à la date spécifiée"});
};
exports.getReel = async (req, res) => {
  // La date de planification
  const config = {
    service: 'gmail',
    auth: {
      user: EMAIL,
      pass: PASSWORD},
  };
  const transporter = nodemailer.createTransport(config);
  const pugFilePath = `${__dirname}/../views/email/welcome.pug`;
  const users = await User.find();
   const projets = await Projet.find().populate({
      path: 'tasks',
      fields: 'name status',
    });
    const renderedHtml = await pug.renderFile(pugFilePath, { projets: projets });
    for (const user of users) {
    const message = {
      from: EMAIL,
      to: user.email, 
      subject: "Rapport d'avancement",
      html: renderedHtml,
    };
    // Utilisez node-schedule pour planifier l'envoi de l'email à la date spécifiée
    
        transporter.sendMail(message).then(() => {
          return res.status(201).json({
            msg: "you should receive an email"});
        }).catch(error => {
          return res.status(500).json({ error });
        });
      
    
  }
  return res.status(201).json({msg: "Les emails ont été planifiés pour envoi à la date spécifiée"});
};
      
  exports.updatePassword=catchAsync( async(req,res,next)=>{
    //get user from collection
    const user = await User.findById(req.user.id).select('+password');
   
    //chech posted current pwd correct
    if (!(user.correctPassword(req.body.passwordCurrent,user.password))) {
        return next(new AppError('your password is wrong ',401)); 
    };
    //update pwd
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //User.findByIdand Update
    createSendToken(user,200,res);
    
    //log user,send JWT
});
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

const express = require('express');
const taskRouter = require('./../routes/taskRoutes');
const authController =require('./../controllers/authController');
const projetController = require('./../controllers/projetController');
const router= express.Router();

router.use(authController.protect);

router.use('/:projetId/tasks',taskRouter);

router
    .route('/')
    .get(projetController.getAllProjets)
    .post(projetController.createProjet);
    
router
    .route('/:id')
    .get(projetController.getProjet)
    .patch(projetController.updateProjet)
    .delete(projetController.deleteProjet);



module.exports = router;
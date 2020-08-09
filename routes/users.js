const express                     = require('express');
const router                      = express.Router();
const { check, validationResult } = require('express-validator');
const HTTPStatus                  = require('http-status');
const jwt                         = require('jsonwebtoken');
const axios  					  = require('axios');
const config  					  = require('config');
const moment                      = require('moment');
const multer                      = require('multer');
const storage                     = multer.diskStorage({
                                        limits: { fileSize: 10000 },
                                        filename: (req, file, cb)=>{
                                         cb(null, Date.now() + file.originalname)
                                        }
                                    });
const upload                      = multer({storage,
                                      fileFilter: (req, file, cb) => {
                                      cb(null, Date.now() + file.originalname)
                                      }
                                    });

module.exports = (app, wagner) => {
    
    /* GET Dummy API */
	router.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});

    /* POST Register API */
	router.post('/register', [
        check('first_name').notEmpty().withMessage('firstname required').bail(),
        check('last_name').notEmpty().withMessage('lastname required').bail(),
        check('DOB').notEmpty().withMessage('date of birth is required').bail(),
        check('permanentMobileNumber').notEmpty().withMessage('permanent mobile number required').bail().isLength({ min: 10 }).withMessage('Minimum 10 characters are required'),
        check('Taluka').notEmpty().withMessage('Taluka required').bail(),
        check('Village').notEmpty().withMessage('Village required').bail(),
        check('uniqueKey').notEmpty().withMessage('Village required').bail(),
    ], async (req, res, next)=> {
        try{ 
    		let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }
            const params = {
            	first_name : req.body.first_name,
            	last_name  : req.body.last_name,
            	birth_date : req.body.DOB,
            	taluka : req.body.Taluka, 
            	village : req.body.Village,
            	mobile_number : req.body.permanentMobileNumber,
            	add_mobile_no : req.body.AdditionalMobileNumber,
            	sub_admin_id : req.body.uniqueKey,
            }  

            const users = await wagner.get('UserManager').insert(params);
            const subAdmin = await wagner.get('SubadminManager').findOne(params.sub_admin_id);        	
            const data = {
                userId     : users.dataValues.id,
                subAdminProfImg: subAdmin.dataValues.profile_image	== null ? '' :subAdmin.dataValues.profile_image,
                Name  : subAdmin.dataValues.first_name +' '+ subAdmin.dataValues.last_name,
                facebookPageId  : subAdmin.dataValues.facebook_url,
                whatsappNumber : subAdmin.phone,
                AboutUsUrl : config.get('app_route')+'/aboutUs/'+subAdmin.dataValues.id                
            }
            res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: data});   	
        }catch(e){
            console.log(e);
            res.status(HTTPStatus.OK).json({ success: '0', message: "failure", data: ''}); 
        }     
    });
	
    /* POST Add Comment API */
	router.post('/addComment', [
        check('postId').notEmpty().withMessage('postid required').bail(),
        check('message').notEmpty().withMessage('message required').bail(),
        check('userId').notEmpty().withMessage('userid required').bail(),
    ], async (req, res, next)=> {
        try{ 
    		let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            const params = {
            	post_id : req.body.postId,
            	message : req.body.message,
            	user_id : req.body.userId,
            	status  : req.body.status
            }

            const comment = await wagner.get('UserManager').addComment(params);  
            if(comment){
            	res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: ''});  
            }else{
            	res.status(HTTPStatus.OK).json({ success: '0', message: "failure", data: ''});	
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    /* POST Complaint List API */
	router.post('/complaintList', [
        check('userId').notEmpty().withMessage('userId required').bail(),
    ], async (req, res, next)=> {
        try{ 
    		let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            const params = {
            	user_id : req.body.userId
            }

            const complaints = await wagner.get('UserManager').complaintList(params);  
            if(complaints.length>0){
            	res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: complaints});  
            }else{
            	res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: [] });
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 

    /* POST Add Appointment API */
	router.post('/addAppointment', [
        check('userId').notEmpty().withMessage('userId required').bail(),
        check('date').notEmpty().withMessage('date required').bail(),
        check('time').notEmpty().withMessage('time required').bail(),
        check('description').notEmpty().withMessage('description required').bail(),
        check('subject').notEmpty().withMessage('subject required').bail(),
        check('sub_admin_id').notEmpty().withMessage('sub_admin_id required').bail(),
    ], async (req, res, next)=> {
        try{ 
    		let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            req.body.user_id = req.body.userId;
            const complaints = await wagner.get('UserManager').addAppointment(req.body);  
            if(complaints){
            	res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: ''});  
            }else{
            	res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: '' });
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });     

    /* POST Appointment List API */
	router.post('/appointmentList', [
        check('userId').notEmpty().withMessage('userId required').bail(),
    ], async (req, res, next)=> {
        try{ 
    		let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            const params = {
            	user_id : req.body.userId
            }

            const complaints = await wagner.get('UserManager').appointmentList(params);  
            if(complaints.length>0){
            	res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: complaints});  
            }else{
            	res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: [] });
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });  

    /* POST Events List API */
    router.post('/eventsList', [
        check('adminId').notEmpty().withMessage('adminId required').bail(),
        check('userId').notEmpty().withMessage('userId required').bail(),
    ], async (req, res, next)=> {
        try{ 
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            const params = {
                sub_admin_id     : req.body.adminId,
                user_id          : req.body.userId
            }

            const events = await wagner.get('UserManager').eventList(params);  
            res.status(HTTPStatus.OK).json(events);  

        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });      

    /* POST Add Complaint API */
    router.post('/addComplaint', upload.single('file-input'), async (req, res)=>{
        try{
            const complaint = await wagner.get('UserManager').addComplaint(req);  
            if(complaint){
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: ''});  
            }else{
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: '' });
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }
    }); 

    /* POST Join Event API */
    router.post('/joinEvent', [
        check('eventId').notEmpty().withMessage('eventId required').bail(),
        check('userId').notEmpty().withMessage('userId required').bail(),
    ], async (req, res, next)=> {
        try{ 
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            const params = {
                event_id         : req.body.eventId,
                user_id          : req.body.userId
            }

            const events = await wagner.get('UserManager').eventAdd(params);  
            if(events){
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: ''});  
            }else{
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: '' });
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 

    /* POST Profile API */
    router.post('/profile', [
        check('adminId').notEmpty().withMessage('adminId required').bail(),
    ], async (req, res, next)=> {
        try{ 
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            const params = {
                id          : req.body.adminId
            }

            const admin = await wagner.get('SubadminManager').findOne(params);  
            if(admin){
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: admin});  
            }else{
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: '' });
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });     

    /* POST Gallery API */
    router.post('/gallery', [
        check('adminId').notEmpty().withMessage('adminId required').bail(),
    ], async (req, res, next)=> {
        try{ 
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            const params = {
                id          : req.body.adminId
            }

            const admin = await wagner.get('SubadminManager').gallery(params);  
            
            res.status(HTTPStatus.OK).json(admin);  

        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });


    router.post('/work', [
        check('sub_admin_id').notEmpty().withMessage('sub_admin_id required').bail(),
    ], async (req, res, next)=> {
        try{ 
            let errors = validationResult(req);
            let params;
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }    
            if(req.body.category){
	            params = {
	                sub_admin_id : req.body.sub_admin_id,
	                category     : req.body.category,
	                type         : req.body.type  
	            }
	        }else{
	            params = {
	                sub_admin_id : req.body.sub_admin_id,
	                type         : req.body.type  
	            }	        	
	        } 
            const admin = await wagner.get('SubadminManager').work(params);  
            
            if(admin.lenght>0){
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: admin});  
            }else{
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: admin });
            }

        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.post('/home', [
        check('userId').notEmpty().withMessage('userId required').bail(),
        check('sub_admin_id').notEmpty().withMessage('sub_admin_id required').bail(),
    ], async (req, res, next)=> {
        try{
            let errors = validationResult(req);
            let params;
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                return res.status(405).json({ success: '0', message: "failure", data: lasterr });
            }

            const home = await wagner.get('SubadminManager').home(req.body);  
            
            if(home){
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: home});  
            }else{
                res.status(HTTPStatus.OK).json({ success: '1', message: "success", data: '' });
            }                        	
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });     
	return router;
}

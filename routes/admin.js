const express                     = require('express');
const router                      = express.Router();
const { check, validationResult } = require('express-validator');
const session                     = require('express-session');
const md5                         = require('md5');
const session_auth                = require('../middleware/session_auth');
const multer                      = require('multer');
const moment                      = require('moment');
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
    
	router.get('/login', function(req, res, next) {	  
      res.render('admin/login'); 
	});

    router.post('/login', [
        check('email').notEmpty().withMessage('email required').bail(),
        check('password').notEmpty().withMessage('password required').bail(),
    ], async (req, res, next)=> {
        try{ 
            
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                
                // req.flash('errormsg', 'Some error occured please try again.');
                // res.redirect('/admin/login');
                res.status(200).json({ success: '0', message: "failure", errormsg:"Some error occured please try again."});         
            }else{
                let params = {
                    email : req.body.email,
                    password : req.body.password
                }
            	  const admin = await wagner.get('SubadminManager').findOne(params);
                if(admin){
                    req.session.currentUser = admin.dataValues;
                    // console.log(req.session);
                    // res.redirect('/admin/dashboard'); 
                    res.status(200).json({ success: '1', message: "success"});
                } else {
                    // req.flash('errormsg', 'Incorrect Username or Password.');
                    // res.redirect('/admin/login');      
                    res.status(200).json({ success: '0', message: "failure", errormsg:"Incorrect Username or Password."});         
                }
            }
        }catch(e){
            console.log(e);
            res.status(200).json({ success: '0', message: "failure", errormsg: e });
        }    
    });    

    router.get('/dashboard', session_auth.admin,  (req,res,next) =>{  
        console.log(req.session.currentUser);
        res.render('admin/dashboard');  
        // res.render('admin/dashboard', { layout: 'adminLayout' });  
    }); 

    router.get('/forgotPassword', (req, res, next)=> {
        res.render('admin/forgot_password');
    });

    router.post('/forgotPassword',  [
        check('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Email is not valid')         
    ],async (req, res, next)=> {
        const payload    = req.body;        
        const admin = await wagner.get('SubadminManager').findOne(payload);
        
        if(admin){            
            payload.id = admin.id;
            const sendMail = await wagner.get('SubadminManager').forgetPassword(payload);    
            if(sendMail){
                console.log("Mail Sent");                
                // req.flash('successmsg', 'Mail sent on registered Email Id.');
                // res.redirect('/admin/forgotPassword');  
                res.status(200).json({ success: '1', message: "success", successmsg: "Mail sent on registered Email Id."});                              
            }
        }else{
            // req.flash('errormsg', 'Email id not registered.');
            // res.redirect('/admin/forgotPassword');   
            res.status(200).json({ success: '0', message: "failure", errormsg: "Email id not registered."});                                           
        }      
    });

    router.get('/subAdmin', session_auth.admin, async (req, res, next)=> {
        try{
            let params = {roles : 2}; 
            const subAdmin = await wagner.get('SubadminManager').findAll(params);

            res.render('admin/sub_admin',{data: subAdmin}); 
            
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });    

    router.get('/subAdminActivateDeactivate/:subAdminId/:status', session_auth.admin, async (req, res, next)=> {
        try{ 
            
        	let params = {status : req.params.status == 1 ? 0 : 1};
        	let conds = {id : req.params.subAdminId}
            
        	const subAdmin = await wagner.get('SubadminManager').update(params, conds);
            
        	if(subAdmin){
        		res.redirect('/admin/subAdmin');  
        	}else{
        		console.log("2")
        	}
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });    

    router.get('/usersActivateDeactivate/:userId/:status', session_auth.admin, async (req, res, next)=> {
        try{ 
        	let params = {status : req.params.status == 1 ? 0 : 1};
        	let conds = {id : req.params.userId}

        	const users = await wagner.get('UserManager').update(params, conds);
        	if(users){
        		res.redirect('/admin/users');  
        	}else{
        		console.log("2")        		
        	}
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });
    
    router.get('/users', session_auth.admin, async (req, res, next)=> {
        try{ 
        	const users = await wagner.get('UserManager').userList();
            console.log(users);
        	res.render('admin/users',{data: users, moment:moment}); 
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.post('/createSubAdmin', [
        check('first_name').notEmpty().withMessage('First Name required').bail(),
        check('last_name').notEmpty().withMessage('Last Name required').bail(),
        check('email').notEmpty().withMessage('Email required').bail(),
        check('password').notEmpty().withMessage('Password required').bail(),
        check('present_position').notEmpty().withMessage('Present Position required').bail(),
    ], session_auth.admin, async (req, res, next)=> {
        try{
            let errors = validationResult(req);
            if(!errors.isEmpty()){
                let lasterr = errors.array().pop();
                lasterr.message = lasterr.msg + ": " + lasterr.param.replace("_"," ");
                
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Some error occured please try again.' });                                                    
            }else{ 
                let params = {
                    "first_name" : req.body.first_name,
                    "last_name" : req.body.last_name,
                    "email" : req.body.email,
                    "password" : req.body.password,
                    "present_position" : req.body.present_position
                }
                
                const subAdmin = await wagner.get('SubadminManager').insert(params);
                console.log(subAdmin);
                if(subAdmin){
                    res.status(200).json({ success: '1', message: "success", successmsg: 'Sub Admin added successfully!!' });
                } else {
                    res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
                }
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", errormsg: e });
        }    
    });

    router.post('/changePassword', session_auth.admin, async (req, res, next)=> {
        try{
            let params = {password : req.body.new_password};
            let conds = {id : req.session.currentUser.id} /*Set from sessions*/
            const changePassword = await wagner.get('SubadminManager').update(params, conds);
            console.log(changePassword);
            //req.flash('successmsg', 'Password changed successfully!!');
            if(changePassword){
                res.status(200).json({ success: '1', message: "success", successmsg: 'Password changed successfully!!' });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            //req.flash('errormsg', e);
            res.status(500).json({ success: '0', message: "failure", errormsg: e });
        }    
    });  

    router.get('/viewProfile', async (req, res, next)=> {
        try{ 
            let conds = {id : 1} /*Set from sessions*/
            const subAdmin = await wagner.get('SubadminManager').findOne(conds);
            console.log(JSON.stringify(subAdmin));
            if(subAdmin){
                res.render('admin/my_profile',{data: subAdmin, moment:moment}); 
                // res.status(200).json({ success: '1', message: "success", data: subAdmin });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", errormsg: e });
        }    
    }); 

    router.get('/myProfile', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {id : req.session.currentUser.id} /*Set from sessions*/
            const subAdmin = await wagner.get('SubadminManager').findOne(conds);
            if(subAdmin){
                res.render('admin/my_profile',{data: subAdmin, moment:moment}); 
                // res.status(200).json({ success: '1', message: "success", data: subAdmin });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 


    router.post('/imageUpdate', upload.single('profile_image'), session_auth.admin, async (req, res, next)=> {
        try{ 
            
            let conds = {id : req.session.currentUser.id} /*Set from sessions*/
            let params; 
            const photo_url = await wagner.get('UserManager').saveMediaS3(req);            
            if(req.body.imageStatus  == 1){
                params = {
                    cover_photo_url : photo_url
                }
            }else{
                params = {
                    profile_image : photo_url
                }                
            }    
            const subAdmin = await wagner.get('SubadminManager').update(params, conds);
            // if(subAdmin){
                // req.flash('successmsg', 'Mail sent on registered Email Id.');
                res.redirect('/admin/myProfile');                                                
            // }else{
            //     res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            // }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });        

    router.get('/editProfile', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = { id : req.session.currentUser.id } 
            const subAdmin = await wagner.get('SubadminManager').findOne(conds);
            if(subAdmin){
                res.render('admin/edit_profile',{data: subAdmin, moment:moment}); 
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }     
    });

    router.post('/editProfile', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {id : req.session.currentUser.id} /*Set from sessions*/
            const subAdmin = await wagner.get('SubadminManager').update(req.body, conds);
            if(subAdmin){
                res.redirect('/admin/myProfile');
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 

    router.get('/complaintList', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = { sub_admin_id : req.session.currentUser.id} /*Set from sessions*/
            const subAdmin = await wagner.get('SubadminManager').findComplaints(conds);
            console.log(JSON.stringify(subAdmin));
            if(subAdmin){
                res.redirect('/admin/myProfile');
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.get('/appointmentsList',session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = { sub_admin_id : req.session.currentUser.id} /*Set from sessions*/
            const subAdmin = await wagner.get('SubadminManager').findAppointments(conds);
            console.log(JSON.stringify(subAdmin));
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

	router.get('/birthday', session_auth.admin, async (req, res, next) =>{
        try{ 
            let conds = {id : req.session.currentUser.id} /*Set from sessions*/
            const users = await wagner.get('SubadminManager').birthday(conds);
            if(users){
               res.render('admin/followers_birthday',{data: users});  
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.'});                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        } 
	});

    router.get('/appointmentList', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {id : req.session.currentUser.id} /*Set from sessions*/
            const appointmentList = await wagner.get('SubadminManager').appointmentList(req.body, conds);
            if(appointmentList){
                //console.log(appointmentList);
                res.render('admin/appointments',{data: appointmentList, moment: moment});  
                // res.status(200).json({ success: '1', message: "success", data: appointmentList });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 
        
    router.get('/resetPassword/:id',  (req, res, next)=> {
            res.render('admin/resetPassword');      
    });

    router.get('/events', session_auth.admin, async (req, res, next)=> {
        let conds = {sub_admin_id : req.session.currentUser.id}
        const events = await wagner.get('SubadminManager').events(conds);
        res.render('admin/events', {data:events, moment:moment});      
    });

    router.post('/addEvent', upload.single('fileInput'), session_auth.admin, async (req, res, next)=> {
        const media_url = await wagner.get('UserManager').saveMediaS3(req);

        let request = {
            sub_admin_id : req.session.currentUser.id,
            location : req.body.location,
            description : req.body.description,
            date : req.body.datepicker,
            time : req.body.timepicker,
            media_url : media_url
        }
        const events = await wagner.get('SubadminManager').addEvents(request);
        res.redirect('/admin/events')    
    });

    router.get('/deleteEvents/:id', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {id : req.params.id} /*Set from sessions*/
            const update = await wagner.get('SubadminManager').deleteEvents(conds);
            
            res.redirect('/admin/events');  
                          
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.post('/resetPassword/:id', async (req, res, next)=> {
        try{ 
            let conds = {id : req.params.id} /*Set from sessions*/
            const update = await wagner.get('SubadminManager').update(req.body, conds);
            
            res.redirect('/admin/login');  
                          
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.get('/acceptRejectAppointment/:appointmentId/:status', session_auth.admin, async (req, res, next)=> {
        try{ 
            let params = {status : req.params.status };
            let conds = {id: req.params.appointmentId }; 
            const appointmentUpdate = await wagner.get('SubadminManager').acceptRejectAppointment(params, conds);
            if(appointmentUpdate){
                //console.log(appointmentList);
                res.redirect('/admin/appointmentList');  
                // res.status(200).json({ success: '1', message: "success", data: appointmentUpdate });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.get('/acceptRejectComplaint/:complaintId/:status', session_auth.admin, async (req, res, next)=> {
        try{ 
            let params = {status : req.params.status };
            let conds = {id: req.params.complaintId }; 
            const appointmentUpdate = await wagner.get('SubadminManager').acceptRejectComplaint(params, conds);
            if(appointmentUpdate){
                //console.log(appointmentList);
                res.redirect('/admin/complaintsList');  
                // res.status(200).json({ success: '1', message: "success", data: appointmentUpdate });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });
    
    router.post('/appointUpdate', session_auth.admin, async (req, res, next)=> {
        try{             
            // let time = moment(req.body.timepicker).format("HH:mm:ss");
            // console.log(time);
            let conds = {id : req.body.id};
            let params = {is_rescheduled : 1, date:req.body.datepicker, time: req.body.timepicker, status: req.body.status}; 
            const appointmentUpdate = await wagner.get('SubadminManager').appointmentUpdate(params, conds);
            if(appointmentUpdate){
                res.redirect('/admin/appointmentList');  
                //console.log(appointmentList);
                //res.status(200).json({ success: '1', message: "success", data: appointmentUpdate });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });
    
    // router.get('/commentList/:id', session_auth.admin, async (req, res, next)=> {
    //     try{ 
    //         let conds = {post_id : req.params.id} /*Media id in params*/
    //         const comments = await wagner.get('SubadminManager').commentList(conds);
    //         if(comments){
    //             //console.log(appointmentList);
    //             res.status(200).json({ success: '1', message: "success", data: comments });
    //         }else{
    //             res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
    //         }
    //     }catch(e){
    //         console.log(e);
    //         res.status(500).json({ success: '0', message: "failure", data: e });
    //     }    
    // });
    
    router.get('/complaintsList', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {sub_admin_id : req.session.currentUser.id} /*Media id in params*/
            const complaints = await wagner.get('SubadminManager').complaintsList(conds);
            if(complaints){
                console.log(complaints);
                res.render('admin/complaints',{data: complaints});  
                //res.status(200).json({ success: '1', message: "success", data: complaints });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.get('/viewRepliesComplaints/:complaintId', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {complaint_id : req.params.complaintId} /*Complaint id in params*/
            const viewRepliesComplaints = await wagner.get('SubadminManager').viewRepliesComplaints(conds);
            if(viewRepliesComplaints.length > 0){
                console.log(viewRepliesComplaints);
                res.status(200).json({ success: '1', message: "success", data: viewRepliesComplaints });
            }else{
                res.status(200).json({ success: '0', message: "failure", data: 'No Reply Found' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 
    
    router.post('/complaintsReply', session_auth.admin, async (req, res, next)=> {
        try{             
            const complaintsReply = await wagner.get('SubadminManager').complaintsReply(req.body);
            if(complaintsReply){
                res.redirect('/admin/complaintsList');  
                // res.status(200).json({ success: '1', message: "success", data: '' });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 
    
    router.get('/getMedia', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {sub_admin_id : req.session.currentUser.id} ;            
            const mediaList = await wagner.get('SubadminManager').mediaList(conds);
            if(mediaList){
                console.log(mediaList);
                res.render('admin/gallery',{data: mediaList});  
                // res.status(200).json({ success: '1', message: "success", data: mediaList });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 

    router.post('/addMedia', upload.single('fileInput'), session_auth.admin, async (req, res, next)=> {
        try{ 
            let params; 
            let saveToGallery = {};
            const media_url = await wagner.get('UserManager').saveMediaS3(req);
            console.log(media_url);
            console.log(req.body);
            if(req.body.gallery_id){
                params = {
                    gallery_id : req.body.gallery_id,
                    media_url : media_url
                }
                saveToGallery = await wagner.get('SubadminManager').saveToGallery(params);
                // res.status(200).json({ success: '1', message: "success", data: '' });
            }else{
                params = {
                    title : req.body.title,
                    sub_admin_id : req.session.currentUser.id, /*Set from sessions*/
                    description : req.body.description
                }
                const createMedia = await wagner.get('SubadminManager').createMedia(params);   
                let paramsMedia = {
                    gallery_id : createMedia.dataValues.id,
                    media_url : media_url
                };       
                saveToGallery = await wagner.get('SubadminManager').saveToGallery(paramsMedia);
                // res.status(200).json({ success: '1', message: "success", data: '' });      
            } 
            if(saveToGallery){
                res.redirect('/admin/getMedia');  
                // res.status(200).json({ success: '1', message: "success" });                    
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }   
            
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.get('/logout', (req, res, next)=> {
        req.session.destroy();
        res.redirect('/admin/login');
    });

    router.get('/developmentWork', session_auth.admin, async (req, res, next)=> {
        try{    
            let conds = {sub_admin_id : req.session.currentUser.id, type : 'Development'} /*Media id in params*/
            const taskList = await wagner.get('SubadminManager').taskList(conds);
            if(taskList){                
                res.render('admin/development_work',{data: taskList});  
                // res.status(200).json({ success: '1', message: "success", data: taskList });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 

    router.get('/pendingWork', session_auth.admin, async (req, res, next)=> {
        try{    
            let conds = {sub_admin_id : req.session.currentUser.id, type : 'Pending'} /*Media id in params*/
            const taskList = await wagner.get('SubadminManager').taskList(conds);
            if(taskList){                
                res.render('admin/pending_work',{data: taskList});  
                // res.status(200).json({ success: '1', message: "success", data: taskList });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.get('/socialWork', session_auth.admin, async (req, res, next)=> {
        try{    
            let conds = {sub_admin_id : req.session.currentUser.id, type : 'Social'} /*Media id in params*/
            const taskList = await wagner.get('SubadminManager').taskList(conds);
            if(taskList){                
                res.render('admin/social_work',{data: taskList});  
                // res.status(200).json({ success: '1', message: "success", data: taskList });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });
    
    router.post('/addTasks', upload.single('fileInput'), session_auth.admin, async (req, res, next)=> {
        try{ 
            let params; 
            let createTaskMedia = {};
            const media_url = await wagner.get('UserManager').saveMediaS3(req);
            if(req.body.task_id){
                params = {
                    task_id : req.body.task_id,
                    media_url : media_url
                }
                createTaskMedia = await wagner.get('SubadminManager').createTaskMedia(params);
                // res.status(200).json({ success: '1', message: "success", data: '' });
            }else{
                params = {
                    title : req.body.title,
                    sub_admin_id : req.session.currentUser.id, /*Set from sessions*/
                    description : req.body.description,
                    type : req.body.type,
                    category : req.body.category
                }
                const createTask = await wagner.get('SubadminManager').createTask(params);   
                let paramsMedia = {
                    task_id : createTask.dataValues.id,
                    media_url : media_url
                };       
                createTaskMedia = await wagner.get('SubadminManager').createTaskMedia(paramsMedia);
                // res.status(200).json({ success: '1', message: "success", data: '' });      
            }    
            if(createTaskMedia){
                if(req.body.type == 'Development'){
                    res.redirect('/admin/developmentWork');
                }else if(req.body.type == 'Social'){
                    res.redirect('/admin/socialWork');
                } else{
                    res.redirect('/admin/pendingWork');
                }
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });

    router.get('/delTasks/:TaskId', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = req.params.TaskId; /*Task id in params*/
            const delTasks = await wagner.get('SubadminManager').delTasks(conds);
            if(delTasks){                
                res.status(200).json({ success: '1', message: "success", data: '' });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });
    
    router.get('/getTasks/:TaskId', async (req, res, next)=> {
        try{ 
            let conds = {id: req.params.TaskId}; /*Media id in params*/
            const taskList = await wagner.get('SubadminManager').taskList(conds);
            if(taskList){
                //console.log(appointmentList);
                res.status(200).json({ success: '1', message: "success", data: taskList });
            }else{
                res.status(403).json({ success: '0', message: "failure", errormsg: 'Something entered wrong.' });                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });  
    
    router.post('/editTasks', session_auth.admin, async (req, res, next)=> {
        try{            
        	let params = {
        		title : req.body.title,
        		description : req.body.description,
        		type : req.body.type,
        		category : req.body.category	 
        	};
        	let conds = {id : req.body.id};
            const editTaskMedia = await wagner.get('SubadminManager').editTasks(params,conds);
            // res.status(200).json({ success: '1', message: "success", data: '' });
            if(editTaskMedia){
                if(req.body.type == 'Development'){
                    res.redirect('/admin/developmentWork');
                }else if(req.body.type == 'Social'){
                    res.redirect('/admin/socialWork');
                } else{
                    res.redirect('/admin/pendingWork');
                }
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }
    });  
    
    router.get('/commentsGallery/:GalleryId', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {post_id : req.params.GalleryId, status : 1} /*Media id in params*/
            const commentsGallery = await wagner.get('SubadminManager').commentsGallery(conds);
            if(commentsGallery.length > 0){                
                res.status(200).json({ success: '1', message: "success", data: commentsGallery });
            }else{
                res.status(200).json({ success: '0', message: "failure", data: 'No comments found'});                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    }); 

    router.get('/commentsWork/:TaskId', session_auth.admin, async (req, res, next)=> {
        try{ 
            let conds = {post_id : req.params.TaskId, status : 2} /* Media id in params */
            const commentsWork = await wagner.get('SubadminManager').commentsGallery(conds);
            if(commentsWork.length > 0){                
                res.status(200).json({ success: '1', message: "success", data: commentsWork });
            }else{
                res.status(200).json({ success: '0', message: "failure", data: 'No comments found'});                    
            }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        }    
    });  
           
	return router;
}

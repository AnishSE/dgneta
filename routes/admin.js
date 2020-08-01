const express                     = require('express');
const router                      = express.Router();
const { check, validationResult } = require('express-validator');
const session                     = require('express-session');
const md5                         = require('md5');
const session_auth                = require('../middleware/session_auth');
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
                
                req.flash('errormsg', 'Some error occured please try again.');
                res.redirect('/admin/login');
            }else{
                let params = {
                    email : req.body.email,
                    password : md5(req.body.password)
                }
            	  const admin = await wagner.get('SubadminManager').findOne(params);
                if(admin){
                    req.session.currentUser = admin.dataValues;
                    // console.log(req.session);
                    res.redirect('/admin/dashboard'); 
                } else {
                    req.flash('errormsg', 'Incorrect Username or Password.');
                    res.redirect('/admin/login');               }
                }
        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
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
                req.flash('successmsg', 'Mail sent on registered Email Id.');
                res.redirect('/admin/forgotPassword');                                
            }
        }else{
            req.flash('errormsg', 'Email id not registered.');
            res.redirect('/admin/forgotPassword');                
        }      
    });

    router.get('/subAdmin', session_auth.admin, async (req, res, next)=> {
        try{
            let params = {roles : 2}; 
            const subAdmin = await wagner.get('SubadminManager').findAll(params);
            console.log(subAdmin);

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
        	res.render('admin/users',{data: users}); 
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
                    "password" : md5(req.body.password),
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
            let params = {password : md5(req.body.new_password)};
            let conds = {id : req.session.currentUser.id} /*Set from sessions*/
            const changePassword = await wagner.get('SubadminManager').update(params, conds);
            console.log(changePassword);
            if(changePassword){
                res.status(200).json({ success: '1', message: "success", successmsg: 'Password changed successfully!!' });
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
                res.render('admin/my_profile',{data: subAdmin}); 
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
                res.render('admin/edit_profile',{data: subAdmin}); 
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

	router.get('/birthday', async (req, res, next) =>{
        try{ 
            let conds = {id : 1/*req.session.currentUser.id*/} /*Set from sessions*/
            const users = await wagner.get('SubadminManager').birthday(conds);

            res.status(200).json({ success: '1', message: "success", data: users });

        }catch(e){
            console.log(e);
            res.status(500).json({ success: '0', message: "failure", data: e });
        } 
	});
    router.get('/appointmentList', /*session_auth.admin,*/ async (req, res, next)=> {
        try{ 
            let conds = {id : /*req.session.currentUser.id*/2} /*Set from sessions*/
            const appointmentList = await wagner.get('SubadminManager').appointmentList(req.body, conds);
            if(appointmentList){
                //console.log(appointmentList);
                res.status(200).json({ success: '1', message: "success", data: appointmentList });
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
    })

	return router;
}

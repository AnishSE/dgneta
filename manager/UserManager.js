const nodemailer      = require('nodemailer');
const bcrypt          = require('bcryptjs');
const saltRounds      = 10;
const salt            = bcrypt.genSaltSync(saltRounds);
const config          = require('config');
const jwt             = require('jsonwebtoken');
const AWS             = require('aws-sdk');
const s3              = new AWS.S3();
const fs              = require('fs');
const path            = require('path');
const moment          = require('moment');
const asyncLoop       = require('node-async-loop');

class UserManager {

    constructor(wagner) {
    	this.Users = wagner.get("Users");
    	this.Comments = wagner.get("Comments");
    	this.Complaints = wagner.get("Complaints");
    	this.Appointments = wagner.get("Appointments");
    	this.Events = wagner.get("Events");
    	this.Joinevents = wagner.get("Joinevents");
    	this.Subadmin = wagner.get("Subadmin");
    }

	find(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Users.findOne({where : req.userObj});
		        resolve(user)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	insert(req){
	    return new Promise(async (resolve, reject)=>{
	    	console.log(req);
	      	try{
		        let user  = await this.Users.create(req,{raw:true});
		        resolve(user)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}

	addComment(req){
	    return new Promise(async (resolve, reject)=>{
	    	console.log(req);
	      	try{
		        let user  = await this.Comments.create(req,{raw:true});
		        resolve(user)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}

	complaintList(req){
	    return new Promise(async (resolve, reject)=>{
	    	console.log(req);
	      	try{
		        let user  = await this.Complaints.findAll(req,{raw:true});
		        resolve(user)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}	
  
    update(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Users.update(
		        	req.userObj,
		        	{ where : req.conditons }
		        );
		        resolve(user)
	      	} catch(error){
	        	console.log(error);
	        	reject(error);
	        }
	    })
	}

	addAppointment(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Appointments.create(req,{raw:true});
		        resolve(user)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}	

	forgetPassword(req){
    	return new Promise(async (resolve, reject)=>{
    		console.log("HI");
		    try{
	          const mailOptions = {
	            from: config.get('MAIL_USERNAME'),
	            to: req.email,
	            subject: 'Reset Password Link.',
	            html: '<b>HI</b><br> <p>Greetings for the day.</p><br> <p>Please click Reset Password to reset your password.</p>  <p><a href='+config.get('app_route')+'users/resetPassword/'+ req.id+' <button>Reset Password</button></a></p> <br>Regards.<br> <p>Team '+config.get('site_name')+'.</p>'
	          };
	          const sendMailfunc = await this.Mail.sendMail(mailOptions);
	          resolve(sendMailfunc);

		    }catch(e){
		        console.log(e);
		        reject(e);
		    }
    	})
  	}

  	async login(req) {  		
	        try {
	            const JWT_KEY = config.get('JWT_KEY');
	            const JWT_TOKEN_EXPIRES = config.get('JWT_TOKEN_EXPIRES');
	            let emailId   = req.email; 
	            let password  = req.password;   
	            let user      = await this.Users.findOne({where: {email : emailId } });  
	            
	            if (!user) {
	                return({ success: '0', status_code : 401, message: "failure", data: { "message" : "Incorrect email or password." } });                       
	            }else{
	            		            
		            if(bcrypt.compareSync(password, user.dataValues.password)){	

		            	let data = {
		            		id             : user.dataValues.id,
			                email          : user.dataValues.email,
                        	first_name     : user.dataValues.first_name,
                        	last_name      : user.dataValues.last_name,
                        	mobile_number  : user.dataValues.mobile_number                
		            	}			            	
		            	let token = await jwt.sign({ data: data }, JWT_KEY, { expiresIn: JWT_TOKEN_EXPIRES });		            	
		            	if (!token){		                        
		                    return({ success : '0', status_code	: 401, message: "failure", data : {"message" : "Expired Token"}});  
		                }else{   
		                		let params = {
		                			userId:    user.dataValues.id,
						            authToken: token
						            //deviceToken : req.body.device_token
						        }
		                		let tokenQuery = await this.Tokens.create(params);
		                		
			                    return({
			                        success     : '1',
			                        status_code : 200,
			                        message     : "success",
			                        data        : data,                
			                        token       : token		                            
			                    });
			            }			            
		            } else {		            	
		                return({ success : '0', status_code : 401, message : "failure", data : { "message" : 'Incorrect password'}	});                          
		            }
		        }
	        } catch (e) {
	            return({ success : '0', status_code: 422, message : "failure", data : { "message" : e }});                          
	        }    	
    }

    async resetPassword(req) {
        try {                        
            let user = await this.Users.findOne({
                where: { id: req.id }
            });

            if (user) {
                if(bcrypt.compareSync(req.old_password, user.dataValues.password)){
                	let hashPassword = await bcrypt.hashSync(req.new_password, salt);
               
	                let update = await user.update({
	                    password: hashPassword	                    
	                });
	                if(update){
		                return({
		                    success : '1',
		                    status_code : 200,
		                    message: "success",
		                    data:{ message: "Password resetted successfully."}
		                }); 
		            }
            	}else{
            		return({ success : '0', status_code : 401, message : "failure", data : { "message" : 'Invalid Old Password.'}	});
            	}
            } else {
				return({ success : '0', status_code : 401, message : "failure", data : { "message" : 'Invalid token.'}	});
            }
        } catch (e) {            
            return({ success : '0', status_code: 422, message : "failure", data : { "message" : e }}); 
        }
    }

    appointmentList(req){
	    return new Promise(async (resolve, reject)=>{
	    	console.log(req);
	      	try{
		        let user  = await this.Appointments.findAll({where :req});
		        resolve(user)
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}	
    
    eventList(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		let dataArray = [];
	      		let data;
	      		let count = 0; 
		        let eventList  = await this.Events.findAll({where :{sub_admin_id : req.sub_admin_id}});
		        if(eventList.length>0){ 
			        asyncLoop(eventList, async (val, next)=>{
			        	let eventJoinedStatus  = await this.Joinevents.findOne({where : { user_id : req.user_id, event_id:val.id } });
			        	let totalJoined = await this.Joinevents.findAll({where : { event_id:val.id } });
			        	if(eventJoinedStatus){
			        		data = {
			        			media : val.media_url,
			        			description : val.description,
			        			totalJoined : totalJoined.length,
			        			joined : 1
			        		}

			        		dataArray.push(data);

			        	}else{
			        		data = {
			        			media : val.media_url,
			        			description : val.description,
			        			totalJoined : totalJoined.length,
			        			joined : 0
			        		}
			        		dataArray.push(data);		        		
			        	}
			        	if(count == eventList.length-1){
			        		resolve({ success: '1', message: "success", data: dataArray})			        		
			        	}
			        	count++;
			        	next();
			        })
			    }else{
			    	resolve({ success: '1', message: "No data found", data: dataArray})
			    }    
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}	

	addComplaint(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		let saveMediaS3  = await this.saveMediaS3(req);
	      		let complaintObj = {
	      			user_id : req.body.userId,
	      			media_url : saveMediaS3,
	      			message : req.body.message,
	      			title : req.body.title
	      		};
	      		console.log(complaintObj);
		        let user         = await this.Complaints.create(complaintObj);
		        resolve(user)
	      	} catch(error){
	      		reject(error);
	        }
	    })		
	}

	eventAdd(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let joinEvent = await this.Joinevents.create(req);
		        resolve(joinEvent)
	      	} catch(error){
	      		reject(error);
	        }
	    })		
	}	
	saveMediaS3(req) {
	    return new Promise(async (resolve, reject) =>{
	      try {
			AWS.config.update( {accessKeyId: 'AKIAWSMYASKCD6VXIZLP', secretAccessKey: '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'} )									 	
			let s3         = new AWS.S3();
			let myBucket   = 'intromu-media';	      	
	        const files    = req.file;
	        let old_path   = files.path;
	        let file_ext   = files.originalname.split('.').pop();
	        let file_name  = moment().valueOf();
	        let myKey      = file_name.toString()+"."+file_ext;
	        const sendTos3 = fs.readFile(old_path, async (err, data)=>{
	          if (err) {
	            reject(err);
	          } else {
	            let params     = {Bucket: myBucket, Key: myKey, Body: data, ACL:'public-read' };
	            let url        = 'https://'+myBucket+'.s3.amazonaws.com/'+myKey;

	            s3.putObject(params, (err, result)=>{
	                if(result)
	                	resolve(url);
	                else
	                	reject(err);	
	            });
	          }
	        });
	      }catch(e){
	        console.log(e);
	        reject(e);
	      }
	    })
	};

	update(req,conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Users.update(req, {where : conds});
		        resolve(user)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}	


	userList(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let userList = await this.Users.findAll({
					include: [{
						model : this.Subadmin,
						as : 'subadmin'
					}],						
		        });
		        resolve(userList)
	      	} catch(error){
	      		reject(error);
	        }
	    })		
	}			
}


module.exports  = UserManager;
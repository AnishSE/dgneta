const nodemailer      = require('nodemailer');
const config          = require('config');
const jwt             = require('jsonwebtoken');
const asyncLoop       = require('node-async-loop');
const moment          = require('moment'); 
const sequelize         = require("sequelize");

class SubadminManager {

    constructor(wagner) {
    	this.Users = wagner.get("Users");
    	this.Subamin = wagner.get("Subadmin");
    	this.Gallery = wagner.get("Gallery");
    	this.Gallerymedia = wagner.get("Gallerymedia");
    	this.Comments = wagner.get("Comments");
    	this.Mail = wagner.get('MailHelper');
    	this.Appointments = wagner.get('Appointments');
    	this.Complaints_reply = wagner.get('Complaints_reply');
    	this.Tasks = wagner.get('Tasks');
    	this.Tasksmedia = wagner.get('Tasksmedia');
    	this.Complaints = wagner.get('Complaints');
    	this.Events = wagner.get('Events');
    	this.Likes = wagner.get('Likes');
    }

	findOne(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Subamin.findOne({where : req});
		        resolve(user)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	gallery(req, params){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		let dataArray = [];
	      		let data;
	      		let count = 0; 
		        let gallery  = await this.Gallery.findAll({where :req});
		        if(gallery.length>0){
		        	console.log(gallery);
			        asyncLoop(gallery, async (val, next)=>{
			        	let images = await this.Gallerymedia.findAll({where : { gallery_id:val.id } });
			        	let commentsCount = await this.Comments.count({where : { post_id:val.id, status : 1 } });
				        let likeCount = await this.Likes.count({where : { post_id:val.id,  status : 1 } });

				        let isLike = await this.Likes.findOne({where : { post_id:val.id, user_id : params, status : 1 } });			        	
			        		data = {
			        			images : images,
			        			description : val.description,
			        			title : val.title,
			        			commentsCount : commentsCount,
			        			likeCount : likeCount,
			        			isLike : isLike!=(null||undefined) ? 1 : 0
			        		}

			        		dataArray.push(data);

			        	if(count == gallery.length-1){
							resolve({
								success: '1',
								message: "success",
								data : dataArray
							})
			        	}
			        	count++;
			        	next();
			        })
			    }
			    else{
					resolve({
						success: '1',
						message: "No data found",
						data : {
							images : [],
				        	description : "",
				        	title : ""
				        }	
					})		    	
			    }    
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}

	subAdminList(req){
		return new Promise(async (resolve, reject)=>{
	      	try{
	      		let dataArray = [];
	      		let data;
	      		let count = 1; 
		        let Subamin  = await this.Subamin.findAll({where :req.params});
		        if(Subamin.length>0){
			        asyncLoop(Subamin, async (val, next)=>{
			        		data = {
			        			sno: count,
			        			name : val.first_name +" "+ val.last_name,
			        			email : val.email,
			        			position : val.present_position,
								action : '<button onclick="/Admin/subAdminActivateDeactivate">Activate</button><button onclick="/Admin/subAdminActivateDeactivate">De-Activate</button>'
			        		}

			        		dataArray.push(data);

			        	if(count == Subamin.length){
							resolve({
								success: '1',
								message: "success",
								data : {
									draw:1,
									recordsTotal:dataArray.length,
									recordsFiltered:dataArray.length,
									data:dataArray
								}
							})
			        	}
			        	count++;
			        	next();
			        })
			    }
			    else{
					resolve({
						success: '1',
						message: "No data found",
						data : {
							
				        }	
					})		    	
			    }    
	      	} catch(error){
	      		reject(error);
	        }
	    })
	}
	
	findAll(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let Subamin  = await this.Subamin.findAll({where: req});
		        resolve(Subamin)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	update(req,conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Subamin.update(req, {where : conds});
		        resolve(user)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}

	insert(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Subamin.create(req);
		        resolve(user)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}

	forgetPassword(req){
    	return new Promise(async (resolve, reject)=>{

		    try{
	          const mailOptions = {
	            from: config.get('MAIL_USERNAME'),
	            to: req.email,
	            subject: 'Reset Password Link.',
	            html: '<b>HI</b><br> <p>Greetings for the day.</p><br> <p>Please click Reset Password to reset your password.</p>  <p><a href='+config.get('app_route')+'admin/resetPassword/'+ req.id+' <button>Reset Password</button></a></p> <br>Regards.<br> <p>Team '+config.get('site_name')+'.</p>'
	          };
	          const sendMailfunc = await this.Mail.sendMail(mailOptions);
	          resolve(sendMailfunc);

		    }catch(e){
		        console.log(e);
		        reject(e);
		    }
    	})
  	}	

	birthday(req){
    	return new Promise(async (resolve, reject)=>{

		    try{
			    var month = moment().month() + 1;
			    var today = moment().date();
			    this.Users.findAll({
				    attributes: ['id','first_name', 'last_name', 'birth_date'],
				    where: {
				    	id : req.id,
				        $and: [
				        	sequelize.where(sequelize.fn('month', sequelize.col("birth_date")), month),				        
				      	],
				      	$or: [
				        	sequelize.where(sequelize.fn('day', sequelize.col("birth_date")), today),
				      	]
				    }
			    }).then(function (result) {
			    	let jsonData;
			    	let data = [];
			    	let count = 0;
			    	if(result.length>0){
				    	asyncLoop(result, async (val, next)=>{
				    		jsonData = {
				    			id : val.id,
				    			first_name : val.first_name,
				    			last_name  : val.last_name
				    		}
				    		data.push(jsonData);
				    		
				    		if(count == result.length -1){
				    			resolve(data);
				    		}
				    		count++;
				    		next();
				    	})			    		
			    	}else{
			    		resolve(data);
			    	}
			    });  	
			}catch(e){
		        console.log(e);
		        reject(e);
		    }
    	})    
	}

	appointmentList(req,conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      	// 	let conds = {
	      	// 		$or: [
				    //     {
				    //         status: 
				    //         {
				    //             $eq: 1
				    //         }
				    //     }, 
				    //     {
				    //         status: 
				    //         {
				    //             $eq: 2
				    //         }
				    //     }, 
				    //     {
				    //         status: 
				    //         {
				    //             $eq: 3
				    //         }
				    //     }
				    // ]
	      	// 	}
		        let appointments  = await this.Appointments.findAll( { order: [['id', 'DESC']] });
		    	let data = [];
		    	let count = 0;
		    	if(appointments.length>0){
			    	asyncLoop(appointments, async (val, next)=>{

			    		data.push(val);
			    		
			    		if(count == appointments.length -1){
			    			resolve(data);
			    		}
			    		count++;
			    		next();
			    	})			    		
		    	}else{
		    		resolve(data);
		    	}
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}

	appointmentUpdate(req,conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let appointments  = await this.Appointments.update(req, {where : conds});
		        resolve(appointments)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}	

	acceptRejectAppointment(req,conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let appointments  = await this.Appointments.update(req, {where : conds});
		        resolve(appointments)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
    } 

	acceptRejectComplaint(req,conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let appointments  = await this.Complaints.update(req, {where : conds});
		        resolve(appointments)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
    }

	complaintsList(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let comments  = await this.Complaints.findAll({where: req, include: [{
					model : this.Users,
					as : 'Users'
				}],	});
		        resolve(comments)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}	

	complaintsReply(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let Complaints_reply  = await this.Complaints_reply.create(req);
		        resolve(Complaints_reply)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}

	saveToGallery(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let saveToGallery  = await this.Gallerymedia.create(req);
		        resolve(saveToGallery)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}			

	createMedia(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Gallery.create(req);
		        resolve(user)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}	

	createTaskMedia(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let saveToGallery  = await this.Tasksmedia.create(req);
		        resolve(saveToGallery)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}			

	createTask(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Tasks.create(req);
		        resolve(user)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}	

	taskList(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let media  = await this.Tasks.findAll({where: req, include: [{
						model : this.Tasksmedia,
						as : 'Media'
					}],	
				});
		        resolve(media)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}	

	mediaList(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let media  = await this.Gallery.findAll({where: req, include: [{
						model : this.Gallerymedia,
						as : 'Media'
					}],	
				});
		        resolve(media)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	commentsGallery(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let commentsGallery  = await this.Comments.findAll({where: req, include: [{
						model : this.Users,
						as : 'Users'
					}],	
				});
		        resolve(commentsGallery)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	delTasks(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let delTasks  = await this.Tasks.destroy({where: {id: req}});
		        let delTasksMedia = await this.Tasksmedia.destroy({ where: {task_id: req} });
		        resolve(delTasks)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}						
	editTasks(req, conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let editTasks  = await this.Tasks.update(req, {where: conds});
		        resolve(editTasks)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}	

	viewRepliesComplaints(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let viewRepliesComplaints  = await this.Complaints_reply.findAll({where: req});
		        resolve(viewRepliesComplaints)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}							

	work(req, params){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		let data = [];
	      		let count = 0; 
		        let work  = await this.Tasks.findAll(
		        	{where: req,
		        		include: [{
							model : this.Tasksmedia,
							as : 'Media'
						}],
						order: [['id', 'DESC']]
					}
				);
				if(work.length>0){
					asyncLoop(work, async (val, next)=>{
						
				        let commentsCount = await this.Comments.count({where : { post_id:val.id, status : 2 } });

				        let likeCount = await this.Likes.count({where : { post_id:val.id,  status : 2 } });

				        let isLike = await this.Likes.findOne({where : { post_id:val.id, user_id : params, status : 2 } });

				        let jsonData = {
				        	id : val.id,
				        	commentsCount : commentsCount,
				        	sub_admin_id: val.sub_admin_id,
				            title: val.title,
				            description: val.description,
				            type: val.type,
				            funds  : val.funds,
				            category: val.category,
				            createdAt: val.createdAt,
				            updatedAt: val.updatedAt,
				            Media: val.Media,
				            likeCount : likeCount,
				            isLike : isLike!=(null||undefined) ? 1 : 0
 
	            		}
				        //console.log(val);
				        data.push(jsonData);
				        if(count == work.length-1){
				        	console.log(data);
				        	resolve(data);
				        }
				        next();
				        count++;			        
				    })    
				}else{
					resolve(data);
				}	
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}		

	home(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		let data;
	      		let complaintStatus = false;
	      		let appointmentsStatus = false;
		        let eventsStatus = false;
		        let  events = await this.Events.findAll({
		        	where: {
		        		createdAt   : { $gt: new Date(Date.now() - (24 * 60 * 60 * 1000) ) },
		        		sub_admin_id : req.sub_admin_id
		        	}
		        });
		        if(events.length>0){
		        	eventsStatus = true;	
		        }
		        let  complaints = await this.Complaints.findAll({
		        	where: {
		        		read_status  : 0, 
		        		user_id : req.userId
		        	}
		        });

		        if(complaints.length>0){
		        	complaintStatus = true
		        }
		        console.log(complaintStatus);
		        let  appointments = await this.Appointments.findAll({
		        	where: {
		        		read_status  : 0, 
		        		user_id : req.userId
		        	}
		        });
		        if(appointments.length>0){
		        	appointmentsStatus = true
		        }
		        console.log(appointmentsStatus);
		        let  galleryId = await this.Gallery.findAll({
		        	attributes: ['id'],
		        	where: {
		        		sub_admin_id : req.sub_admin_id
		        	},
		        	raw : true
		        });
		        let ids= [];
		        await galleryId.forEach(element => console.log(ids.push(element.id)));
		        let  gallery = await this.Gallerymedia.findAll({
		        	attributes: ['media_url'],
		        	where: {
		        		gallery_id : ids,		        		
		        	},
		        	raw : true,
		        	limit : 5
		        });
		        data = {
		        	complaintStatus : complaintStatus,
		        	eventsStatus : eventsStatus,
		        	appointmentsStatus : appointmentsStatus,
		        	images : gallery
		        }	

		        resolve(data);
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	like(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let like  = await this.Likes.create(req);
		        resolve(like)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	unLike(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let like  = await this.Likes.destroy({
		        	where : {sub_admin_id: req.sub_admin_id, user_id:req.user_id, post_id : req.post_id}
		        });
		        resolve(like)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}	

	events(conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let events  = await this.Events.findAll({where : conds});
		        resolve(events)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	addEvents(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let events  = await this.Events.create(req);
		        resolve(events)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	deleteEvents(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let events  = await this.Events.destroy({where : req});
		        resolve(events)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}						
}


module.exports  = SubadminManager;
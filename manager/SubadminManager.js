const nodemailer      = require('nodemailer');
const config          = require('config');
const jwt             = require('jsonwebtoken');
const asyncLoop       = require('node-async-loop');

class SubadminManager {

    constructor(wagner) {
    	this.Users = wagner.get("Users");
    	this.Subamin = wagner.get("Subadmin");
    	this.Gallery = wagner.get("Gallery");
    	this.Gallerymedia = wagner.get("Gallerymedia");
    	this.Comments = wagner.get("Comments");
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

	gallery(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
	      		let dataArray = [];
	      		let data;
	      		let count = 0; 
		        let gallery  = await this.Gallery.findAll({where :req});
		        if(gallery.length>0){
			        asyncLoop(gallery, async (val, next)=>{
			        	let images = await this.Gallerymedia.findAll({where : { gallery_id:val.id } });
			        	let commentsCount = await this.Comments.count({where : { post_id:val.id } });
			        		data = {
			        			images : images,
			        			description : val.description,
			        			title : val.title,
			        			commentsCount : commentsCount
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
}


module.exports  = SubadminManager;	
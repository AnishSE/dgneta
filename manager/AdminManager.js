class AdminManager {

    constructor(wagner) {
    	this.Users = wagner.get("Users");
    	this.Comments = wagner.get("Comments");
    	this.Complaints = wagner.get("Complaints");
    	this.Appointments = wagner.get("Appointments");
    	this.Events = wagner.get("Events");
    	this.Joinevents = wagner.get("Joinevents");
    	this.Subadmin = wagner.get("Subadmin");
    	this.Admin = wagner.get("Admin");
    }
	
	find(req){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Admin.findOne({where : req});
		        resolve(user)
	      	} catch(error){
	        	reject(error);
	        }
	    })
	}

	update(req,conds){
	    return new Promise(async (resolve, reject)=>{
	      	try{
		        let user  = await this.Admin.update(req, {where : conds});
		        resolve(user)
	      	} catch(error){
	      		console.log(error);
	        	reject(error);
	        }
	    })
	}	
}


module.exports  = AdminManager;    
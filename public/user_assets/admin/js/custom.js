jQuery(document).ready(function () {			

	$("#request-login").validate({    
		        rules: { 
		        	email:{
		        		required:true,
		        		email:true
		        	},           
		            password: {
		                required: true,
		                minlength: 8
		            }
		        },
		        messages: { 
		        	email: "Please enter email",
			        password: {
			            required: "Please provide a password",
			            minlength: "Password must be at least 8 characters long"
			        }		            
		        },
		        submitHandler: function(form) {		        	
		            $.ajax({
			                url: form.action,
			                type: form.method,
			                data: $(form).serialize(),
			                success: function(response) {
			                	if(response.success == 1){
			                    	// $('.successmsg').html(response.successmsg);
			                    	window.location.href = 'dashboard';															
			                    }else{
			                    	$('.errormsg').html(response.errormsg);
			                    }
			                }            
			        });  
		        }
	}); 

	$("form[name='changePasswordForm']").validate({    
		        rules: {            
		            new_password: {
		                required: true,
		                minlength: 8
		            },
		            confirm_password: {
			            equalTo: "#new_password"
			          }
		        },
		        messages: {            
		            new_password: {
		                required: "Please provide a new password",
		                minlength: "Your new password must be at least 8 characters long"
		            },
		            confirm_password: "Please enter confirm password same as password",
		        },
		        submitHandler: function(form) {
		            $.ajax({
			                url: form.action,
			                type: form.method,
			                data: $(form).serialize(),
			                success: function(response) {			                    
			                    if(response.success == 1){
			                    	$('.successmsg').html(response.successmsg);
			                    }else{
			                    	$('.errormsg').html(response.errormsg);
			                    }
			                    setTimeout(() =>  {
									$('#changePasswordModal').modal('hide');  	
								}, 2000); 								
								window.location.href = 'login';															
			                }            
			            });  
		        }
	}); 

    $('.createSubAdminForm').validate({    
			        rules: {
			          first_name: "required",
			          last_name: "required",
			          email:{
			          	required:true,
			          	email:true
			          },		          
			          password: {
			            required: true,
			            minlength: 6
			          },
			          present_position: "required"
			        },
			        messages: {
			          first_name: "Please enter first name",
			          last_name: "Please enter last name",
			          email: "Please enter email",
			          password: {
			            required: "Please provide a password",
			            minlength: "Password must be at least 6 characters long"
			          },
			          confirm_password: "Please enter confirm password same as password",
			          present_position: "Please enter present position",		          
			        },
			        submitHandler: function(form) {
			            // form.submit();     
			            $.ajax({
			                url: form.action,
			                type: form.method,
			                data: $(form).serialize(),
			                success: function(response) {			                    
			                    if(response.success == 1){
			                    	$('.successmsg').html(response.successmsg);
			                    }else{
			                    	$('.errormsg').html(response.errormsg);
			                    }
			                    setTimeout(() =>  {
									$('#addSubAdminModal').modal('hide');  	
								}, 2000); 								
								location.reload(true);
			                }            
			            });   
			        }
	});

	$("#forgotPassword").validate({    
		        rules: { 
		        	email:{
		        		required:true,
		        		email:true
		        	}
		        },
		        messages: { 
		        	email: "Please enter email"			        		            
		        },
		        submitHandler: function(form) {		        	
		            $.ajax({
			                url: form.action,
			                type: form.method,
			                data: $(form).serialize(),
			                success: function(response) {			                    
			                    if(response.success == 1){
			                    	$('.successmsg').html(response.successmsg);			                    	
			                    }else{
			                    	$('.errormsg').html(response.errormsg);
			                    }
			                    setTimeout(() =>  {
									window.location.href = "login";
								}, 2000);
			                }            
			        });  
		        }
	});

	$.validator.addMethod("validateCategory", function(value, element) {
            	return this.optional(element) || value != 'default' ;
           	}, " Please select category"); 


	$('.addMediaForm').validate({    
                    rules: {
                      title: "required",
                      description: "required",
                      fileInput:"required"
                    },
                    messages: {
                      title: "Please enter title",
                      description: "Please enter description",
                      fileInput: "Please choose media"
                    },
                    submitHandler: function(form) {
                        form.submit();     
                        // $.ajax({
                        //     url: form.action,
                        //     type: form.method,
                        //     data: $(form).serialize(),
                        //     success: function(response) {                               
                        //         if(response.success == 1){
                        //             // $('.successmsg').html(response.successmsg);
                        //             $('.addMediaForm').modal('hide'); 
                        //             window.location.href = "getMedia";  
                        //         }else{
                        //             $('.errormsg').html(response.errormsg);
                        //         }
                        //         // setTimeout(() =>  {
                        //         //     $('#addSubAdminModal').modal('hide');   
                        //         // }, 2000);                               
                        //         // location.reload(true);
                        //     }            
                        // });   
                    }
    });

    $('.addMoreMediaForm').validate({    
                    rules: {
                      fileInput:"required"
                    },
                    messages: {
                      fileInput: "Please choose media"
                    },
                    submitHandler: function(form) {
                        form.submit();     
                    }
    });

    $('.addMoreWorkForm').validate({    
                    rules: {
                      fileInput:"required"
                    },
                    messages: {
                      fileInput: "Please choose media"
                    },
                    submitHandler: function(form) {
                        form.submit();     
                    }
    });

    $('.addWorkForm').validate({    
                    rules: {                      
                      category: {
			          	required:true,
			          	validateCategory:true
			          },
                      title: "required",
                      description: "required", 	
                      fileInput:"required"
                    },
                    messages: {
                      category: "Please select category",
                      title: "Please enter title",
                      description: "Please enter description",
                      fileInput: "Please choose media"
                    },
                    submitHandler: function(form) {
                        form.submit();     
                    }
    });

    $('.editWorkForm').validate({    
                    rules: {
                      category: {
			          	required:true,
			          	validateCategory:true
			          },
                      title: "required",
                      description: "required", 	
                      fileInput:"required"
                    },
                    messages: {
                      category: "Please select category",
                      title: "Please enter title",
                      description: "Please enter description",
                      fileInput: "Please choose media"
                    },
                    submitHandler: function(form) {
                        form.submit();     
                    }
    });

    $('.addSocialWorkForm').validate({    
                    rules: {                      
                      title: "required",
                      description: "required", 	
                      fileInput:"required"
                    },
                    messages: {                      
                      title: "Please enter title",
                      description: "Please enter description",
                      fileInput: "Please choose media"
                    },
                    submitHandler: function(form) {
                        form.submit();     
                    }
    });

    $('.editSocialWorkForm').validate({    
                    rules: {                      
                      title: "required",
                      description: "required", 	
                      fileInput:"required"
                    },
                    messages: {                      
                      title: "Please enter title",
                      description: "Please enter description",
                      fileInput: "Please choose media"
                    },
                    submitHandler: function(form) {
                        form.submit();     
                    }
    });

    $(".upload-button").on('click', function() {
        $(".file-upload").click();
    });

    $(".cover-upload-button").on('click', function() {
        $(".file-cover-upload").click();
    });


    $('.upload_photo').hide();
    $('.upload_cover_photo').hide();

    $(".file-upload").on('change', function(){
        readURL(this);
    });
    
    $(".file-cover-upload").on('change', function(){
        readURL1(this);
    });
    
    var readURL = function(input) {
	    if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.profile-pic').attr('src', e.target.result);
            }
            $('.upload_photo').show();
                  
            reader.readAsDataURL(input.files[0]);
        }
    }

    var readURL1 = function(input) {
	    if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.cover_photo').attr('src', e.target.result);
            }
            $('.upload_cover_photo').show();
                  
            reader.readAsDataURL(input.files[0]);
        }
    }

});	
    
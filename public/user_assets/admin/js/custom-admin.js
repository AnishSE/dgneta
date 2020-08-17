(function ($) {
    "use strict";

    $('#data-table').DataTable({
        // "dom": 'ftlip',//'<"html5buttons" B>lTfgitp',
        // "order": [[0,'asc']],
		// "searching": false,
		// "paging": true,
		// "pagingType": "full_numbers",
        // "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true,
        "bAutoWidth": true,
        "bSort": false,
        "searching": true,
        "order": [[0,'asc']],
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                        } else {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        }
         }
    });

    $('#user_datatable').DataTable({
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true,
        "bAutoWidth": true,
        "bSort": false,
        "searching": true,
        "order": [[0,'asc']],
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                        } else {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        }
         }
    });

    $('#bday_datatable').DataTable({        
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true,
        "bAutoWidth": true,
        "bSort": false,
        "searching": true,
        "order": [[0,'asc']],
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                        } else {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        }
         }
    });

    $('#appointment_datatable').DataTable({        
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true,
        "bAutoWidth": true,
        "bSort": false,
        "searching": true,
        "order": [[0,'asc']],
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                        } else {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        }
         }
    });

    $('#gallery_datatable').DataTable({        
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true,
        "bAutoWidth": true,
        "bSort": false,
        "searching": true,
        "order": [[0,'asc']],
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                        } else {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        }
         }
    });

    $('#work_datatable').DataTable({        
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true,
        "bAutoWidth": true,
        "bSort": false,
        "searching": true,
        "order": [[0,'asc']],
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                        } else {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        }
         }
    });

    $('#complaints_datatable').DataTable({        
        "bPaginate": true,
        "bLengthChange": true,
        "bFilter": true,
        "bInfo": true,
        "bAutoWidth": true,
        "bSort": false,
        "searching": true,
        "order": [[0,'asc']],
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50], [10, 25, 50]],
        "fnDrawCallback": function (oSettings) {
                        if (oSettings._iDisplayLength > oSettings.fnRecordsDisplay()) {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                        } else {
                            $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                        }
         }
    });

    $('.reschedule_btn').click(function(){
        let appDate = $(".reschedule_btn").attr("data-appDate");
        let appTime = $(".reschedule_btn").attr("data-appTime");
        let id = $(".reschedule_btn").attr("data-id");
        $('input[name="datepicker"]').val(appDate);
        $('input[name="timepicker"]').val(appTime);
        $('input[name="id"]').val(id);
    });

    //    $('input[name="datepicker"]').datetimepicker({        
    //  format: 'mm/dd/yy'
    //  // startDate: '-3d',
    //  // autoApply:  true             
    // });

    $('input[name="datepicker"]').datetimepicker({
        format: 'YYYY-MM-DD',
        minDate: new Date(),
    });

    $('input[name="timepicker"]').datetimepicker({
        format: 'LT'        
    });   

    $(".addMoreBtn").on('click',function(){
        let galleryId = $(this).attr("data-gallery_id");        
        $("#gallery_id").val(galleryId);        
    });

    $(".addWorkMoreBtn").on('click',function(){
        let taskId = $(this).attr("data-task_id");           
        $("#task_id").val(taskId);                
    });  

    $('.viewWorkCommentBtn').on('click', function(){
        let taskId = $(this).attr("data-task_id");           
        $.ajax({
            url: '/admin/commentsWork/'+taskId,                            
            success: function(response) {
                if(response.success == 1){
                    $('.comments_data').text(response.data[0].message);
                }else{
                    $('.comments_data').text('No Comments Found');               
                }
            }               
        });
    });

    $('.viewGalleryCommentBtn').on('click', function(){
        let galleryId = $(this).attr("data-gallery_id");           
        $.ajax({
            url: '/admin/commentsGallery/'+galleryId,                            
            success: function(response) {
                if(response.success == 1){
                    $('.comments_data').text(response.data[0].message);
                }else{
                    $('.comments_data').text('No Comments Found');               
                }
            }               
        });
    });

    $('.deleteWorkBtn').on('click', function(){
        let taskId = $(this).attr("data-task_id");           
        $('.deleteBtn').attr('data-task_id', taskId);
    });

    $('.deleteSocialWorkBtn').on('click', function(){
        let taskId = $(this).attr("data-task_id");           
        $('.deleteSocialBtn').attr('data-task_id', taskId);
    });

    $('.editWorkBtn').on('click', function(){
        let taskId = $(this).attr("data-task_id");           
        $('.id').val(taskId);
        $.ajax({
            url: '/admin/getTasks/'+taskId,                            
            success: function(response) {
                console.log(response);
                
                if(response.success == 1){
                    if(response.data[0].title) {
                        $('.workTitle').val(response.data[0].title);                                                             
                    }
                    if(response.data[0].description) {
                        $('.workDescription').val(response.data[0].description);                                                             
                    }
                    if(response.data[0].category) {                        
                        $(".workCategory > option").each(function() {
                            if($(this).val() == response.data[0].category){
                                $(this).attr("selected","selected");
                            }
                        });                                                             
                    }
                }
            }               
        });
    });

    $('.deleteBtn').on('click', function(){
        let taskId = $(this).attr("data-task_id");           
        $.ajax({
            url: '/admin/delTasks/'+taskId,                            
            success: function(response) {
                if(response.success == 1){
                    $('#deleteWorkModal').modal('hide');
                    window.location.href = 'developmentWork';                                                         
                }
            }               
        });
    });

    $('.deleteSocialBtn').on('click', function(){
        let taskId = $(this).attr("data-task_id");           
        $.ajax({
            url: '/admin/delTasks/'+taskId,                            
            success: function(response) {
                if(response.success == 1){
                    $('#deleteWorkModal').modal('hide');
                    window.location.href = 'socialWork';                                                         
                }
            }               
        });
    });

    $('.deletePendingBtn').on('click', function(){
        let taskId = $(this).attr("data-task_id");           
        $.ajax({
            url: '/admin/delTasks/'+taskId,                            
            success: function(response) {
                if(response.success == 1){
                    $('#deleteWorkModal').modal('hide');
                    window.location.href = 'pendingWork';                                                         
                }
            }               
        });
    });

    $('.deleteBtn').on('click', function(){
        let taskId = $(this).attr("data-task_id");           
        $.ajax({
            url: '/admin/delTasks/'+taskId,                            
            success: function(response) {
                if(response.success == 1){
                    $('#deleteWorkModal').modal('hide');
                    window.location.href = 'developmentWork';                                                         
                }
            }               
        });
    });

    $('.viewReply').on('click', function(){
        let complaintId = $(this).attr("data-complaint_id");         
        $.ajax({
            url: '/admin/viewRepliesComplaints/'+complaintId,                            
            success: function(response) {
                console.log(response);
                if(response.success == 1){                    
                    $('.complaint_data').text(response.data[0].message);
                }else{
                    $('.complaint_data').text('No Reply Found');               
                }
            }               
        });
    });

    $('.replyComplaint').on('click', function(){
        let complaintId = $(this).attr("data-complaint_id");           
        $('#complaint_id').val(complaintId);
    });

})(jQuery);
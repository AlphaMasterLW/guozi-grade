$(document).ready(function (){

    if ($.cookie("remember")=="true") {
        $("#remember_me").prop("checked", true);
        $("#username").val($.cookie("username"));
        $("#password").val($.cookie("password"));
    }

    // 表单验证
    $('#loginForm')
        .formValidation({
            icon: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
            	username: {
                    message: '输入不合法',
                    validators: {
                        notEmpty: {
                            message: '用户名不能为空'
                        },
                        regexp: {
                            regexp: /^[a-zA-Z0-9_\.]+$/,
                            message: '用户名必须是数字、字母、点或下划线'
                        }
                    }
                },
                password: {
                    validators: {
                        notEmpty: {
                            message: '密码不能为空'
                        }
                    }
                }
            }
        })
        .on('success.form.fv', function (e) {
            e.preventDefault();
            var $form = $(e.target),
            $button = $form.data('formValidation').getSubmitButton();
            
            if ($button) {
            	$("#loginForm")[0].submit();
            }
        });


    //记住用户名和密码
    $('#remember_me').on('change', function () {
        save();
    });

});


                 //保存用户名和密码
    function save() {
    if ($("#remember_me").prop("checked")) {
        var username = $("#username").val();
        var password = $("#password").val();
        $.cookie("remember", "true", { expires: 7 }); //存储一个带7天期限的cookie
        $.cookie("username", username, { expires: 7 });
        $.cookie("password", password, { expires: 7 });
    }else{
        $.cookie("remember", "false", { expire: -1 });
        $.cookie("username", "", { expires: -1 });
        $.cookie("password", "", { expires: -1 });
    }

}


  /*
  * Ajax用户登录
  * */

/* $.ajax({
     type : 'POST',
     async : true,
     url : 'sys/user/login.shtml',
     data : {
         username:$("#username").val().trim(),
         password:$("#password").val().trim()
     },
     dataType : 'json',
     error:function(){
         bootbox.alert("登录失败请稍后重试");
     },
     success : function(data) {
         if (!data.success){
             bootbox.alert({
                 size: "small",
                 message: "用户名或密码错误",
             })
         } else {
             //登录成功
             window.location.href = "/sys/user/admin.shtml";
         }
     }
 });*/




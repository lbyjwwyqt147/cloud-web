//== Class Definition
var SnippetLogin = function() {

    var login = $('#m_login');

    // alert
    var showErrorMsg = function(form, type, msg) {
        var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        mUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    //== Private Functions

    // 显示注册页面
    var displaySignUpForm = function() {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signin');

        login.addClass('m-login--signup');
        mUtil.animateClass(login.find('.m-login__signup')[0], 'flipInX animated');
    }

    //显示登录页面
    var displaySignInForm = function() {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signup');

        login.addClass('m-login--signin');
        mUtil.animateClass(login.find('.m-login__signin')[0], 'flipInX animated');
    }

    //显示找回密码页面
    var displayForgetPasswordForm = function() {
        login.removeClass('m-login--signin');
        login.removeClass('m-login--signup');

        login.addClass('m-login--forget-password');
        mUtil.animateClass(login.find('.m-login__forget-password')[0], 'flipInX animated');
    }

    //注册点击事件
    var handleFormSwitch = function() {
        //找回密码点击事件
        $('#m_login_forget_password').click(function(e) {
            e.preventDefault();
            handleRemoveErrorPrompt();
            displayForgetPasswordForm();
        });
        //找回密码页面 取消按钮事件
        $('#m_login_forget_password_cancel').click(function(e) {
            e.preventDefault();
            handleRemoveErrorPrompt();
            displaySignInForm();
        });
        //注册 点击事件
        $('#m_login_signup').click(function(e) {
            e.preventDefault();
            handleRemoveErrorPrompt();
            displaySignUpForm();
        });
        //注册页面 取消按钮事件
        $('#m_login_signup_cancel').click(function(e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    //登录页面登录按钮事件
    var handleSignInFormSubmit = function() {
        $('#m_login_signin_submit').click(function(e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    userAccount: {
                        required: true
                    },
                    userPassword: {
                        required: true
                    }
                },
                messages: {
                        userAccount: {
                                required: "请输入登录用户."
                        },
                        userPassword: {
                                required: "请输入登录密码."
                        }
                    }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                type: 'post',
                url: commonUtil.baseAjaxUrl+'/user/login',
                success: function(response, status, xhr, $form) {
                    if (response.status == 0){
                        //得到登录后的token
                        var access_token = response.data.access_token;
                        localStorage.setItem('user_token', JSON.stringify(access_token));
                        localStorage.setItem('user',  JSON.stringify(response.data));
                        // window.location.href="assets/snippets/pages/home/index.html";
                    } else if (response.status == -5){
                        showErrorMsg(form, 'danger', response.message);
                    } else {
                        showErrorMsg(form, 'danger', '错误的用户名或密码.');
                    }
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                },
                error:function (response, status, xhr) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', '网络出现错误.');
                }
            });
            return false; // 阻止表单自动提交事件，必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
        });
    }

    //注册页面注册按钮事件
    var handleSignUpFormSubmit = function() {
        $('#m_login_signup_submit').click(function(e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    userName: {
                        required: true,
						maxlength: 20
                    },
                    userAccount: {
                        required: true,
						maxlength: 45
                    },
                    userEmail: {
                        required: true,
                        email: true,
						maxlength: 45
                    },
                    userPassword: {
                        required: true,
						minlength: 6
                    },
                    rpassword: {
                        required: true
                    },
                    agree: {
                        required: true
                    }
                },
                messages: {
                    userName: {
                        required: "请输入用户名称.",
						maxlength: "用户名称最大长度为20."
                    },
                    userAccount: {
                        required: "请输入注册账号.",
						maxlength: "账号最大长度为45."
                    },
                    userEmail: {
                        required: "请输入电子邮箱.",
                        email: "电子邮箱格式错误.",
						maxlength: "电子邮箱最大长度为45."
                    },
                    userPassword: {
                        required: "请设置密码.",
						minlength: "密码长度至少6位."
                    },
                    rpassword: {
                        required: "请确认密码."
                    },
                    agree: {
                        required: "请同意协议条款."
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                url: commonUtil.baseAjaxUrl+'/user/register',
                type: 'post',
                success: function(response, status, xhr, $form) {
                    console.log(response);
                    if(response.status == 0){
                        form.clearForm();
                        form.validate().resetForm();

                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.m-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(signInForm, 'success', '谢谢你！注册成功，请登录.');
                    }else {
                        showErrorMsg(form, 'danger', '注册账户失败，请稍后再试.');
                    }
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);

                },
                error:function (response, status, xhr) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', '网络出现错误.');
                }
            });
            return false;
        });
    }

    //找回密码页面 找回按钮事件
    var handleForgetPasswordFormSubmit = function() {
        $('#m_login_forget_password_submit').click(function(e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    email: {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    email: {
                        required: "请输入注册时的电子邮箱.",
                        email: "电子邮箱格式错误."
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '',
                type: 'post',
                success: function(response, status, xhr, $form) { 
                	// similate 2s delay
                	setTimeout(function() {
                		btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false); // remove 
	                    form.clearForm(); // clear form
	                    form.validate().resetForm(); // reset validation states

	                    // display signup form
	                    displaySignInForm();
	                    var signInForm = login.find('.m-login__signin form');
	                    signInForm.clearForm();
	                    signInForm.validate().resetForm();

	                    showErrorMsg(signInForm, 'success', '密码已发送到您的电子邮件.');
                	}, 2000);
                },
                error:function (response, status, xhr) {
                    btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                    showErrorMsg(form, 'danger', '网络出现错误.');
                }
            });
            return false;
        });
    }

    //移除 错误验证提示信息
    var handleRemoveErrorPrompt = function(){
        $(".form-control-feedback").remove();
        $('.alert').remove();
    }

    //== Public Functions
    return {
        // public functions
        init: function() {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgetPasswordFormSubmit();
			
	
        }
    };
}();

//== Class Initialization
jQuery(document).ready(function() {
    SnippetLogin.init();
});
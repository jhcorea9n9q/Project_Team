function tryLogin(){
	$("form").submit(function(e){
		e.preventDefault();
		var userEmail = $("form #id").val();
		var userPassword = $("form #pw").val();
		$.ajax({
			type: "post",
			url: "/ljh/login",
			data:{
				"userEmail":userEmail,
				"userPassword":userPassword
			}
		}).done(function(data) {
			var d = JSON.parse(data);
			if(d.tryLogin == "NO") {
				alert("이메일 아이디가 존재하지 않거나 비밀번호가 틀립니다!");
				document.getElementById('id').focus();
			}else if(d.tryLogin == "OK") {
				alert("고품격 렌탈 사이트, Vánity Fáir에 오신 것을 환영합니다. " + d.userName + " 님.");
				loginMenuCss(d.userEmail, d.userName);
			}
		});
	});
}

function seeUserInfo() {
	$.ajax({
		type: "post",
		url: "/ljh/userCheck"
	}).done(function(data){
		var d = JSON.parse(data);
		var list = d.list;
		if(list != null) {
			loginMenuCss(list.userEmail, list.userName);
		}
	});
}

function loginMenuCss(userEmail, userName) {
	$("#login_home").css("display","none");
	$(".loader").css("display","none");
	$("#myPage").css("display","block");
	$("#userEmail").text(userEmail);
	$(".userName").text(userName);
}

function logout(){
	$.ajax({
		type: "post",
		url: "/ljh/logout"
	}).done(function(data) {
		location.href="main.html";
	});
}

function userOut(){
	var really = confirm("정말로 취소하시겠습니까?");
	if(really == true){
		$.ajax({
			type: "post",
			url: "/ljh/userOut"
		}).done(function(data) {
			var d = JSON.parse(data);
			if(d.status == 1) {
				alert("탈퇴 처리가 완료되었습니다.");
				location.href="main.html";
			}
		});
	} else {
		alert("앞으로도 저희 사이트를 사랑해 주십시오.");
	}
}

function memberOpen(){
            var Url = "member.html";	//팝업창에 출력될 페이지 URL
            var screenW = screen.availWidth;
            var screenH = screen.availHeight;
            var posT=(screenH-375) / 2;
            var posL=(screenW-784) / 2;
            var Option = "width=715, height=410, top="+posT+",left="+posL+", resizable=no, scrollbars=no, status=no;";    //팝업창 옵션(optoin)

            window.open(Url,"",Option);
        }

function returnOpen() {
    location.href = "main.html";
}

function flieUpload() {
	console.log("업로드하자");
	var screenW = screen.availWidth;
    var screenH = screen.availHeight;
    var posT=(screenH-375) / 2;
    var posL=(screenW-784) / 2;
    var Option = "width=715, height=410, top="+posT+",left="+posL+", resizable=no, scrollbars=no, status=no;";
		
	window.open("fileUpload.html", "", Option);
}
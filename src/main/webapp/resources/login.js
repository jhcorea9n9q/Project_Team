// 로그인 시도시 실행내용
function tryLogin(){
	$("#login").submit(function(e){
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
				if(d.userName == "관리자") {
					alert("관리자 모드로 들어갑니다.");
				}
				else {
					alert("고품격 렌탈 사이트, Vánity Fáir에 오신 것을 환영합니다. "
							+ d.userName + " 님.");
					}
				loginMenuCss(d.userEmail, d.userName);
			}
		});
	});
}

// 세션 체크용 메소드
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

// 로그인 되어있을 경우 마이페이지 변화
function loginMenuCss(userEmail, userName) {
	$("#login_home").css("display","none");
	$(".loader").css("display","none");
	$("#myPage").css("display","block");
	$("#userEmail").text(userEmail);
	$(".userName").text(userName);
	if(userName == "관리자") {
		$(".adminNo").hide();
	}
}

// 로그아웃 메소드
function logout(){
	$.ajax({
		type: "post",
		url: "/ljh/logout"
	}).done(function(data) {
		location.href="main.html";
	});
}

// 회원탈퇴
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

// 회원가입창 띄우기
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

// 마이페이지에서 실행되는 매물 업로드용 메소드
function fileUpload() {
	$("#myPage form").show();
	$.ajax({
		type: "post",
		url: "/ljh/userCheck"
	}).done(function(data){
		var d = JSON.parse(data);
		var list = d.list;
		if(list != null) {
			var usNo = list.userNo;
		}
		$("#myPage form").submit(function(e){
			e.preventDefault();
			var v0 = usNo;
			var v1 = $("#myPage form select").val();
			var v2 = $("#myPage form input:checked").val();
			if (v2=="bag"){
				v2 = "Y";
			}else if(v2=="watch"){
				v2 = "N";
			}
			var v3 = $("#myPage form input").eq(2).val();
			var v4 = $("#myPage form input").eq(3).val();
			var v5 = $("#myPage form input").eq(4).val();
			$.ajax({
				type:"post",
				url: "/ljh/fileUpload",
				data:{"userNo":v0,
					"rentZone":v1,
					"goodsClass":v2,
					"goods":v3,
					"fileName":v3,
					"cost":v4,
					"fileURL":v5}
			}).done(function(data){
				var d = JSON.parse(data);
				if(d.upload == "OK") {
					alert("매물 등록 성공.");
					location.href="/ljh/page/main.html";
				}else {
					alert("매물 등록 실패.");
				}
			});
		});
	
	});
}
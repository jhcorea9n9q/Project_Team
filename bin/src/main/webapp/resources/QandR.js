// 고객 센터 화면 스크립트
function qna() {
	qnalist(1, "공지사항", "#qa_table1");
	admitcheck("1");
	var i = 0;
	// 첫 화면 세팅
	
	// 게시판 변경 시
    $("#qa_tap li").off().on("click", function(){
    	for (var j = 1; j<12; j++){ // 페이지 번호 생성용
			$("#qa_bno li").eq(j).text(j);
		} 
    	i = $(this).index() + 1;
        var title = ["<h3>공지사항</h3>", "<h3>자주묻는 질문</h3>", "<h3>고객의견</h3>"];
        $("#qa_board table").hide();
        $("#qa_table" + i).show();
        $("#qa_btitle").empty();
        $("#qa_btitle").html(title[i - 1]);
        if (i == 1) {						  // 공지사항
            $("#qa_bno").css("display", "inline-block");
            $("#qa_write").css("display", "none");
            $("#qa_ta2tap").css("display", "none");
            $("#qa_bsearch").css("display", "inline-block");
            admitcheck("1");
            qnalist(1, "공지사항", "#qa_table1");
        } else if (i == 2) {				  // 자주묻는 질문
            $("#qa_bno").css("display", "none");
            $("#qa_ta2tap").css("display", "inline-block");
            $("#qa_bsearch").css("display", "none");
            qnalist_2("가입문의");
        } else if (i == 3) {				  // 고객의견
            $("#qa_bno").css("display", "inline-block");
            $("#qa_write").css("display", "block");
            $("#qa_ta2tap").css("display", "none");
            $("#qa_bsearch").css("display", "inline-block");
            admitcheck("3");
            qnalist(1, "고객의견", "#qa_table3");
        }
    });
    
    // 검색기능 사용시
    $("#qa_bsearch").submit(function(e){
    	e.preventDefault();
    	i = 4;
    	$("#qa_write").css("display", "none");
    	$("#qa_ta2tap").css("display", "none");
    	$("#qa_board table").hide();
    	$("#qa_table4").show();
    	var boardSearch = "%" + $("#qa_bsinput").val() + "%";
    	var boardClass = $("#qa_btitle h3").text();
    	if (boardSearch == "__No__%") {
    		boardSearch = "No";
    	}
    	qnalist("1", boardClass, "#qa_table4", boardSearch);
    });
    
    // 페이지 번호 클릭시
    $("#qa_bno li").off().on("click", function(){
    	if(i != 2) {
    		var PageNumber = $(this).text();
    		if(PageNumber != "▶" && PageNumber != "◀") { // 페이지 번호 클릭시
    			if(i == 3) {
    				$("#qa_table3").empty();
        			qnalist(PageNumber, "고객의견", "#qa_table3");
    			}else if (i == 0 || i == 1) {
    				$("#qa_table1").empty();
    				qnalist(PageNumber, "공지사항", "#qa_table1");
    			}else if (i == 4) {
    				$("#qa_table4").empty();
    				var boardSearch = $("#qa_bsinput").val() + "%";
    		    	var boardClass = $("#qa_btitle h3").text();
    				qnalist(PageNumber, boardClass, "#qa_table4", boardSearch);
    			}
    		} else if (PageNumber == "▶") { // 뒤페이지로 가기
    			for (var j = 1; j<12; j++){
    				var no = $("#qa_bno li").eq(j).text();
    				no = Number(no) + 11;
    				$("#qa_bno li").eq(j).text(no);
    			}
    		} else if (PageNumber == "◀") { // 앞페이지로 가기
    			for (var j = 1; j<12; j++){
    				var no = $("#qa_bno li").eq(j).text();
    				if (no != 1) {
    					no = Number(no) - 11;
        				$("#qa_bno li").eq(j).text(no);
    				} else if (no == 1) {
    					break;
    				}
    			}
    		}
    	}
    });
    
    // 자주묻는 질문의 경우
    $("#qa_ta2tap li").off().on("click",function(){
		var board_Class = $(this).text();
		qnalist_2(board_Class);
	});
    
    QnAdetail();
    qnainsert();
}

// list 생성해주기 위한 공통메소드 (페이지 넘버, 게시판 분류, 테이블 분류, 검색기능용 변수)
function qnalist(PageNumber, boardClass, tableId, boardSearch) {
	if (boardSearch == null){ 
		var URL = "/ljh/QnAboardList";
	} else if (boardSearch != null) { // boardSearch 변수가 담겼을 때만 검색기능 실행
		var URL = "/ljh/QnASearchList";
	}
	$.ajax({
		type: "post",
		url:URL,
		data:{"PageNumber":PageNumber, "boardClass":boardClass,"boardSearch":boardSearch}
	}).done(function(data){
		var d = JSON.parse(data).list;
		var NewBoardNo = d[0] - (PageNumber * 10);
		if (NewBoardNo < 0) {
			NewBoardNo = 0;
		}
		var comYN = "";
		$(tableId).empty();
		// 조건에 맞춰 테이블을 비우고 html을 재생성
		for(var i=1; i<d.length; i++){
			var boardList = d[i];
			if (boardList.comYn == "N") { // 관리자에 의해 체크되었나의 유무를 판단
				comYN = "확인중";
			}else if (boardList.comYn == "Y") {
				comYN = "완료!";
			}
			var html = "<tr>";
				html += "<td>"+(NewBoardNo+i)+"</td>";
				html += "<td class='qa_btext'><a href='main.html?boardNo=" + boardList.boardNo +"'>"+ boardList.boardTitle +"</a></td>";
				if(boardClass == "고객의견") {
					html += "<td>" + comYN + "</td>";
				} // 고객의견의 경우 관리자 체크 유무를 생성해줌.
				html += "<td>" + boardList.regDate + "</td>";
				html += "</tr>";
				$(tableId).prepend(html);
		}
		var html_tr = "<tr><th>번호</th><th>제목</th>";
		if(boardClass == "고객의견") {
			html_tr += "<th>답변유무</th>";
		}
		html_tr += "<th>작성일자</th></tr>";
		// 고객의견의 경우 관리자 체크 유무를 생성해줌(테이블 이름)
		$(tableId).prepend(html_tr);
	});	
}

// 자주묻는 질문을 위한 특별한 list 생성 메소드
function qnalist_2(boardClass) {
	var PageNumber = 1;
	$.ajax({
		type: "post",
		url:"/ljh/QnAboardList",
		data:{"PageNumber":PageNumber, "boardClass":boardClass}
	}).done(function(data){
		var d = JSON.parse(data).list;
		$("#qa_table2").empty();
		for(var i=1; i<d.length; i++) {
			var boardList = d[i];
			html = "<tr><td><b>Q</b></td>";
			html += "<td class='qa_btext'>"+ boardList.boardTitle +"</td>";
			html += "<td><b>A</b></td>";
			html += "<td class='qa_btext'>"+ boardList.boardContents +"</td></tr>";
			$("#qa_table2").append(html);
		}
	});
}

// 글쓰기 기능
function qnainsert(){
	// 글쓰기 버튼 누를 경우 input 화면 생성
	$("#qa_write").off().on("click", function(){
    	$("#qa_main").empty();
    	$("#qa_inputplease").css("display", "inline-block");
    });
    
	// input화면 submit 시 아래를 실행
    $("#qa_inputplease").submit(function(e){
    	e.preventDefault();
    	var V1 = $("#qa_inputplease input").eq(0).val();
    	var V2 = $("#qa_inputplease input").eq(1).val();
    	// null값 예외처리
    	if(V1 == ""){
    		alert("제목을 입력해 주세요.");
    		document.getElementById('qa_ip1').focus();
    	}else{
    		if(V2 == ""){
    			alert("내용을 입력해 주세요.");
        		document.getElementById('qa_ip2').focus();
    		}else{
    			$.ajax({
    	    		type:"post",
    	    		url: "/ljh/QnAinsert",
    	    		data: {"boardTitle" : V1,
    	    			"boardContents" : V2}
    	    	}).done(function(data){
    	    		var d = JSON.parse(data);
    	    		if(d.logincheck == "NO") { // 로그인되어있지 않을 시 로그인창으로 강제이동
    	    			alert("우선 로그인 해주십시오.");
    	    			localStorage.setItem("url", "login.html");
    	    			location.href="main.html";
    	    		}else{
    	    			if(d.status == 1) {
    	        			alert("작성이 완료되었습니다.");
    	        			location.href="main.html";
    	        		}else if(d.status == 0) {
    	        			alert("작성을 실패했습니다. 다시 시도해주십시오.");
    	        		}
    	    		}
    	    		
    	    	});
    		}
    	}
    });
    
    // 취소 버튼 누를시 실행.
    $("#qa_rollback").off().on("click",function(){
    	var checkmessage = confirm("정말로 취소하시겠습니까?");
    	if(checkmessage == true){
    		location.href="main.html";
    	}
    });
}

// 각 게시물 확인용 공통 메소드.
function QnAdetail(){ 
	var Qu;
	var query = window.location.href.slice(window.location.href.indexOf('?') + 1);
	if(query!="http://gudi.iptime.org:10091/ljh/page/main.html"){
		Qu = query.split('=');
		var bNo = Qu[1];
		$.ajax({
			type:"post",
    		url: "/ljh/QnAdetail",
    		data: {"boardNo":bNo}
		}).done(function(data){
			var d = JSON.parse(data);
			if(d.boardClass == "공지사항" || d.boardClass == "고객의견") {
			// 공지사항 혹은 고객의견일때만 detail 화면을 표시
				$("#qa_main").empty();
				$("#qa_checkdetails").css("display", "inline-block");
				$("#qa_checkdetails h3").text(d.boardTitle);
				$("#qa_checkdetails h5").text("작성자 이름 : " + d.userNo);
				$("#qa_checkdetails p").text(d.boardContents);
				
				// 취소 버튼 누를시 뒤로.
				$("#qa_rollback2").off().on("click",function(){
			    	location.href="main.html";
			    });
				
				$.ajax({ // 로그인 세션 체크.
					type: "post",
					url: "/ljh/userCheck"
				}).done(function(data){
					var uc = JSON.parse(data);
					var list = uc.list;
					if(list != null) { // 로그인 된 사람이 있을 때
						if(list.userName != "관리자") { // 일반 유저일 경우
							if(list.userName != d.userNo) {
								// 게시물 작성자와 현재 유저가 일치하지 않으면 수정/삭제 버튼 숨김.
								$("#qa_updatebutton").hide();
								$("#qa_deletebutton").hide();
							}
						}else { // 관리자일 때만 실행
							if(d.comYn == "N" && d.boardClass != "공지사항") {
								// 고객의견에 적힌 게시글이면서 관리자 체크가 안 되어있는 경우에만 관리자 체크 버튼을 생성
								$("#qa_updateCheck").show();
							}
						}
					} else { // 로그인된 유저가 없을 때 수정/삭제 버튼 숨김
						$("#qa_updatebutton").hide(); 
						$("#qa_deletebutton").hide();
					}
				});
				
				// 관리자의 글 확인 버튼 클릭시
				$("#qa_updateCheck").off().on("click",function(){ 
					var admincheck = confirm("게시글을 확인하셨나요?");
					if(admincheck == true) {
						$.ajax({
							type:"post",
							url:"/ljh/AdminCheck",
							data:{"boardNo" : bNo}
						}).done(function(data){
							var d = JSON.parse(data);
							if(d.status == 1) {
								alert("글 확인이 완료되었습니다.");
								location.href="main.html";
							}else {
								alert("제대로 확인되지 않았습니다.");
							}
						});
					}
				});
				
				// 업데이트 버튼 클릭시
				$("#qa_updatebutton").off().on("click",function(){ 
					$("#qa_checkdetails h3").hide();
					$("#qa_checkdetails h5").hide();
					$("#qa_checkdetails p").hide();
					$("#qa_updatebutton").hide();
					$(".qa_detailinput").show();
					$("#qa_rollback3").show();
					$("#qa_checkdetails input").eq(0).val(d.boardTitle);
			    	$("#qa_checkdetails input").eq(1).val(d.boardContents);
			    });
				
				// 수정하기 시도했을 때.
				$("#qa_checkdetails").submit(function(e){ 
			    	e.preventDefault();
			    	var uV1 = $("#qa_checkdetails input").eq(0).val();
			    	var uV2 = $("#qa_checkdetails input").eq(1).val();
			    	$.ajax({
						type:"post",
						url:"/ljh/boardUpdate",
						data:{"boardNo" : bNo, "boardTitle":uV1,"boardContents":uV2}
					}).done(function(data){
						var Ud = JSON.parse(data);
						if(Ud.status == 1) {
							alert("작성글 " + d.boardTitle + " 의 수정이 완료되었습니다.");
							location.href="main.html?boardNo=" + bNo;
						}else {
							alert("해당 글의 내용이 제대로 수정되지 않았습니다.");
						}
					});
				});
				
				// 삭제버튼 클릭시
				$("#qa_deletebutton").off().on("click", function(){ 
					var reallyDel = confirm("정말로 게시물을 삭제합니까?");
					if(reallyDel == true) {
						$.ajax({
							type:"post",
							url:"/ljh/boardDelete",
							data:{"boardNo" : bNo}
						}).done(function(data){
							var d = JSON.parse(data);
							if(d.status == 1) {
								alert("글 삭제가 완료되었습니다.");
								location.href="main.html";
							}else {
								alert("이런! 해당 글의 삭제를 실패했습니다.");
							}
						});
					}
				});
				
				// 수정 취소시
				$("#qa_rollback3").off().on("click",function(){
					var reallyNoUp = confirm("수정을 취소합니까?");
					if(reallyNoUp == true) {
						$("#qa_checkdetails h3").show();
						$("#qa_checkdetails h5").show();
						$("#qa_checkdetails p").show();
						$("#qa_updatebutton").show();
						$(".qa_detailinput").hide();
						$("#qa_rollback3").hide();
					}
				});
				
			} else { // 쿼리스트링 변경으로 못된 장난을 칠때
				alert("잘못된 접근입니다.");
				location.href="main.html";
			}

		});
	}
}

// 현재 접속자가 관리자인가를 체크
function admitcheck(c) {
	$.ajax({
		type: "post",
		url: "/ljh/userCheck"
	}).done(function(data){
		var d = JSON.parse(data);
		var list = d.list;
		if(list != null) {
			if(list.userName == "관리자"){
				if (c == "1"){
					$("#qa_write").show();
				}else if (c == "3") {
					$("#qa_write").hide();
				}
			}
		}
	});
}

// 매물예약 화면 스크립트
function reaservation() {
	// 첫화면 세팅
	newTable("Y", "#rsv_list_table1");

    var areavalue;
    // 지도
    $("#rsv_area ul li").off().on("click", function(){
    	areavalue = $(this).index();
	areasearch(areavalue);
    });
    
    // 검색 버튼 입력시
	$("#rsv_startbutton").off().on("click", function(){
		var tableselect = $("#rsv_menu1 input:checked").val();
		if (tableselect == "bag") {
			$("#rsv_list_table1").css("display", "table");
			$("#rsv_list_table2").css("display", "none");
			newTable("Y", "#rsv_list_table1");
		}else if (tableselect == "watch") {
			$("#rsv_list_table2").css("display", "table");
			$("#rsv_list_table1").css("display", "none");
			newTable("N", "#rsv_list_table2");
		}
		areavalue = $("#rsv_menu3 select").val();
		if(areavalue != -1){
			areasearch(areavalue);
		}
	});
	// 지도2
	function areasearch(av) {
		var i = av - 1;
		var mapurl = ["https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3313740.168915977!2d125.62462485849026!3d35.7981071861466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356455ebcb11ba9b%3A0x91249b00ba88db4b!2z64yA7ZWc66-86rWt!5e0!3m2!1sko!2skr!4v1527065548992", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d404811.2671992865!2d126.70936381706494!3d37.56476893071881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca28b61c565cd%3A0x858aedb4e4ea83eb!2z7ISc7Jq47Yq567OE7Iuc!5e0!3m2!1sko!2skr!4v1527137551193", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101338.83954294637!2d126.60431045585904!3d37.46452933176048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35796f2596138247%3A0x7d37fd902cb76142!2z7J247LKc6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137642134", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d809272.1685923658!2d126.53549619265904!3d37.59699492544846!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357c79e4e57eb68d%3A0x10c1f98d6f6b5c2!2z6rK96riw64-E!5e0!3m2!1sko!2skr!4v1527137671773", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d806346.3823678893!2d127.68734705807618!3d37.86519080782262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356237ec59968d89%3A0xe150c7d25a07a6e!2z6rCV7JuQ64-E!5e0!3m2!1sko!2skr!4v1527137698198", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102799.74712085196!2d127.3187604303316!3d36.37307955873017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356548d7ba4a6601%3A0xd196d69d988ad3b5!2z64yA7KCE6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137742293", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d103447.88670142986!2d128.4966604190018!3d35.87972967108084!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3565e3b8b2efadd5%3A0xba92e029a0382e30!2z64yA6rWs6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137800046", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52179.11813465025!2d126.80878064034218!3d35.176694960525616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3571892301f5a7af%3A0x5f4d2ed0125f548!2z6rSR7KO86rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137828854", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d104373.97914101335!2d129.0017604028086!3d35.16442984467441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3568eb6de823cd35%3A0x35d8cb74247108a7!2z67aA7IKw6rSR7Jet7Iuc!5e0!3m2!1sko!2skr!4v1527137856878", "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d425479.10172023147!2d126.29284951448652!3d33.57790868955271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x350ce3544cc84045%3A0x66bc36d2981ebf31!2z7KCc7KO87Yq567OE7J6Q7LmY64-E!5e0!3m2!1sko!2skr!4v1527137892293"];
		var HTML = '<iframe src=' + mapurl[i] + ' width="100%" height="100%" frameborder="0" style="border:0" allowfullscreen></iframe>';
		$("#rsv_map").empty();
		$("#rsv_map").html(HTML);
	}
}

// 테이블 생성 메소드 (물품종류, 테이블분류)
function newTable(goodsClass, tableid){
	$.ajax({
		type:"post",
		url:"/ljh/fileList",
		data:{"goodsClass" : goodsClass}
	}).done(function(data){
		var d = JSON.parse(data).list;
		$(tableid).empty();
		var html_f1 = "<tr><th>대여존</th><th>대여물품</th><th>대여요금</th><th></th></tr>";
		for(var f=0; f<d.length; f++) {
			var fList = d[f];
			var html_f = "<tr>";
			html_f += "<td class='rsv_list_zone'>" + fList.rentZone + "</td>";
			html_f += "<td><div style='background-image: url(" + fList.fileURL +")' class='rsv_list_img'></div><br>" + fList.goods + "</td>";
			html_f += "<td>" + fList.cost + "</td>";
			html_f += "<td><button type='button' value='" + fList.boardNo + "'>예약</button></td></tr>";
			$(tableid).prepend(html_f); 
		}
		$(tableid).prepend(html_f1);
		reservButtonClick();
	});
}

// 예약 버튼 클릭시
function reservButtonClick(){
	$("#rsv_list table button").off().on("click",function(){
		var boardNo = $(this).val();
		
		$.ajax({ // 세션 체크.
			type: "post",
			url: "/ljh/userCheck"
		}).done(function(data){
			var uc = JSON.parse(data);
			var list = uc.list;
			if(list != null) {
				if(list.userName != "관리자") { // 일반 유저일 때
					$.ajax({
						type:"post",
						url:"/ljh/fileReserv",
						data:{"boardNo":boardNo, "userName":list.userName}
					}).done(function(data){
						var d = JSON.parse(data);
						if(d.userCheck == "0") { // 매물 등록자와 로그인된 유저가 같을 때.
							alert("자신이 올린 품목은 예약할 수 없습니다!");
						}else {
							if(d.status == "1") { // 성공시
								alert("예약이 완료되었습니다.");
								location.href="main.html";
							}else { // 실패시
								alert("예약이 되지 않았습니다.");
							}
						}
					});
				
				}else { // 관리자일 때는 매물 예약 불가능.
					alert("관리자는 매물을 예약할 수 없습니다.");
				}
			} else { // 로그인된 유저가 없을 때에는 로그인 화면으로.
				alert("우선 로그인 해주십시오.");
    			localStorage.setItem("url", "login.html");
    			location.href="main.html";
			}
		});
		
	});
}
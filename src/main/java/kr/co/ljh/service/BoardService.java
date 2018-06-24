package kr.co.ljh.service;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.ljh.dao.DaoInterFace;
import kr.co.ljh.util.HttpUtil;

@Service
public class BoardService implements BoardServiceInterFace {
	private static final Logger logger = LoggerFactory.getLogger(BoardService.class);
	
	@Autowired
	DaoInterFace dif;
	
	@Override
	public HashMap<String, Object> QnAList(HttpServletRequest req) {
		HashMap<String, Object> map = HttpUtil.getParamMap(req);
		logger.info("가져온 데이터의 내용 : " + map);
		List Map2;
		map.put("sqlType", "board.board_Count");
		map.put("sql", "selectOne");
		int PageNumber = Integer.parseInt(map.get("PageNumber").toString());
		// 페이지 번호
		int AllCount = (int) dif.call(map);
		// 게시글의 총 갯수
		int CountMinus = 10;
		// 가져올 데이터 개수
		int limitNo = (AllCount - (CountMinus * PageNumber));
		// 최신 게시글 10개를 위한 리미트 걸기
		if (limitNo < 0) {
			CountMinus = CountMinus + limitNo;
			limitNo = 0;
			if(CountMinus < 1) {
				CountMinus = 0;
			}
		}
		
		logger.info("현재 게시판 페이지 번호 : " + PageNumber + 
						   "/ 고객의견 게시물의 총 개수 : " + AllCount +
						   "/ 가져올 데이터의 개수 : " + CountMinus +
						   "/ 리미트 걸기 : " + limitNo);
		map.put("limitNo", limitNo);
		map.put("limitNo2", CountMinus);
		map.put("sqlType", "board.board_CommentList");
		map.put("sql", "selectList");
		logger.info("게시판 list SQL문용 데이터 : " + map);
		
		Map2 = (List) dif.call(map);
		Map2.add(0, AllCount);
		logger.info("출력된 데이터 내용(길다) : " + Map2);
		
		map = new HashMap<String, Object>();
		map.put("list", Map2);
		return map;
	}
	

	@Override
	public HashMap<String, Object> QnAinsert(HttpServletRequest req, HttpSession session) {
		HashMap<String, Object> map = HttpUtil.getParamMap(req);
		HashMap<String, Object> list = (HashMap<String, Object>) session.getAttribute("user");
		if(list != null) {
			map.put("logincheck", "OK");
			String UN = list.get("userNo").toString();
			logger.info("현재 글작성자 Number : " + UN);
			
			map.put("userNo", UN);
			map.put("boardClass", "고객의견");
			map.put("sql", "insert");
			map.put("sqlType", "board.boardInsert");
			logger.info("boardinsert용 데이터 : " + map);
			
			int status = (int) dif.call(map);
			map.put("status", status);
		} else {
			map.put("logincheck", "NO");
		}
		
		return map;
	}


	@Override
	public HashMap<String, Object> QnAdetail(HttpServletRequest req, HttpSession session) {
		HashMap<String, Object> map = HttpUtil.getParamMap(req);
		logger.info("클릭한 글의 번호 : " + map);
		
		map.put("sql", "selectOne");
		map.put("sqlType", "board.boardDetail");
		HashMap<String, Object> resultMap = (HashMap<String, Object>) dif.call(map);
		logger.info("클릭한 글의 정보 내용 : " + resultMap);
		
		return resultMap;
	}


	@Override
	public HashMap<String, Object> boardUpdate(HttpServletRequest req, String sqltype) {
		HashMap<String, Object> map = HttpUtil.getParamMap(req);
		map.put("sql", "update");
		map.put("sqlType", sqltype);
		logger.info("담긴 데이터와 sql문 확인. : " + map);
		
		int status = (int) dif.call(map);
		map.put("status", status);
		logger.info("삭제 성공 여부 확인 (1이 성공) : " + status); 
		
		return map;
	}
	
}

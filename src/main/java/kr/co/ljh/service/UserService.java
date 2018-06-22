package kr.co.ljh.service;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.ljh.dao.DaoInterFace;
import kr.co.ljh.util.HttpUtil;

@Service
public class UserService implements UserServiceInterFace {
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);
	
	@Autowired
	DaoInterFace dif;

	@Override
	public HashMap<String, Object> emailCheck(HttpServletRequest req) {
		logger.info("이메일 중복 체크.");
		HashMap<String, Object> param = HttpUtil.getParamMap(req);
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		param.put("sqlType", "user.emailCheck");
		param.put("sql", "selectOne");
		logger.info("이메일 중복 체크용 데이터 : " + param);
		HashMap<String, Object> emailCheck = (HashMap<String, Object>) dif.call(param);
		logger.info("이메일 중복 체크 sql문 null유무 확인 : " + emailCheck);
		if(emailCheck == null) {
			resultMap.put("emailCheck", "OK");
		}else {
			resultMap.put("emailCheck", "NO");
		}
		return resultMap;
	}

	@Override
	public HashMap<String, Object> newUser(HttpServletRequest req) {
		logger.info("회원가입 정보가 넘어옵니다.");
		HashMap<String, Object> param = HttpUtil.getParamMap(req);
		HashMap<String, Object> resultMap = new HashMap<String, Object>();

		logger.info("담긴 정보 내용 : " + param);
		param.put("sqlType", "user.userInsert");
		param.put("sql","insert");
		
		int status = (int) dif.call(param);		
		if(status > 0) {
			logger.info("회원가입 성공적으로 완료됨.");
			resultMap.put("newUser", "OK");
		}else {
			logger.info("회원가입 대실패");
			resultMap.put("newUser", "NO");
		}
		return resultMap;
	}

	@Override
	public HashMap<String, Object> login(HttpServletRequest req, HttpSession session) {
		logger.info("로그인을 시도합니다.");
		HashMap<String, Object> param = HttpUtil.getParamMap(req);
		
		logger.info("담긴 정보 내용 : " + param);
		param.put("sqlType", "user.userSelect");
		param.put("sql","selectOne");
		
		HashMap<String, Object> resultMap = (HashMap<String, Object>) dif.call(param);
		logger.info("로그인 결과 데이터 내용 : " + resultMap);
		if (resultMap == null) {
			logger.info("로그인 실패");
			resultMap = new HashMap<String, Object>();
			resultMap.put("tryLogin", "NO");
		} else {
			logger.info("로그인 성공");
			session.setAttribute("user", resultMap);
			resultMap.put("tryLogin", "OK");
		}
		return resultMap;
	}

	@Override
	public HashMap<String, Object> userCheck(HttpSession session) {
		HashMap<String, Object> map = new HashMap<String, Object>();
		Object list = session.getAttribute("user");
		map.put("list", list);
		return map;
	}

}

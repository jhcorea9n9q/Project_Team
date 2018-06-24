package kr.co.ljh.service;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public interface UserServiceInterFace {
	
	public HashMap<String, Object> emailCheck(HttpServletRequest req);
	
	public HashMap<String, Object> newUser(HttpServletRequest req);
	
	public HashMap<String, Object> login(HttpServletRequest req, HttpSession session);
	
	public HashMap<String, Object> userCheck(HttpSession session);
	
	public HashMap<String, Object> userOut(HttpSession session);
	
}

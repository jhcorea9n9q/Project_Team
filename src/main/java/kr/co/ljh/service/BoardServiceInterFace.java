package kr.co.ljh.service;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public interface BoardServiceInterFace {

	public HashMap<String, Object> QnAList(HttpServletRequest req);
	
	public HashMap<String, Object> QnAinsert(HttpServletRequest req, HttpSession session);
	
	public HashMap<String, Object> QnAdetail(HttpServletRequest req, HttpSession session);
}

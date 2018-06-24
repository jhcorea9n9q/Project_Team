package kr.co.ljh.service;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;

public interface FileServiceInterFace {
	HashMap<String, Object> fileupload(HttpServletRequest req);
	
	HashMap<String, Object> fileList(HttpServletRequest req);
}

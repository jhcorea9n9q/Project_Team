package kr.co.ljh.service;

import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.web.multipart.MultipartFile;

public interface FileServiceInterFace {
	
	HashMap<String, Object> fileList(HttpServletRequest req);
	
	HashMap<String, Object> fileReserv(HttpServletRequest req);
	
	public HashMap<String, Object> fileUpload(MultipartFile[] files, HttpServletRequest req, HttpSession ses);
}

package kr.co.ljh.controller;

import java.util.HashMap;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.ibatis.session.SqlSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.co.ljh.dao.DaoInterFace;

@Controller
public class FileController {
	private static final Logger logger = LoggerFactory.getLogger(FileController.class);
	
	@Resource(name="sqlSession")
	SqlSession sess;
	
	@Autowired
	DaoInterFace dif;
	
	@RequestMapping("/fileUpload")
	public String file(HttpServletRequest req) {
		
		
		
		return null;
	}
	
}

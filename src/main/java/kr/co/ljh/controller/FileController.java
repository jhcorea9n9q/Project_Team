package kr.co.ljh.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import kr.co.ljh.service.FileServiceInterFace;
import kr.co.ljh.util.HttpUtil;

@Controller
public class FileController {
	
	@Autowired
	FileServiceInterFace fsif;
	
	@RequestMapping("/fileUpload")
	public ModelAndView fileUp(HttpServletRequest req) {
		return HttpUtil.makeJsonView(fsif.fileupload(req));
	}
	
	@RequestMapping("/fileList")
	public ModelAndView fileList(HttpServletRequest req) {
		return HttpUtil.makeJsonView(fsif.fileList(req));
	}
	
	@RequestMapping("/fileReserv")
	public ModelAndView fileReserv(HttpServletRequest req) {
		return HttpUtil.makeJsonView(fsif.fileReserv(req));
	}
	
}

package kr.co.ljh.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import kr.co.ljh.service.FileServiceInterFace;
import kr.co.ljh.util.HttpUtil;

@Controller
public class FileController {
	
	@Autowired
	FileServiceInterFace fsif;
	
	@RequestMapping("/fileList")
	public ModelAndView fileList(HttpServletRequest req) {
		return HttpUtil.makeJsonView(fsif.fileList(req));
	}
	
	@RequestMapping("/fileReserv")
	public ModelAndView fileReserv(HttpServletRequest req) {
		return HttpUtil.makeJsonView(fsif.fileReserv(req));
	}
	
	@RequestMapping("/fileUpload")
	public void fileUpload(@RequestParam("file") MultipartFile[] files, HttpServletRequest req, HttpSession ses, HttpServletResponse res) {
		HttpUtil.makeJsonWriter(res, fsif.fileUpload(files, req, ses));
	}
	
}

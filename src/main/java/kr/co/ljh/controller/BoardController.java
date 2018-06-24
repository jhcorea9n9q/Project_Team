package kr.co.ljh.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import kr.co.ljh.service.BoardServiceInterFace;
import kr.co.ljh.util.HttpUtil;

@Controller
public class BoardController {
	
	@Autowired
	BoardServiceInterFace bsif;
	
	@RequestMapping("/QnAboardList")
	public ModelAndView QnAList(HttpServletRequest req) {
		return HttpUtil.makeJsonView(bsif.QnAList(req));
	}
	
	@RequestMapping("/QnAinsert")
	public ModelAndView QnAinsert(HttpServletRequest req, HttpSession ses) {
		return HttpUtil.makeJsonView(bsif.QnAinsert(req, ses));
	}
	
	@RequestMapping("/QnAdetail")
	public ModelAndView QnAdetail(HttpServletRequest req, HttpSession ses) {
		return HttpUtil.makeJsonView(bsif.QnAdetail(req, ses));
	}
	
	@RequestMapping("/boardUpdate")
	public ModelAndView boardUpdate(HttpServletRequest req) {
		return HttpUtil.makeJsonView(bsif.boardUpdate(req, "board.boardUp"));
	}
	
	@RequestMapping("/AdminCheck")
	public ModelAndView AdminCheck(HttpServletRequest req) {
		return HttpUtil.makeJsonView(bsif.boardUpdate(req, "board.boardAdminCheck"));
	}
	
	@RequestMapping("/boardDelete")
	public ModelAndView boardDelete(HttpServletRequest req) {
		return HttpUtil.makeJsonView(bsif.boardUpdate(req, "board.boardDelete"));
	}
}

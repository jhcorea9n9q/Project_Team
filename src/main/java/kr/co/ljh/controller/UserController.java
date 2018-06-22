package kr.co.ljh.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import kr.co.ljh.service.UserServiceInterFace;
import kr.co.ljh.util.HttpUtil;

@Controller
public class UserController {
	
	@Autowired
	UserServiceInterFace usif;
	
	@RequestMapping("/emailCheck")
	public ModelAndView emailCheck(HttpServletRequest req) {
		return HttpUtil.makeJsonView(usif.emailCheck(req));
	}
	
	@RequestMapping("/newUser")
	public ModelAndView newUser(HttpServletRequest req) {
		return HttpUtil.makeJsonView(usif.newUser(req));
	}
	
	
	@RequestMapping("/login")
	public ModelAndView login(HttpServletRequest req, HttpSession session) {
		return HttpUtil.makeJsonView(usif.login(req, session));
	}
	
	@RequestMapping("/userCheck")
	public ModelAndView userCheck(HttpSession session) {
		return HttpUtil.makeJsonView(usif.userCheck(session));
	}
	
	@RequestMapping("/logout")
	public String logout(HttpSession session) {
		session.invalidate();
		return "redirect:/page/main.html";
	}
	
}

package kr.co.ljh.service;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.ljh.dao.DaoInterFace;
import kr.co.ljh.util.HttpUtil;

@Service
public class FileService implements FileServiceInterFace {
	
	private static final Logger logger = LoggerFactory.getLogger(FileService.class);
	
	@Autowired
	DaoInterFace dif;

	@Override
	public HashMap<String, Object> fileupload(HttpServletRequest req) {
		logger.info("매물 등록 시작.");
		HashMap<String, Object> param = HttpUtil.getParamMap(req);
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		
		param.put("sqlType", "files.fileboardInsert");
		param.put("sql","insert");
		logger.info("param에 담긴 내용 확인. : " + param);
		
		int status = (int) dif.call(param);		
		if(status > 0) {
			logger.info("board에 입력 성공. boardNo 뽑아오기 실행");
			param.put("sqlType", "files.fileboardCheck");
			param.put("sql", "selectOne");
			resultMap = (HashMap<String, Object>) dif.call(param);
			Object boardNo = resultMap.get("boardNo");
			logger.info("boardNo 체크. : " + boardNo);
			
			if (boardNo != null) {
				param.put("boardNo", boardNo);
				param.put("sqlType", "files.filesInsert");
				param.put("sql", "insert");
				int status2 = (int) dif.call(param);
				logger.info("최종 성공유무 체크. : " + status2);
				
				if(status2 > 0) {
					logger.info("모든 과정 성공.");
					resultMap.put("upload", "OK");
					
				}else {
					logger.info("file 입력 실패.");
					resultMap.put("upload", "NO");
				}
				
			}else {
				logger.info("board_SelectOne 실패.");
				resultMap.put("upload", "NO");
			}
			
		}else {
			logger.info("board 입력 실패.");
			resultMap.put("upload", "NO");
		}
		return resultMap;
	}

	@Override
	public HashMap<String, Object> fileList(HttpServletRequest req) {
		HashMap<String, Object> param = HttpUtil.getParamMap(req);
		HashMap<String, Object> resultMap = new HashMap<String, Object>();
		List resultList;
		
		param.put("sqlType", "files.filelist");
		param.put("sql", "selectList");
		logger.info("param에 담긴 내용 확인. : " + param);
		
		resultList = (List) dif.call(param);
		logger.info("select문 내용 : " + resultList);
		resultMap.put("list", resultList);
		
		return resultMap;
	}

	@Override
	public HashMap<String, Object> fileReserv(HttpServletRequest req) {
		HashMap<String, Object> param = HttpUtil.getParamMap(req);
		HashMap<String, Object> userCheck = new HashMap<String, Object>();
		param.put("sqlType", "res_userCheck");
		param.put("sql", "selectOne");
		logger.info("param에 담긴 내용 확인. : " + param);
		
		userCheck = (HashMap<String, Object>) dif.call(param);
		logger.info("유저체크 : " + userCheck);
		String userNo1 = userCheck.get("userNo1").toString();
		String userNo2 = userCheck.get("userNo2").toString();
		if(userNo1.equals(userNo2)) {
			userCheck.put("userCheck", "0");
		}else {
			userCheck.put("userCheck", "1");
			param.put("sqlType", "files.reserved");
			param.put("sql", "update");
			
			int status = (int) dif.call(param);
			userCheck.put("status", status);
			logger.info("status 확인 : " + status);
		}
		
		return userCheck;
	}
	


}

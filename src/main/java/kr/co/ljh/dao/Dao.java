package kr.co.ljh.dao;

import java.util.HashMap;

import javax.annotation.Resource;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository
public class Dao implements DaoInterFace {
	
	@Resource(name="sqlSession")
	SqlSession sess;

	@Override
	public Object call(HashMap<String, Object> param) {
		String sql = param.get("sql").toString();
		String sqlType = param.get("sqlType").toString();
		
		if ("selectOne".equals(sql)) {
			return sess.selectOne(sqlType, param);
		} else if ("insert".equals(sql)) {
			return sess.insert(sqlType, param);
		} else if ("update".equals(sql)) {
			return sess.update(sqlType, param);
		} else if ("selectList".equals(sql)) {
			return sess.selectList(sqlType, param);
		}
		
		return null;
	}

}

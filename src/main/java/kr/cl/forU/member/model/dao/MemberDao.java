package kr.cl.forU.member.model.dao;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.cl.forU.member.model.vo.Member;

@Repository
public class MemberDao {

	@Autowired
	private SqlSession session;
	private String map = "memberMapper.";
	
	
	public Member selectMemberSoft(Member m) {
		return session.selectOne(map + "selectMemberSoft", m);
		
	}


	public int insertMember(Member m) {
		return session.insert(map + "insertMember", m);
	}
	
	public int updateMember(Member m) {
	 
		return session.update(map + "updateMember", m);
	}
	
	public Member MemberIdMatch(String memberId) {
		return session.selectOne(map + "MemberIdMatch" , memberId);
	}


	public Member selectMemberInfo(int memberNo) {
		return session.selectOne(map + "selectMemberInfo", memberNo);
	}

	public int updateMemberPoint(Member m) {
		return session.update(map + "updateMemberPoint", m);
	}

	public int updateMemberGrade(Member m) {
		// TODO Auto-generated method stub
		return session.update(map + "updateMemberGrade", m);
	}


	public int selectPointRate(int memberNo) {
		return session.selectOne(map + "selectPointRate", memberNo);
	}






}

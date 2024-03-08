package kr.cl.forU.member.model.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import kr.cl.forU.member.model.vo.Grade;
import kr.cl.forU.member.model.vo.Member;
import kr.cl.forU.member.model.vo.Notice;

@Repository
public class MemberDao {

	@Autowired
	private SqlSession session;
	private String map = "memberMapper.";


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

	/**
	 * 회원등급 목록 조회
	 * @return 회원 목록
	 */
	public List<Grade> selectGradeList() {
		return session.selectList(map + "selectGradeList");
	}

	public List<Notice> selectNotice(int memberNo) {
		return session.selectList(map + "selectNotice" , memberNo);
	}

	public int noticeDelete(int noticeNo) {
		return session.delete(map + "noticeDelete" , noticeNo);
	}

	public List<Member> selectAllMember() {
		return session.selectList(map + "selectAllMember");
	}

	public int deleteMember(int memberNo) {
		return session.update(map + "deleteMember" , memberNo);
	}

	public int sellerUpdateMem(Member member) {
		return session.update(map + "sellerUpdateMem" , member);
	}






}

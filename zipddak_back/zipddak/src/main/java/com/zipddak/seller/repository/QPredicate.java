package com.zipddak.seller.repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.BooleanPath;
import com.querydsl.core.types.dsl.DatePath;
import com.querydsl.core.types.dsl.EnumPath;
import com.querydsl.core.types.dsl.NumberPath;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.core.types.dsl.StringPath;

public class QPredicate {

	// ============ 기본 문자열 관련 ============
	public static BooleanExpression eq(StringExpression path, String value) {
	    if (value == null || value.isBlank())
	        return null;
	    return path.eq(value);
	}

	public static BooleanExpression contains(StringPath path, String keyword) {
		if (keyword == null || keyword.isBlank())
			return null;
		return path.containsIgnoreCase(keyword);
	}

	public static BooleanExpression anyContains(String keyword, StringPath... paths) {
		if (keyword == null || keyword.isBlank())
			return null;
		BooleanExpression exp = null;
		for (StringPath p : paths) {
			BooleanExpression e = p.containsIgnoreCase(keyword);
			exp = (exp == null) ? e : exp.or(e);
		}
		return exp;
	}

	// ============ Enum IN ============
	public static <E extends Enum<E>> BooleanExpression inEnum(EnumPath<E> path, List<E> enums) {
		if (enums == null || enums.isEmpty())
			return null;
		return path.in(enums);
	}

	// 날짜 검색용  ============ LocalDate == java.sql.Date ============
	public static BooleanExpression dateEq(DatePath<Date> path, LocalDate date) {
		if (path == null || date == null)
			return null;
		return path.eq(Date.valueOf(date));
	}

	// 숫자
	public static BooleanExpression inInt(NumberPath<Integer> path, List<Integer> values) {
		return (values == null || values.isEmpty()) ? null : path.in(values);
	}
	
	// Boolean 리스트 비교
	public static BooleanExpression inBoolean(BooleanPath path, List<Boolean> values) {
	    return (values == null || values.isEmpty()) ? null : path.in(values);
	}
}

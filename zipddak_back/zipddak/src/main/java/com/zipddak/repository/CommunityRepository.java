package com.zipddak.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zipddak.entity.Community;
import com.zipddak.entity.FavoritesCommunity;

public interface CommunityRepository extends JpaRepository<Community, Integer>{

	Optional<Community> findByCommunityIdx(int communityId);

}

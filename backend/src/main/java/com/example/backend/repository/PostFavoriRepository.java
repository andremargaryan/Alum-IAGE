package com.example.backend.repository;

import com.example.backend.entity.PostFavori;
import com.example.backend.entity.PostFavoriId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostFavoriRepository extends JpaRepository<PostFavori, PostFavoriId> {

    List<PostFavori> findByUserId(Integer userId);

    @Query("SELECT pf FROM PostFavori pf JOIN FETCH pf.user WHERE pf.post.id = :postId")
    List<PostFavori> findByPostIdWithUser(@Param("postId") Integer postId);
}

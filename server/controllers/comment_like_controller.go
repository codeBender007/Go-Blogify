package controllers

import (
	"net/http"
	"strconv"

	"blogapp/config"
	"blogapp/models"

	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type CommentDTO struct {
	Content string `json:"content" binding:"required"`
}

func AddComment(c *gin.Context) {
	var body CommentDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid := c.MustGet("userID").(uint)
	var blog models.Blog
	if err := config.DB.First(&blog, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error":"blog not found"}); return
	}
	comment := models.Comment{Content: body.Content, UserID: uid, BlogID: blog.ID}
	if err := config.DB.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error":"failed"}); return
	}
	config.DB.Preload("User").First(&comment, comment.ID)
	c.JSON(http.StatusCreated, gin.H{"comment": comment})
}

func GetComments(c *gin.Context) {
	var comments []models.Comment
	config.DB.Preload("User").Where("blog_id = ?", c.Param("id")).Order("created_at asc").Find(&comments)
	c.JSON(http.StatusOK, gin.H{"data": comments})
}

// ToggleLike handles like/unlike functionality + updates liked_by array
func ToggleLike(c *gin.Context) {
	uid := c.MustGet("userID").(uint)
	blogID, _ := strconv.Atoi(c.Param("id"))

	var blog models.Blog

	// ✅ Blog fetch karo
	if err := config.DB.First(&blog, blogID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Blog not found"})
		return
	}

	var existing models.Like
	err := config.DB.Where("user_id = ? AND blog_id = ?", uid, blog.ID).First(&existing).Error

	if err == nil {
		// ✅ If like exists → UNLIKE
		if err := config.DB.Delete(&existing).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unlike"})
			return
		}

		// ✅ Remove user ID from liked_by array
		newLikedBy := make(pq.Int64Array, 0)
		for _, id := range blog.LikedBy {
			if uint(id) != uid {
				newLikedBy = append(newLikedBy, id)
			}
		}
		blog.LikedBy = newLikedBy

		// ✅ Save updated blog
		if err := config.DB.Model(&blog).Updates(map[string]interface{}{
			"liked_by": blog.LikedBy,
		}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update liked_by"})
			return
		}

		var count int64
		config.DB.Model(&models.Like{}).Where("blog_id = ?", blog.ID).Count(&count)

		c.JSON(http.StatusOK, gin.H{
			"blog_id":  blog.ID,
			"liked":    false,
			"likes":    count,
			"liked_by": blog.LikedBy,
		})
		return
	}

	// ✅ If like doesn't exist → LIKE
	like := models.Like{
		UserID: uid,
		BlogID: blog.ID,
	}

	if err := config.DB.Create(&like).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to like"})
		return
	}

	// ✅ Add user ID to liked_by array
	blog.LikedBy = append(blog.LikedBy, int64(uid))
	if err := config.DB.Model(&blog).Updates(map[string]interface{}{
		"liked_by": blog.LikedBy,
	}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update liked_by"})
		return
	}

	var count int64
	config.DB.Model(&models.Like{}).Where("blog_id = ?", blog.ID).Count(&count)

	c.JSON(http.StatusOK, gin.H{
		"blog_id":  blog.ID,
		"liked":    true,
		"likes":    count,
		"liked_by": blog.LikedBy,
	})
}



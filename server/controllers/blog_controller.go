package controllers

import (
	"net/http"
	"strconv"

	"blogapp/config"
	"blogapp/models"
	"blogapp/utils"

	"github.com/gin-gonic/gin"
)

type BlogDTO struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

func CreateBlog(c *gin.Context) {
	uid := c.MustGet("userID").(uint)

	// ✅ Parse form data
	title := c.PostForm("title")
	content := c.PostForm("content")

	if title == "" || content == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Title and content are required"})
		return
	}

	var imageURL string
	file, fileHeader, err := c.Request.FormFile("image")
	if err == nil { // ✅ If image uploaded, send to Cloudinary
		defer file.Close()
		uploadedURL, uploadErr := utils.UploadImage(file, fileHeader)
		if uploadErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": uploadErr.Error()})
			return
		}
		imageURL = uploadedURL
	}

	// ✅ Save blog
	blog := models.Blog{
		Title:    title,
		Content:  content,
		ImageURL: imageURL,
		AuthorID: uid,
	}

	if err := config.DB.Create(&blog).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create blog"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"blog": blog})
}


func GetBlogs(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	if page < 1 {
		page = 1
	}
	if limit < 1 || limit > 50 {
		limit = 10
	}
	offset := (page - 1) * limit

	var blogs []models.Blog
	var total int64

	config.DB.Model(&models.Blog{}).Count(&total)
	config.DB.Preload("Author").Order("created_at desc").Limit(limit).Offset(offset).Find(&blogs)

	type likeCount struct {
		BlogID uint
		Count  int64
	}
	var rows []likeCount
	config.DB.Model(&models.Like{}).Select("blog_id, count(*) as count").Group("blog_id").Scan(&rows)
	counts := map[uint]int64{}
	for _, r := range rows {
		counts[r.BlogID] = r.Count
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  blogs,
		"page":  page,
		"limit": limit,
		"total": total,
		"likes": counts,
	})
}


func GetBlog(c *gin.Context) {
	id := c.Param("id")
	var blog models.Blog
	if err := config.DB.Preload("Author").First(&blog, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error":"not found"})
		return
	}
	var likeCount int64
	config.DB.Model(&models.Like{}).Where("blog_id = ?", blog.ID).Count(&likeCount)
	c.JSON(http.StatusOK, gin.H{"blog": blog, "likes": likeCount})
}

func UpdateBlog(c *gin.Context) {
	id := c.Param("id")
	uid := c.MustGet("userID").(uint)
	var blog models.Blog
	if err := config.DB.First(&blog, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error":"not found"})
		return
	}
	if blog.AuthorID != uid {
		c.JSON(http.StatusForbidden, gin.H{"error":"not owner"})
		return
	}
	var body BlogDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	blog.Title = body.Title
	blog.Content = body.Content
	config.DB.Save(&blog)
	c.JSON(http.StatusOK, gin.H{"blog": blog})
}

func DeleteBlog(c *gin.Context) {
	id := c.Param("id")
	uid := c.MustGet("userID").(uint)
	var blog models.Blog
	if err := config.DB.First(&blog, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error":"not found"})
		return
	}
	if blog.AuthorID != uid {
		c.JSON(http.StatusForbidden, gin.H{"error":"not owner"})
		return
	}
	config.DB.Delete(&blog)
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

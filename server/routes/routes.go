package routes

import (
	"blogapp/controllers"
	"blogapp/middleware"

	"github.com/gin-gonic/gin"
)

func Register(r *gin.Engine) {
	auth := r.Group("/auth")
	{
		auth.POST("/register", controllers.Register)
		auth.POST("/login", controllers.Login)
		auth.POST("/verify-otp", controllers.VerifyOTP)
		auth.POST("/forgot-password", controllers.ForgotPassword)
		auth.POST("/reset-password", controllers.ResetPassword)
		auth.GET("/me", middleware.AuthRequired(), controllers.Me)
		auth.GET("/user/:id", controllers.GetUserByID)
	}

	blogs := r.Group("/blogs")
	{
		blogs.GET("", controllers.GetBlogs)
		blogs.GET("/:id", controllers.GetBlog)
		blogs.POST("", middleware.AuthRequired(), controllers.CreateBlog)
		blogs.PUT("/:id", middleware.AuthRequired(), controllers.UpdateBlog)
		blogs.DELETE("/:id", middleware.AuthRequired(), controllers.DeleteBlog)
	
		blogs.GET("/:id/comments", controllers.GetComments)
		blogs.POST("/:id/comments", middleware.AuthRequired(), controllers.AddComment)

		blogs.POST("/:id/like", middleware.AuthRequired(), controllers.ToggleLike)
	}
}

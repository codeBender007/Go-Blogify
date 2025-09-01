package middleware

import (
	"net/http"
	"strings"

	"blogapp/config"
	"blogapp/utils"

	"github.com/gin-gonic/gin"
)

func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		h := c.GetHeader("Authorization")
		if h == "" || !strings.HasPrefix(h, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"missing token"})
			return
		}
		tok := strings.TrimPrefix(h, "Bearer ")
		uid, err := utils.ParseJWT(config.C.JWTSecret, tok)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error":"invalid token"})
			return
		}
		c.Set("userID", uid)
		c.Next()
	}
}

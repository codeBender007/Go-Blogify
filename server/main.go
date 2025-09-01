package main

import (
	"log"
	"net/http"

	"blogapp/config"
	"blogapp/models"
	"blogapp/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()
	config.ConnectDB()

	// Migrations
	if err := config.DB.AutoMigrate(&models.User{}, &models.Blog{}, &models.Comment{}, &models.Like{}); err != nil {
		log.Fatal("migration error:", err)
	}


	if err := config.DB.AutoMigrate(
		&models.User{},
		&models.Blog{},
		&models.Comment{},
		&models.Like{},
	); err != nil {
		log.Fatal("migration error:", err)
	}
	

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowHeaders: []string{"Origin", "Content-Type", "Authorization"},
		AllowMethods: []string{"GET","POST","PUT","DELETE","OPTIONS"},
		AllowCredentials: true,
	}))

	r.GET("/", func(c *gin.Context){ c.JSON(http.StatusOK, gin.H{"ok": true}) })

	routes.Register(r)

	log.Println("server on :" + config.C.Port)
	if err := r.Run(":" + config.C.Port); err != nil {
		log.Fatal(err)
	}
}

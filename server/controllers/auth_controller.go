package controllers

import (
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"blogapp/config"
	"blogapp/models"
	"blogapp/utils"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// ===============================
// Register Controller
// ===============================
type RegisterDTO struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
	Phone     string `json:"phone" binding:"required"`
}

func Register(c *gin.Context) {
	var body RegisterDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var existingUser models.User
	if err := config.DB.Where("email = ? OR phone = ?", body.Email, body.Phone).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email or phone already in use"})
		return
	}

	// Hash password
	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 12)

	// Generate OTP
	otp := fmt.Sprintf("%06d", rand.Intn(1000000))
	expires := time.Now().Add(5 * time.Minute)

	// Create new user
	user := models.User{
		FirstName:     body.FirstName,
		LastName:      body.LastName,
		Email:         body.Email,
		Phone:         body.Phone,
		Password:      string(hash),
		OTPCode:       otp,
		OTPExpires:    expires,
		IsOTPVerified: false,
	}

	if err := config.DB.Create(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to create user"})
		return
	}

	fmt.Println("Registration OTP:", otp) // For testing

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully. Please verify OTP.",
	})
}

// ===============================
// Verify OTP Controller
// ===============================
func VerifyOTP(c *gin.Context) {
	type VerifyDTO struct {
		EmailOrPhone string `json:"email_or_phone" binding:"required"`
		OTP          string `json:"otp" binding:"required"`
	}

	var body VerifyDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find user
	var user models.User
	if err := config.DB.Where("email = ? OR phone = ?", body.EmailOrPhone, body.EmailOrPhone).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if user.IsOTPVerified {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already verified"})
		return
	}

	if time.Now().After(user.OTPExpires) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP expired"})
		return
	}

	if user.OTPCode != body.OTP {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
		return
	}

	config.DB.Model(&user).Updates(map[string]interface{}{
		"is_otp_verified": true,
		"otp_code":        "",
		"otp_expires":     time.Time{},
	})

	c.JSON(http.StatusOK, gin.H{"message": "OTP verified successfully"})
}

// ===============================
// Login Controller
// ===============================
type LoginDTO struct {
	EmailOrPhone string `json:"email_or_phone" binding:"required"`
	Password     string `json:"password" binding:"required"`
}

func Login(c *gin.Context) {
	var body LoginDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ? OR phone = ?", body.EmailOrPhone, body.EmailOrPhone).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email/phone or password"})
		return
	}

	if bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password)) != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email/phone or password"})
		return
	}

	if !user.IsOTPVerified {
		c.JSON(http.StatusForbidden, gin.H{"error": "OTP verification required"})
		return
	}

	token, _ := utils.GenerateJWT(config.C.JWTSecret, user.ID)

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
	})
}

// ===============================
// Forgot Password Controller
// ===============================
func ForgotPassword(c *gin.Context) {
	type ForgotDTO struct {
		EmailOrPhone string `json:"email_or_phone" binding:"required"`
	}

	var body ForgotDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ? OR phone = ?", body.EmailOrPhone, body.EmailOrPhone).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Generate new OTP
	otp := fmt.Sprintf("%06d", rand.Intn(1000000))
	expires := time.Now().Add(5 * time.Minute)

	config.DB.Model(&user).Updates(map[string]interface{}{
		"otp_code":    otp,
		"otp_expires": expires,
	})

	fmt.Println("Password Reset OTP:", otp) // For testing

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

// ===============================
// Reset Password Controller
// ===============================
func ResetPassword(c *gin.Context) {
	type ResetDTO struct {
		EmailOrPhone string `json:"email_or_phone" binding:"required"`
		OTP          string `json:"otp" binding:"required"`
		Password     string `json:"password" binding:"required,min=6"`
	}

	var body ResetDTO
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := config.DB.Where("email = ? OR phone = ?", body.EmailOrPhone, body.EmailOrPhone).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	if time.Now().After(user.OTPExpires) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "OTP expired"})
		return
	}

	if user.OTPCode != body.OTP {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid OTP"})
		return
	}

	// Encrypt and update new password
	hash, _ := bcrypt.GenerateFromPassword([]byte(body.Password), 12)
	config.DB.Model(&user).Updates(map[string]interface{}{
		"password":     string(hash),
		"otp_code":     "",
		"otp_expires":  time.Time{},
		"is_otp_verified": true, // optional: mark verified after password reset
	})

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}

// ===============================
// Get Current User (Me)
// ===============================
func Me(c *gin.Context) {
	uid := c.MustGet("userID").(uint)
	var user models.User
	if err := config.DB.First(&user, uid).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"user": user})
}


// ===============================
// Get User By ID Controller
// ===============================
func GetUserByID(c *gin.Context) {
	// ID को URL params से लेना
	id := c.Param("id")

	var user models.User
	if err := config.DB.First(&user, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "User fetched successfully",
		"user":    user,
	})
}

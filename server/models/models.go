package models

import (
	"time"

	"github.com/lib/pq"
	"gorm.io/gorm"
)

type User struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`

	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	Email         string `gorm:"uniqueIndex" json:"email"`
	Phone         string `gorm:"uniqueIndex" json:"phone"`
	Password      string `json:"-"`

	Bio           string `json:"bio"`
	IsOTPVerified bool   `gorm:"default:false" json:"is_otp_verified"`

	// ✅ OTP Fields Added
	OTPCode    string    `json:"-"` // OTP hidden in response
	OTPExpires time.Time `json:"-"`
}



type Blog struct {
	ID         uint           `gorm:"primaryKey" json:"id"`
	CreatedAt  time.Time      `json:"created_at"`
	UpdatedAt  time.Time      `json:"updated_at"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`

	Title      string `json:"title"`
	Content    string `json:"content"` 
	AuthorID   uint   `json:"author_id"`
	Author     User   `gorm:"foreignKey:AuthorID;constraint:OnDelete:CASCADE;" json:"author"`
	ImageURL string `json:"image_url"` // ✅ Optional blog image
	// ✅ Many-to-Many Relationship with User via likes table
	Likes      []Like    `gorm:"foreignKey:BlogID" json:"likes"`

	// ✅ Directly store user IDs who liked the blog (for quick fetch)
	LikedBy    pq.Int64Array `gorm:"type:integer[];default:'{}'" json:"liked_by"`

	Comments   []Comment `gorm:"foreignKey:BlogID" json:"comments"`
}



type Comment struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	Content string `json:"content"`
	UserID  uint   `json:"user_id"`
	BlogID  uint   `json:"blog_id"`

	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;" json:"user"`
	Blog Blog `gorm:"foreignKey:BlogID;constraint:OnDelete:CASCADE;" json:"blog"`
}

type Like struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	UserID    uint      `json:"user_id"`
	BlogID    uint      `json:"blog_id"`
	CreatedAt time.Time `json:"created_at"`

	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;" json:"user"`
}

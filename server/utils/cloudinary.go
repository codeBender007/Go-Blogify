package utils

import (
	"context"
	"fmt"
	"mime/multipart"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

// UploadImage uploads file to Cloudinary and returns the image URL
func UploadImage(file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	// ✅ Setup Cloudinary config from ENV variables
	cld, err := cloudinary.NewFromParams(
		os.Getenv("CLOUDINARY_CLOUD_NAME"),
		os.Getenv("CLOUDINARY_API_KEY"),
		os.Getenv("CLOUDINARY_API_SECRET"),
	)
	if err != nil {
		return "", fmt.Errorf("cloudinary config error: %v", err)
	}

	ctx := context.Background()

	// ✅ Upload file
	uploadResult, err := cld.Upload.Upload(ctx, file, uploader.UploadParams{
		Folder: "blog_images", // ✅ Save in blog_images folder in Cloudinary
	})
	if err != nil {
		return "", fmt.Errorf("cloudinary upload error: %v", err)
	}

	return uploadResult.SecureURL, nil
}

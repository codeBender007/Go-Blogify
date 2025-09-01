package utils

import (
	"time"
	"errors"

	"github.com/golang-jwt/jwt/v5"
)

func GenerateJWT(secret string, userID uint) (string, error) {
	claims := jwt.MapClaims{
		"sub": userID,
		"exp": time.Now().Add(24 * time.Hour * 7).Unix(),
		"iat": time.Now().Unix(),
	}
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return t.SignedString([]byte(secret))
}

func ParseJWT(secret, token string) (uint, error) {
	t, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("invalid signing method")
		}
		return []byte(secret), nil
	})
	if err != nil || !t.Valid {
		return 0, errors.New("invalid token")
	}
	if claims, ok := t.Claims.(jwt.MapClaims); ok {
		if sub, ok := claims["sub"].(float64); ok {
			return uint(sub), nil
		}
	}
	return 0, errors.New("invalid claims")
}

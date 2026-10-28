package auth

import "testing"

func TestPasswordRoundTrip(t *testing.T) {
	hash, err := HashPassword("correct-horse-battery")
	if err != nil {
		t.Fatal(err)
	}
	if !VerifyPassword("correct-horse-battery", hash) {
		t.Fatal("valid password rejected")
	}
	if VerifyPassword("wrong-password", hash) {
		t.Fatal("wrong password accepted")
	}
}

func TestPasswordValidation(t *testing.T) {
	if PasswordProblem("short") == "" {
		t.Fatal("short password accepted")
	}
	if PasswordProblem("password") == "" {
		t.Fatal("common password accepted")
	}
	if PasswordProblem("a-long-and-unique-passphrase") != "" {
		t.Fatal("valid password rejected")
	}
}

func TestTokenHashStable(t *testing.T) {
	if TokenHash("abc") != TokenHash("abc") {
		t.Fatal("token hash is not stable")
	}
	if TokenHash("abc") == TokenHash("abd") {
		t.Fatal("token hash collision")
	}
}

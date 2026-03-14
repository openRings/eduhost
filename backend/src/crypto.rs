use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::{PasswordHasher, PasswordVerifier, SaltString};
use argon2::{Algorithm, Argon2, Params, PasswordHash, Version};

pub fn hash_password(password: &str) -> String {
    let salt = SaltString::generate(&mut OsRng);

    // FIXME: add error handling
    argon2()
        .hash_password(password.as_bytes(), &salt)
        .unwrap()
        .to_string()
}

pub fn verify_password(password: &str, password_hash: &str) -> bool {
    // FIXME: add error handling
    let parsed_hash = PasswordHash::new(password_hash).unwrap();

    argon2()
        .verify_password(password.as_bytes(), &parsed_hash)
        .is_ok()
}

fn argon2<'a>() -> Argon2<'a> {
    Argon2::new(
        Algorithm::Argon2id,
        Version::V0x13,
        Params::new(1024 * 64, 3, 1, None).unwrap(),
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_password_returns_argon2_hash_and_not_plain_text() {
        let password = "StrongPassword123";

        let password_hash = hash_password(password);

        assert_ne!(
            password_hash, password,
            "hash must not equal plain password"
        );
        assert!(
            password_hash.starts_with("$argon2id$"),
            "hash must use argon2id format, got: {password_hash}"
        );
    }

    #[test]
    fn verify_password_returns_true_for_matching_password() {
        let password = "StrongPassword123";
        let password_hash = hash_password(password);

        let is_valid = verify_password(password, &password_hash);

        assert!(is_valid, "expected password verification to succeed");
    }

    #[test]
    fn verify_password_returns_false_for_non_matching_password() {
        let password_hash = hash_password("StrongPassword123");

        let is_valid = verify_password("WrongPassword123", &password_hash);

        assert!(!is_valid, "expected password verification to fail");
    }
}

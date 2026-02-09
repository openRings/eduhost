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

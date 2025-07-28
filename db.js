import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import 'dotenv/config';

const db = new sqlite3.Database('./database.sqlite');

// 암호화 키 (32바이트)
const SECRET_KEY = process.env.SECRET_KEY;
if (!SECRET_KEY || SECRET_KEY.length !== 32) {
    throw new Error('SECRET_KEY 환경변수가 없거나 32자리 hex 문자열이 아닙니다.');
}

// AES 설정
const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// 암호화 함수
function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
}

// 복호화 함수
function decrypt(encryptedText) {
    const [ivHex, data] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// 테이블 생성
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS user_keys (
      user_id TEXT PRIMARY KEY,
      api_key TEXT NOT NULL
    )
  `);
});

// 키 저장
export function saveUserKey(userId, apiKey, callback) {
    const encryptedKey = encrypt(apiKey);
    db.run(
        `INSERT OR REPLACE INTO user_keys (user_id, api_key) VALUES (?, ?)`,
        [userId, encryptedKey],
        callback
    );
}

// 키 불러오기
export function getUserKey(userId, callback) {
    db.get(
        `SELECT api_key FROM user_keys WHERE user_id = ?`,
        [userId],
        (err, row) => {
            if (err || !row) return callback(err, null);
            try {
                const decryptedKey = decrypt(row.api_key);
                callback(null, { api_key: decryptedKey });
            } catch (e) {
                callback(e, null);
            }
        }
    );
}

// 키 삭제
export function deleteUserKey(userId, callback) {
    db.run(`DELETE FROM user_keys WHERE user_id = ?`, [userId], callback);
}

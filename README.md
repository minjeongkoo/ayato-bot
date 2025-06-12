# Discord App - 카미사토 아야토

원신 캐릭터 '카미사토 아야토'의 말투로 대화하는 OpenAI 기반 디스코드 봇입니다.  
각 사용자가 직접 본인의 OpenAI API 키를 등록해 사용할 수 있도록 구성되었습니다.

---

## 기능

- `/키등록 [sk-...]` : OpenAI API 키를 등록합니다 (필수).
- `/키삭제` : 등록된 키를 삭제합니다.
- `/아야토 [내용]` : 아야토에게 말을 걸면 응답해줍니다 (200자 이내).
- `/정보` : 아야토에 대한 정보를 응답해 줍니다.


## 주의사항

- OpenAI API 키가 외부에 유출될 경우 과금 피해가 발생할 수 있으니 절대 공유하지 마세요.
- 등록된 키는 AES-256-CBC 방식으로 암호화되어 SQLite에 안전하게 저장됩니다.
- 이 봇은 사용자의 OpenAI API 키를 사용해 작동하므로 본인의 요금제 및 사용량을 반드시 확인하고, 불필요한 과도한 요청은 삼가주세요.

## 설치

[서버에 초대 & 앱으로 사용](https://discord.com/oauth2/authorize?client_id=1382569077557559377)
- 서버에 초대하여 사용하셔도 됩니다.
- 권장되는 방법은 "내 앱에 추가하기" 입니다.
- 외부 앱을 사용해도 되는 권한을 가진 서버에서 자유롭게 사용하세요.

---

## For Developer

1. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/your-id/ayatoBot.git
cd ayatoBot
npm install
```

2. .env 파일 생성

```plain text
DISCORD_TOKEN=디스코드봇토큰
SECRET_KEY=32바이트랜덤키 (예: openssl rand -hex 16)
FREE_USER_ID1=자유이용자ID (선택)
KOO_OPENAI_API_KEY=무료 제공용 OpenAI 키 (선택)
```

3. 명령어 등록
``` bash
npm run register
```

4. 실행
``` bash
npm start
```

---

## 문의 & 개선
아래 서버 "Q&A" 채널에 자유롭게 남겨주세요.
- https://discord.gg/eMkGTNYqJU

---

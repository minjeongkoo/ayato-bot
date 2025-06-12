// command.js

import 'dotenv/config';
import fetch from 'node-fetch';

/* OpenAi 키 등록 */
const registerKey = {
  name: '키등록',
  description: '당신의 OpenAI API 키를 등록합니다',
  type: 1,
  options: [
    {
      name: 'apikey',
      description: 'sk-로 시작하는 OpenAI API 키',
      type: 3,
      required: true,
    }
  ]
};

/* OpenAi 키 삭제 */
const deleteKey = {
  name: '키삭제',
  description: '등록한 OpenAI API 키를 삭제합니다',
  type: 1
};


// 명령어 정의
const toAyato = {
  name: '아야토',
  description: '대화하기',
  type: 1,
  options: [{
    name: '내용',
    description: '아야토에게...',
    type: 3, // String
    required: true,
  }]
};

const about = {
  name: '정보',
  description: '아야토 기본 정보',
  type: 1
}

const ALL_COMMANDS = [toAyato, registerKey, deleteKey, about];

// 슬래시 명령어 등록 함수
async function InstallGlobalCommands(appId, commands) {
  const url = `https://discord.com/api/v10/applications/${appId}/commands`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bot ${process.env.DISCORD_TOKEN}`,
    },
    body: JSON.stringify(commands),
  });

  if (!response.ok) {
    console.error(`[아야토 App] 커맨드 등록 실패: ${response.statusText}`);
    const errText = await response.text();
    console.error(errText);
  } else {
    console.log('[아야토 App] 전역 커맨드 등록 완료');
  }
}

// 명령어 등록 실행
InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);

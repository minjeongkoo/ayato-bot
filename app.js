// app.js

import { Client, GatewayIntentBits, Events } from 'discord.js';
import 'dotenv/config';
import { getAyatoReply } from './openai.js';
import { saveUserKey, getUserKey, deleteUserKey } from './db.js'

// 봇 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});


// 봇 준비 완료 로그
client.once(Events.ClientReady, () => {
  console.log(`[아야토 App] 로그인 완료 ${client.user.tag}`);
});

// 슬래시 명령어 처리
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const userMessage = interaction.options.getString('내용');
  const userId = interaction.user.id;

  if (commandName === '아야토') {

    const msg = interaction.options.getString('내용');
    if (msg.length > 200) return interaction.editReply({ content: `메시지를 200자 이내로 작성해 주세요. (요청: ${msg.length}자)`, ephemeral: true })

    // Free Request User
    if (userId === process.env.FREE_USER_ID1) {

      await interaction.deferReply();
      const reply = await getAyatoReply(msg, process.env.KOO_OPENAI_API_KEY);
      await interaction.editReply({
        content: `<@${userId}>: ${msg} ...\n: ${reply}`,
        ephemeral: false,
      });

    } else {
      await interaction.deferReply();

      // 키 조회
      const row = await new Promise((res, rej) => getUserKey(userId, (err, r) => err ? rej(err) : res(r)));
      if (!row) return interaction.editReply({ content: '먼저 `/키등록`으로 OpenAI 키를 등록해주세요.', ephemeral: true });

      // 조회 성공시
      const reply = await getAyatoReply(msg, row.api_key);
      await interaction.editReply({
        content: `\n<@${userId}>: ${msg} ...\nㄴ ${reply}`,

        ephemeral: false,
      });
    }
  }

  else if (commandName === '키삭제') {
    deleteUserKey(userId, (err) => {
      if (err) {
        console.error('(아야토 App) [DB Error]', err);
        interaction.reply({ content: '삭제 중 오류가 발생했습니다.', ephemeral: true });
      } else {
        interaction.reply({ content: 'API 키가 삭제되었습니다. 언제든 다시 `/키등록`으로 등록할 수 있습니다.', ephemeral: true });
      }
    });
    return;
  }

  else if (commandName === '키등록') {
    const apiKey = interaction.options.getString('apikey');

    if (!apiKey.startsWith('sk-')) {
      await interaction.reply({ content: '❌ 유효한 OpenAI API 키 형식이 아닙니다.', ephemeral: true });
      return;
    }

    saveUserKey(userId, apiKey, (err) => {
      if (err) {
        console.error('(아야토 App) [DB Error]', err);
        interaction.reply({ content: '등록 중 오류가 발생했습니다.', ephemeral: true });
      } else {
        interaction.reply({ content: 'API 키가 정상 등록되었습니다.\n이제 DM으로 아야토에게 자유롭게 메시지를 보내보세요.', ephemeral: true });
      }
    });
  }

  else if (commandName === '정보') {
    const information = `
## 카미사토 아야토
> 생각보다 일이 바빠서 이제야 인사 나누는군요. 카미사토 가문의 가주, 카미사토 아야토입니다. 잘 부탁해요.
### 소개
- 야시로 봉행 카미사토 가문의 현임 가주.
- 언제나 면밀한 방식으로 자신의 목적을 실현한다.
- 그가 지금 가장 중요하게 여기는 「목적」이 무엇인지 아는 사람은 거의 없다.
### 성별
- 남성
### 생일
- 3월 26일
### 신의 눈
- 물
### 무기
- 한손검
### 운명의 자리
- 수호의 떡갈나무 자리
### 출시 일자
- 2022년 03월 30일 (2.6 버전)`;

    await interaction.deferReply(); // 응답 예약
    await interaction.editReply(information); // 반드시 editReply

  }

});

// 슬래시 명령어 처리
client.on(Events.InteractionCreate, async interaction => {

  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const userId = interaction.user.id;


});

// 봇 로그인
client.login(process.env.DISCORD_TOKEN);

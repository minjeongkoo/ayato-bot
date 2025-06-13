// openai.js

import OpenAI from 'openai';
import 'dotenv/config';



const systemPrompt = `당신은 원신의 캐릭터 ‘카미사토 아야토’입니다. 야시로 봉행의 가주이며, 겉으로는 예의 바르고 겸손하지만 속은 빈틈없는 전략가입니다.  
부드럽고 정중함, 보통의 경우 존댓말 사용, 돌려 말함, 비유 사용, 여유로움, 계산적, 타인을 관찰하고 평가함, 자신감 있으나 과시하지 않음. 응답은 1문장.

말투 예시:
- 모든 것엔 대가가 있는 법이죠. 전 수단을 가리는 사람이 아닙니다.
- 이 시간에 절 찾아오셨으니, 좀 기다렸다가 같이 저녁 먹고 가요. 
- 힘이란 건 역시 자신이 쥐고 있어야 마음이 놓이죠.
- 씻고 잘 준비할 시간인가? 난 아직 안 졸리니, 먼저 내려가 있어···. 아, 당신이군요? 오늘 업무만 마저 정리하면 되니까, 당신도 일찍 쉬세요.
- 이건, 꽤나... 뜻밖의 선물이군요. 감사히 받겠습니다.
- 겨룰 때마다 느끼는 거지만, 날이 갈수록 향상되는 당신의 검술은 정말 감탄스럽네요.
- 얼음이 녹아 강물이 넘실거리고, 떨어지는 벚꽃이 갑옷을 수놓네
- 차와 다과를 준비하라고 명해뒀으니 조금만 더 같이 있어 주셨으면 합니다. 아름다운 봄빛을 함께 감상하고 싶거든요.
`

export async function getAyatoReply(userMessage, user_api_key) {

    let OPENAI_API_KEY = user_api_key;

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });

    try {

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: systemPrompt,
                },
                {
                    role: 'user',
                    content: `이 메시지에 대해 아야토처럼 답변: "${userMessage}"`,
                },
            ],
            temperature: 0.8,        // 창의성 조절 (기본값: 1.0)
            max_tokens: 150,         // 응답 최대 길이
            top_p: 1,                // 확률 기반 필터링 (기본값 1)
            frequency_penalty: 0.3,  // 반복 억제
            presence_penalty: 0.2    // 새로운 주제 언급 유도
        });

        return response.choices[0].message.content.trim();

    } catch (error) {

        console.error('(아야토 App) [OpenAI Error]', error.response?.data || error.message);
        return '가주님이 잠시 자리를 비우셨어요';
        
    }
}
const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require('openai');

// OpenAI APIの設定
const openai = new OpenAI({
	apiKey: ''
})
module.exports = {
    data: new SlashCommandBuilder()
        .setName('hey')
        .setDescription('会話を開始します。')
        .addStringOption(option => 
            option.setName('input')
                  .setDescription('何を話したいですか？')
                  .setRequired(true)),
    
    execute: async function(interaction) {
        // ユーザーが入力したテキストを取得
        const userInput = interaction.options.getString('input');

        try {
            // 初期応答を遅延させる
            await interaction.reply({ content: '処理中です...', ephemeral: true });

            // OpenAI APIにリクエストを送信
            const message = `User: ${userInput}\nBot:`;
            const response = await openai.chat.completions.create({
                model: "gpt-4", // 使いたいGPTのModel
                messages: [
                    { "role": "system", "content": "あなたは、オールマイトです。短文で質問に答えます。あなたの口調は、ヒーローとしての強さや威厳、正義感を反映しており、以下のような特徴があります。1：力強い言葉遣い。しばしば大声で話し、強調された言葉遣いをすることが多いです。あなたのセリフには、「○○だ！」や「私が来た！」など、力強く断定的な表現が多く見られます。2：古風で勇ましい。オールマイトの話し方は少し古風で、ヒーロー像を象徴するような勇ましさがあります。彼の日本語の口調は、特に決め台詞の際に、演説的で少し誇張された雰囲気を持っています。3:英語の使用。オールマイトは、しばしば英語を混ぜて話します。「SMASH！」や「UNITED STATES OF SMASH!」など、技名や感情の強調の際に英語を使用するのが特徴です。彼の英語は、アメリカのコミックヒーローに影響を受けたキャラクター性を反映しています。4：優しさと威厳の使い分け。オールマイトは、ヒーローとしての姿勢と普段の優しい一面を使い分けており、トーンの違いがあります。戦闘時やヒーローとして人々を鼓舞する場面では、声も口調も強くなりますが、デク（主人公）や他の生徒と接する時は、より柔らかく温かみのある言葉遣いをします。" },
                    { "role": "user", "content": message }]
            });

            // OpenAIからの応答を取得
            const botReply = response.choices[0].message.content;

            // フォローアップで応答を送信する
            await interaction.followUp({ content: botReply });
        } catch (error) {
            console.error('Error with OpenAI API:', error);
            // エラーが発生した場合もフォローアップでメッセージを送信する
            await interaction.followUp('Sorry, I had trouble thinking of a response.');
        }
    },
};

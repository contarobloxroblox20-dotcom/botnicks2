const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Nicks-base para criar combinações diferentes
const partes1 = [
    'zy', 'xe', 'ky', 'va', 'no', 'ze', 'lu', 'ry', 'vi', 'ka',
    'xa', 'ny', 'sy', 'vo', 'zi', 'ke', 'my', 'ay', 're', 'ix',
    'za', 'el', 'ox', 'vy', 'az', 'en', 'ev', 'ar', 'yn', 'ly'
];

const partes2 = [
    'ven', 'vex', 'zen', 'rix', 'ryn', 'zor', 'lyn', 'nox', 'vyn',
    'xen', 'zyl', 'ren', 'vox', 'kir', 'yro', 'xel', 'zan', 'ver',
    'nex', 'zyx', 'lor', 'vyr', 'zeno', 'kyo', 'xyr', 'rav', 'zel'
];

// Guarda os nicks já usados enquanto o bot estiver ligado
const nicksUsados = new Set();

function gerarNick() {
    let nick;

    do {
        const parte1 =
            partes1[Math.floor(Math.random() * partes1.length)];

        const parte2 =
            partes2[Math.floor(Math.random() * partes2.length)];

        nick = parte1 + parte2;

    } while (nicksUsados.has(nick));

    nicksUsados.add(nick);

    return nick;
}

function gerarLista() {
    const lista = [];

    while (lista.length < 8) {
        const nick = gerarNick();

        if (!lista.includes(nick)) {
            lista.push(nick);
        }
    }

    return lista;
}

function criarEmbed() {
    const nicks = gerarLista();

    return new EmbedBuilder()
        .setTitle('🔎 Nicks sugeridos')
        .setDescription(
            nicks.map((nick, index) => `**${index + 1}.** \`${nick}\``).join('\n')
        )
        .setFooter({
            text: 'Clique em 🔄 Gerar novamente para novos nicks'
        });
}

function criarBotoes() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('gerar_nicks')
            .setLabel('Gerar novamente')
            .setEmoji('🔄')
            .setStyle(ButtonStyle.Primary)
    );
}

client.once('clientReady', async () => {
    console.log(`🟢 Bot online como ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder()
            .setName('nicks')
            .setDescription('Gera uma lista de nicks aleatórios')
            .toJSON()
    ];

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('✅ Comando /nicks registrado!');
    } catch (error) {
        console.error('❌ Erro ao registrar comando:', error);
    }
});

client.on('interactionCreate', async interaction => {

    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'nicks') {
            await interaction.reply({
                embeds: [criarEmbed()],
                components: [criarBotoes()]
            });
        }
    }

    if (interaction.isButton()) {
        if (interaction.customId === 'gerar_nicks') {

            await interaction.update({
                embeds: [criarEmbed()],
                components: [criarBotoes()]
            });
        }
    }
});

client.login(TOKEN);
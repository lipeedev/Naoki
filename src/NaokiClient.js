import { Client, Collection } from 'discord.js';
import { readdir } from 'node:fs/promises';
import { Locale } from '../lib/Locale.js';
import { Utils } from './client/utils/Utils.js';
import { Colors} from './client/utils/Logger.js';
import { Emotes as Emojis } from './client/utils/Emotes.js';
import CommandSchema from './database/CommandSchema.js';
import UserSchema from './database/UserSchema.js';
import GuildSchema from './database/GuildSchema.js';
import { GatewayIntentBits, Partials } from 'discord.js';
import { config } from 'dotenv';
import pkg from 'mongoose';
const { connect } = pkg;
config();

export class NaokiClient extends Client {
    commands = {
        vanilla: new Collection()
    };
    database = {
        users: UserSchema,
        guilds: GuildSchema,
        commands: CommandSchema
    };
    owners = ['930672718876147763', '343778106340802580'];
    utils = Utils;
    emotes = Emojis;
    t = null;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildScheduledEvents
            ],
            failIfNotExists: false,
            partials: [
                Partials.User,
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction
            ],
            allowedMentions: {
                parse: ['users'],
                repliedUser: true
            },
            ws: { properties: { browser: 'Discord iOS' } },
            presence: {
                status: process.env.STATE == 'development' ? 'idle' : 'online',
                activities: [
                    { name: '/help', type: 2 }
                ]
            }
        });

        this.logger = (type, message) => console.log(`${Colors.YELLOW}${new Date().toISOString()}${Colors.RESET} [${Colors.CYAN}${type}${Colors.RESET}] ${Colors.GREY}--- ${Colors.RESET}${Colors.PURPLE}${message}${Colors.RESET}`);
    }

    async loadCommands() {
        const subfoldersV = await readdir('./src/commands/vanilla');
        for await (const folder of subfoldersV) {
            const files = await readdir(`./src/commands/vanilla/${folder}`);
            for await (const command of files) {
                if (!command.endsWith('.js')) continue;
                const { default: VanillaCommandClass } = await import(`./commands/vanilla/${folder}/${command}`);
                const cmd = new VanillaCommandClass(this);

                cmd.type = 'vanilla'; cmd.category = folder;
                await this.commands.vanilla.set(`${cmd.options.name}-prefix`, cmd);
                this.logger('Commands, Vanilla', `${cmd.options.name[0].toUpperCase()}${cmd.options.name.slice(1)} command loaded successfully`);
            }
        }

        const subfoldersA = await readdir('./src/commands/application');
        for await (const folder of subfoldersA) {
            const files = await readdir(`./src/commands/application/${folder}`);
            for await (const command of files) {
                if (!command.endsWith('.js')) continue;
                const { default: ApplicationCommandClass } = await import(`./commands/application/${folder}/${command}`);
                const cmd = new ApplicationCommandClass(this);
                
                cmd.type = 'application'; cmd.category = folder;
                await this.commands.vanilla.set(cmd.options.name, cmd);
                this.logger('Commands, Application', `${cmd.options.name[0].toUpperCase()}${cmd.options.name.slice(1)} command loaded successfully`);
            }
        }
    }

    async loadEvents() {
        const subfolders = await readdir('./src/client/events');
        for await (const folder of subfolders) {
            const files = await readdir(`./src/client/events/${folder}`);
            for await (const event of files) {
                if (!event.endsWith('.js')) continue;
                const { default: ClientEvent } = await import(`./client/events/${folder}/${event}`);
                const evnt = new ClientEvent(this);
                this[evnt.options.once ? 'once' : 'on'](evnt.options.name, (...args) => evnt.runEvent(...args));
                this.logger('Client, Events', `${evnt.options.name[0].toUpperCase()}${evnt.options.name.slice(1)} event loaded successfully`);
            }
        }
    }

    async getLang(parameter) {
        if (isNaN(parameter)) return parameter;
        const guild = await this.database.guilds.findOne({ guildId: parameter, });

        if (guild) {
            const lang = guild?.lang;

            if (!lang) {
                guild.lang = 'pt-BR';
                guild.save();

                return 'pt-BR';
            }

            return lang;
        }
    }

    async getTranslate(guild) {
        const language = await this.getLang(guild);
        const translate = new Locale('src/languages');

        this.t = await translate.init({
            returnUndefinied: false,
        });

        translate.setLang(language);

        return this.t;
    }

    async getData(id, type) {
        if (type === 'user') {
            let data = await this.database.users.findOne({ userId: id });
            if (!data) {
                await this.database.users.create({ userId: id });
                data = this.database.users.findOne({ userId: id });
                return data;
            }

            return data;
        }
        if (type === 'guild') {
            let data = await this.database.guilds.findOne({ guildId: id });
            if (!data) {
                await this.database.guilds.create({ guildId: id });
                data = this.database.guilds.findOne({ guildId: id });
                return data;
            }

            return data;
        }
    }

    async start() {
        await this.loadCommands();
        await this.loadEvents();
        connect(process.env.MONGO_URL);

        return super.login(process.env.TOKEN);
    }
}

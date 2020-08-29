# Discord Datamining Bot
The Discord Datamining Bot is a bot which posts updates in relation to Discord's Canary client updates.

## How it works
The bot checks [DJScias/Discord-Datamining](https://github.com/DJScias/Discord-Datamining) every minute to see if any new commits have been made.
The bot then checks if the commit has a comment from any of the whitelisted users found in [src/whitelist.json](https://github.com/ItsRauf/dataminev2/blob/master/src/whitelist.json)
If the bot finds a comment from a whitelisted user, it proceeds to post it to the channels which are subscribed.

## How to use the bot
* Invite the bot using https://discord.com/oauth2/authorize?client_id=507415798189654016&scope=bot&permissions=190464
* send `d!subcribe` in the channel you want the bot to send updates in. (use `d!subscribe {role id}` if you want it to mention a role)
* watch it work its magic

## How to whitelist a user
* visit `https://api.github.com/users/{their username}`
* copy their id
* edit [src/whitelist.json](https://github.com/ItsRauf/dataminev2/blob/master/src/whitelist.json), adding their id to the array
* create a pull request with the user's github link in the title
* wait for the pull request to be merged

--------

## Commands
**The bot's prefix is `d!`**

*{ } means optional and <> means required*

| Name        | Description                                             | Usage                    | User Permissions  |
|-------------|---------------------------------------------------------|--------------------------|-------------------|
| Subscribe   | Adds the current channel to Datamine Updates            | subscribe {role id}      | MANAGE_GUILD      |
| Unsubscribe | Removes the current channel from Datamine Updates       | unsubscribe              | MANAGE_GUILD      |
| Latest      | Sends the latest Datamine Update to the current channel | latest {true \| role id} | \*MENTION_EVERYONE|
| Set Role    | Sets the role to ping for Datamine Updates              | setrole \<role id\>      | MANAGE_GUILD      |

*\*The MENTION_EVERYONE permisison is not required if `{true | role id}` is not specified*

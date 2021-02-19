# Discord Datamining Bot
Datamine Updates is a bot that posts updates in relation to Discord's Canary client updates directly in your server

## How it works
It checks [DJScias/Discord-Datamining](https://github.com/DJScias/Discord-Datamining) every minute to see if any new commits have been made.
The bot then checks if the commit has a comment from any of the allowed users found in [src/whitelist.json](https://github.com/ItsRauf/dataminev2/blob/master/src/whitelist.json)
If it finds a comment from an allowed user, it proceeds to post it to the subscribed channels.

## How to use the bot?
* Invite the bot using this [link](https://discord.com/oauth2/authorize?client_id=507415798189654016&scope=bot&permissions=190464)
* Use the `d!subscribe` command in the channel you want the bot to send updates in. You can choose a role to be pinged each time using `d!subscribe [role ID]`
* Let the magic happen!

## How to add someone to the allowed users list?
* Go to `https://api.github.com/users/[username]`
* Copy their ID
* Edit [src/whitelist.json](https://github.com/ItsRauf/dataminev2/blob/master/src/whitelist.json) and add their ID to the array
* Create a pull request with the user's GitHub link as the title
* Wait for the PR to be merged

--------

## Commands
**Prefix:** `d!`

> *[ ] means optional and <> means required*

| Name          | Description                                             | Usage                     | User Permission   |
|---------------|---------------------------------------------------------|---------------------------|-------------------|
| d!subscribe   | Adds the current channel to Datamine Updates            | `subscribe [role ID]`     | MANAGE_GUILD      |
| d!unsubscribe | Removes the current channel from Datamine Updates       | `unsubscribe`             | MANAGE_GUILD      |
| d!latest      | Sends the latest Datamine Update to the current channel | `latest [true \| role ID]`| \*MENTION_EVERYONE|
| d!setrole    | Sets the role to ping for Datamine Updates               | `setrole \<role ID\>`     | MANAGE_GUILD      |

*\*The MENTION_EVERYONE permisison is not required if `[true | role ID]` is not specified*

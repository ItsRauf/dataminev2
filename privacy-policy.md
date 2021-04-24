# Discord Datamine Bot
The Discord Datamine Bot is a Discord Bot which forwards filtered comments from the [Discord-Datamining](https://github.com/Discord-Datamining/Discord-Datamining) repository.

## Application Data:
### Data that is used:
* The bot functions on data provided via GitHub and the [Discord-Datamining](https://github.com/Discord-Datamining/Discord-Datamining) repository.
* Discord provides the server id and channel id where the data from GitHub is forwarded through user subscription using the `d!subscribe` command.
* Users may also provide a role id using that same subscribe command.
---
### How the data is used:
* Data from GitHub gets sent out to subscribed channels through a Discord Message Embed.
* If provided, the bot will also ping a role that gets a notification when the bot posts the message.
---
### Storage of the data:
* Data that goes through the bot is stored on a MongoDB Database.
* This data is not shared outside of the bot or database.
---
### Removal of the data:
* Users can remove their server, channel, and role ids by using the `d!unsubscribe`
* Data that is stored that has been retrieved via GitHub can be removed by contacting me.

## Contact:
If you would like to contact me, my email is rauf@rauf.wtf or you can message me on Discord: Rauf#3543

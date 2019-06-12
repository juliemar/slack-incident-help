# slack-incident-help
This project will help you to create an incident using slack channel

I started this project folowing [this](https://tutorials.botsfloor.com/building-a-node-js-slack-bot-before-your-microwave-popcorn-is-ready-8946651a5071) simple steps to create my first prototype. When I finished my first prototype I used [this](https://github.com/colmdoyle/slack-incident-management) project as a code reference. 

Steps:
- run using `npm start`
- You have to configure a **slash command** `/incident` with the **Request URL** like `https://your.app.domain/`
- You have to enable **Interactivity** with the **Request URL** like `https://your.app.domain/action

**How is It works?**

**Call app with the slash command `/incident`**


![](http://i.imgur.com/v3CMJbs.png)


**Slack will open an incident dialog**

![](http://i.imgur.com/17ZdAnO.png)


**When you submit a form slack will create a incident channel**


![](http://i.imgur.com/DTpzPsT.png)


**And create a post with your first relevant informations**


![](http://i.imgur.com/i8vnzyR.png)




   

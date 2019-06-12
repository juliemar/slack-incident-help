require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require("request");


const { WebClient } = require('@slack/web-api');


const web = new WebClient(process.env.SLACK_AUTH_TOKEN);
const webUser = new WebClient(process.env.USER_TOKEN);


const sevEmoji = (function (importance){
    switch (importance) {
      case '0':
        return ':rotating_light:';
        break;

      case '1':
        return ':red_circle:';
        break;

      case '2':
        return ':blue_circle:';
        break;

      default:
        return ':white_circle:';
        break;
    }
  });


// Creates express app
const app = express();
// The port used for Express server
const PORT = 3000;
// Starts server
app.listen(process.env.PORT || PORT, function() {
  console.log('Bot is listening on port ' + PORT);
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post('/action', (req, res) => {

	const payload = JSON.parse(req.body.payload);

	const incidentDetails = payload.submission;

	console.log(payload);

	nameInc = payload.submission.title;


	console.log("nameInc:",nameInc);

	web.channels.create({ name: "#incd-"+nameInc }).then((response) => { console.log(response); 

		const incidentMessage= [
  		{
        type: 'section',
        text: {
          type: 'mrkdwn',
          // tslint:disable-next-line:max-line-length
          text: `${sevEmoji(incidentDetails.importance)} *[INCD-${nameInc}] An Incident has been opened by <@${payload.user.id}>*`,
        },
      },{
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*SEV*\n SEV${incidentDetails.importance}`,
          },
          {
            type: 'mrkdwn',
            text: `*Product*\n ${incidentDetails.product}`,
          },
          {
            type: 'mrkdwn',
            text: `*Commander*\n<@${incidentDetails.commander}>`,
          },
          {
            type: 'mrkdwn',
            text: `*Title*\n${incidentDetails.title}`,
          },
          {
            type: 'mrkdwn',
            text: `*Channel*\n<#${response.channel.id}>`,
          },
          {
            type: 'mrkdwn',
            // tslint:disable-next-line:max-line-length
            text: `*Incident started*\n<!date^${Math.round(Date.now() / 1000)}^{date_short} at {time_secs}|${Math.round(Date.now() / 1000)}>`,
          },
        ],
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Comments*\n${incidentDetails.comment}`,
        },
      },
    ];


    postMessage(response.channel.id,incidentMessage);
    postMessage(process.env.DEFAUL_INC_CHANNEL,incidentMessage);
	});


	res.json();
});


function postMessage(channelId,incidentMessage){
  webUser.chat.postMessage(
        {
          channel:channelId,
          text: 'An Incident has been opened',
          blocks: incidentMessage,
        },
      ).then((postedmessage) => {
        webUser.pins.add({ channel: postedmessage.channel, timestamp: postedmessage.ts });
  });
}

app.post('/', (req, res) => {

  web.chat.postMessage({
    channel: "#general",
    text: `The current time is today`,
  });


   const dialog = {
    "callback_id": "ryde-46e2b0",
    "title": "Create Incident",
    "submit_label": "Incident",
    "notify_on_cancel": true,
    "state": "Limo",
    elements: [
      {
        label: 'Incident title',
        name: 'title',
        type: 'text',
        placeholder: 'Title for this incident'
      },
      {
        label: 'SEV',
        name: 'importance',
        type: 'select',
        options: [
          {
            label: 'SEV0 - All hands on deck',
            value: '0',
          },
          {
            label: 'SEV1 - Critical impact to many users',
            value: '1',
          },
          {
            label: 'SEV2 - Minor issue that impacts ability to use product',
            value: '2',
          },
          {
            label: 'SEV3 - Minor issue not impacting ability to use product',
            value: '3',
          },
        ],
        placeholder: 'Set the severity level',
      },
      {
        label: 'Product',
        name: 'product',
        type: 'select',
        options: [
          {
            label: 'Calls',
            value: 'calls',
          },
          {
            label: 'Platform',
            value: 'platform',
          },
          {
            label: 'Desktop Client',
            value: 'desktop',
          },
          {
            label: 'Mobile App',
            value: 'mobile',
          },
        ],
        placeholder: 'Choose the impacted product',
      },
      {
        label: 'Incident Commander',
        name: 'commander',
        type: 'select',
        data_source: 'users',
      },
      {
        label: 'Comment',
        name: 'comment',
        type: 'textarea',
        optional: true,
      },
    ]
  }

  web.dialog.open({ dialog, trigger_id: req.body.trigger_id }).catch((response) => { console.log(response); 



  });



  //res.json();

	/*
	console.log("aqui: "+process.env.SLACK_AUTH_TOKEN);
var data = {form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "#general",
      text: "Hi! :wave: \n I'm your new bot."
    }};
	
	request.post('https://slack.com/api/chat.postMessage', data, function (error, response, body) {
     console.log(error,response)
      res.json();
    });*/
});
function sendDiscordNotification(sender, subject, body) {
  const webhookUrl = "";
  const payload = JSON.stringify({
    content: `**Sender:** ${sender}\n**Subject:** ${subject}\n**Body:** ${body}`
  });

  const options = {
    method: "post",
    contentType: "application/json",
    payload: payload
  };

  UrlFetchApp.fetch(webhookUrl, options);
}

function checkEmails() {
  const userProperties = PropertiesService.getUserProperties();
  const lastProcessedEmailId = userProperties.getProperty('LAST_PROCESSED_EMAIL_ID');

  const threads = GmailApp.getInboxThreads(0, 1); // Ambil thread email paling baru
  if (threads.length > 0) {
    const messages = threads[0].getMessages();
    const lastMessage = messages[messages.length - 1];

    const emailId = lastMessage.getId();
    if (emailId !== lastProcessedEmailId) {
      const sender = lastMessage.getFrom();
      const subject = lastMessage.getSubject();
      const body = lastMessage.getPlainBody();

      sendDiscordNotification(sender, subject, body);

      userProperties.setProperty('LAST_PROCESSED_EMAIL_ID', emailId);
    }
  }
}

function setupTrigger() {
  ScriptApp.newTrigger("checkEmails")
    .timeBased()
    .everyMinutes(1)
    .create();
}

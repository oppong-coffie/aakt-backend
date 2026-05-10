const { Resend } = require('resend');

const resend = new Resend('re_eV2j4hri_H8hAXgV6in1FUiEj9Y61QQB9');

async function testEmail() {
  try {
    const { data, error } = await resend.emails.send({
      from: 'AAKT <onboarding@resend.dev>',
      to: ['oppongcoffie27@gmail.com'],
      subject: 'Test Email',
      html: '<p>Test</p>'
    });

    if (error) {
      console.error('Resend Error:', error);
    } else {
      console.log('Success:', data);
    }
  } catch (err) {
    console.error('Catch Error:', err);
  }
}

testEmail();
